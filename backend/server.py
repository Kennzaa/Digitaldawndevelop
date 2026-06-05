from fastapi import FastAPI, APIRouter, HTTPException, Depends, Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
from pathlib import Path
from datetime import datetime, timezone
from typing import List, Optional

from models import (
    UserRegister,
    UserLogin,
    UserPublic,
    AuthResponse,
    OrderCreate,
    OrderStatusUpdate,
    Order,
)
from auth import (
    hash_password,
    verify_password,
    create_token,
    set_auth_cookie,
    clear_auth_cookie,
    get_current_user,
    get_current_user_optional,
    require_admin,
)
from pydantic import BaseModel
from typing import List
    
class OrderItem(BaseModel):
        name: str
        quantity: int
        price: float
    
class GuestVerifyRequest(BaseModel):
       email: str
   
class GuestOrderRequest(BaseModel):
        email: str
        name: str
       phone: str
        items: List[OrderItem]
        notes: str = ""
   
import resend
resend.api_key = os.environ.get("RESEND_API_KEY", "")

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# MongoDB connection
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="Digital Dawn Develop API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


# ---------------- Helpers ----------------
def serialize_doc(doc: dict) -> dict:
    """Make a Mongo doc JSON-safe (drop _id, datetimes -> iso)."""
    if not doc:
        return doc
    doc.pop("_id", None)
    for k, v in list(doc.items()):
        if isinstance(v, datetime):
            doc[k] = v.isoformat()
    return doc


def parse_dates(doc: dict) -> dict:
    if doc and isinstance(doc.get("created_at"), str):
        try:
            doc["created_at"] = datetime.fromisoformat(doc["created_at"])
        except Exception:
            pass
    return doc


# ---------------- Static services config ----------------
SERVICES = [
    {
        "id": "landing-page",
        "title": "Landing Page Website",
        "tagline": "High-converting, fast & beautiful pages",
        "icon": "Globe",
        "color": "#3B82F6",
    },
    {
        "id": "content-creator",
        "title": "Content Creator",
        "tagline": "Scroll-stopping content that grows your brand",
        "icon": "Sparkles",
        "color": "#0EA5E9",
    },
    {
        "id": "designer-reels-banner",
        "title": "Designer Reels & Banner",
        "tagline": "Cinematic reels and striking banners",
        "icon": "Clapperboard",
        "color": "#6366F1",
    },
    {
        "id": "whatsapp-business",
        "title": "WhatsApp Perusahaan",
        "tagline": "Professional WhatsApp Business setup",
        "icon": "MessageCircle",
        "color": "#22D3EE",
    },
    {
        "id": "social-ads",
        "title": "Ads Instagram, TikTok & Facebook",
        "tagline": "Targeted ad campaigns that drive results",
        "icon": "Megaphone",
        "color": "#2563EB",
    },
]


# ---------------- Routes: meta ----------------
@api_router.get("/")
async def root():
    return {"message": "Digital Dawn Develop API", "status": "ok"}


@api_router.get("/services")
async def get_services():
    return SERVICES


# ---------------- Routes: auth ----------------
@api_router.post("/auth/register", response_model=AuthResponse)
async def register(payload: UserRegister, response: Response):
    email = payload.email.lower().strip()
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_doc = {
        "id": str(uuid.uuid4()),
        "name": payload.name.strip(),
        "email": email,
        "password_hash": hash_password(payload.password),
        "role": "customer",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.users.insert_one(dict(user_doc))

    token = create_token(user_doc["id"], user_doc["role"])
    set_auth_cookie(response, token)
    public = UserPublic(
        id=user_doc["id"],
        name=user_doc["name"],
        email=user_doc["email"],
        role=user_doc["role"],
        created_at=datetime.fromisoformat(user_doc["created_at"]),
    )
    return AuthResponse(token=token, user=public)


@api_router.post("/auth/login", response_model=AuthResponse)
async def login(payload: UserLogin, response: Response):
    email = payload.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_token(user["id"], user.get("role", "customer"))
    set_auth_cookie(response, token)
    user = parse_dates(serialize_doc(user))
    public = UserPublic(**user)
    return AuthResponse(token=token, user=public)


@api_router.post("/auth/logout")
async def logout(response: Response):
    clear_auth_cookie(response)
    return {"ok": True}


@api_router.get("/auth/me", response_model=UserPublic)
async def me(payload: dict = Depends(get_current_user)):
    user = await db.users.find_one({"id": payload["sub"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user = parse_dates(serialize_doc(user))
    return UserPublic(**user)


# ---------------- Routes: orders ----------------
@api_router.post("/orders", response_model=Order)
async def create_order(
    payload: OrderCreate, user: Optional[dict] = Depends(get_current_user_optional)
):
    order = Order(**payload.model_dump())
    if user:
        order.user_id = user.get("sub")
    doc = order.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.orders.insert_one(dict(doc))
    return order


@api_router.get("/orders/me", response_model=List[Order])
async def my_orders(payload: dict = Depends(get_current_user)):
    user = await db.users.find_one({"id": payload["sub"]})
    email = user.get("email") if user else None
    query = {"$or": [{"user_id": payload["sub"]}]}
    if email:
        query["$or"].append({"email": email})
    orders = await db.orders.find(query).sort("created_at", -1).to_list(1000)
    return [Order(**parse_dates(serialize_doc(o))) for o in orders]


# ---------------- Routes: admin ----------------
@api_router.get("/admin/orders", response_model=List[Order])
async def admin_orders(
    status_filter: Optional[str] = None, _admin: dict = Depends(require_admin)
):
    query = {}
    if status_filter and status_filter != "all":
        query["status"] = status_filter
    orders = await db.orders.find(query).sort("created_at", -1).to_list(2000)
    return [Order(**parse_dates(serialize_doc(o))) for o in orders]


@api_router.get("/admin/stats")
async def admin_stats(_admin: dict = Depends(require_admin)):
    total = await db.orders.count_documents({})
    new = await db.orders.count_documents({"status": "new"})
    in_progress = await db.orders.count_documents({"status": "in_progress"})
    done = await db.orders.count_documents({"status": "done"})
    return {"total": total, "new": new, "in_progress": in_progress, "done": done}


@api_router.patch("/admin/orders/{order_id}", response_model=Order)
async def update_order_status(
    order_id: str, payload: OrderStatusUpdate, _admin: dict = Depends(require_admin)
):
    result = await db.orders.find_one_and_update(
        {"id": order_id},
        {"$set": {"status": payload.status}},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Order not found")
    return Order(**parse_dates(serialize_doc(result)))
# ---------------- Routes: guest verification ----------------

@api_router.post("/guest/request-verification")
async def request_verification(payload: GuestVerifyRequest):
    email = payload.email.lower().strip()
    
    # Buat token unik
    token = str(uuid.uuid4())
    expires_at = datetime.now(timezone.utc).replace(
        microsecond=0
    ).isoformat()
    
    # Simpan ke MongoDB
    await db.guest_verifications.insert_one({
        "email": email,
        "token": token,
        "verified": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    
    # Kirim email via Resend
    verify_url = f"https://digitaldawndevelop.xyz/verify?token={token}"
    resend.Emails.send({
        "from": "noreply@digitaldawndevelop.xyz",
        "to": email,
        "subject": "Verifikasi Email Kamu",
        "html": f"""
        <h2>Halo!</h2>
        <p>Klik tombol di bawah untuk memverifikasi email kamu dan melanjutkan pemesanan:</p>
        <a href="{verify_url}" style="
            background:#4F46E5;
            color:white;
            padding:12px 24px;
            border-radius:8px;
            text-decoration:none;
            display:inline-block;
            margin:16px 0;
        ">Verifikasi Email</a>
        <p>Link ini hanya berlaku sekali.</p>
        <p>Jika kamu tidak merasa meminta ini, abaikan email ini.</p>
        """
    })
    
    return {"ok": True, "message": "Email verifikasi telah dikirim"}


@api_router.get("/guest/verify/{token}")
async def verify_guest_token(token: str):
    record = await db.guest_verifications.find_one({"token": token})
    
    if not record:
        raise HTTPException(status_code=404, detail="Token tidak valid")
    
    if record.get("verified"):
        raise HTTPException(status_code=400, detail="Token sudah digunakan")
    
    # Tandai sebagai verified
    await db.guest_verifications.update_one(
        {"token": token},
        {"$set": {"verified": True}}
    )
    
    # Redirect ke halaman order dengan email sebagai query param
    email = record["email"]
    from fastapi.responses import RedirectResponse
    return RedirectResponse(
        url=f"https://digitaldawndevelop.xyz/order?email={email}&verified=true"
    )


@api_router.post("/orders/guest")
async def create_guest_order(payload: GuestOrderRequest):
    email = payload.email.lower().strip()
    
    # Cek apakah email sudah diverifikasi
    verified = await db.guest_verifications.find_one({
        "email": email,
        "verified": True
    })
    
    if not verified:
        raise HTTPException(
            status_code=403,
            detail="Email belum diverifikasi. Silakan verifikasi email terlebih dahulu."
        )
    
    # Simpan order
    order_doc = {
        "id": str(uuid.uuid4()),
        "email": email,
        "name": payload.name.strip(),
        "phone": payload.phone,
        "items": [item.dict() for item in payload.items],
        "notes": payload.notes,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.orders.insert_one(order_doc)
    
    return {"ok": True, "order_id": order_doc["id"], "message": "Pesanan berhasil dibuat!"}

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_router)

@app.on_event("startup")
async def seed_admin():
    """Seed an admin account from env vars (idempotent)."""
    admin_email = os.environ.get("ADMIN_EMAIL", "").lower().strip()
    admin_pass = os.environ.get("ADMIN_PASSWORD", "")
    if not admin_email or not admin_pass:
        return
    existing = await db.users.find_one({"email": admin_email})
    if existing:
        if existing.get("role") != "admin":
            await db.users.update_one(
                {"email": admin_email}, {"$set": {"role": "admin"}}
            )
        return
    await db.users.insert_one(
        {
            "id": str(uuid.uuid4()),
            "name": "Admin",
            "email": admin_email,
            "password_hash": hash_password(admin_pass),
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
    )
    logger.info("Seeded admin account: %s", admin_email)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
