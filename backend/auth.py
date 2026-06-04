import os
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from fastapi import Depends, HTTPException, Request, Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

JWT_SECRET = os.environ.get("JWT_SECRET", "dev_secret")
JWT_ALG = "HS256"
JWT_EXP_DAYS = 30
COOKIE_NAME = "ddd_token"
COOKIE_MAX_AGE = JWT_EXP_DAYS * 24 * 3600

security = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_token(user_id: str, role: str) -> str:
    payload = {
        "sub": user_id,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(days=JWT_EXP_DAYS),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


def set_auth_cookie(response: Response, token: str) -> None:
    """Store the JWT in a secure, httpOnly cookie (mitigates XSS token theft)."""
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        max_age=COOKIE_MAX_AGE,
        httponly=True,
        secure=True,
        samesite="lax",
        path="/",
    )


def clear_auth_cookie(response: Response) -> None:
    response.delete_cookie(key=COOKIE_NAME, path="/")


def _extract_token(request: Request, creds: HTTPAuthorizationCredentials) -> str | None:
    """Prefer Authorization Bearer header (for API clients/tests), fall back to httpOnly cookie."""
    if creds is not None:
        return creds.credentials
    return request.cookies.get(COOKIE_NAME)


async def get_current_user(
    request: Request,
    creds: HTTPAuthorizationCredentials = Depends(security),
):
    token = _extract_token(request, creds)
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return decode_token(token)


async def get_current_user_optional(
    request: Request,
    creds: HTTPAuthorizationCredentials = Depends(security),
):
    """Return payload if a valid token is present, else None (no error)."""
    token = _extract_token(request, creds)
    if not token:
        return None
    try:
        return decode_token(token)
    except HTTPException:
        return None


async def require_admin(payload: dict = Depends(get_current_user)):
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return payload
