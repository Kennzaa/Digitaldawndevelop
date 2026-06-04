#!/usr/bin/env python3
"""
Backend API Testing for Digital Dawn Develop - Cookie Auth Migration
Tests httpOnly cookie auth + Bearer token fallback.
"""
import requests
import sys
from datetime import datetime

BASE_URL = "https://gradient-showcase-18.preview.emergentagent.com/api"

# Admin credentials from .env
ADMIN_EMAIL = "Admin@digitaldawndevelop.xyz"
ADMIN_PASSWORD = "DigitalDawn2026!"

class CookieAuthTester:
    def __init__(self):
        self.tests_run = 0
        self.tests_passed = 0
        self.session = requests.Session()  # For cookie-based auth
        self.admin_token = None
        self.customer_token = None
        self.customer_email = f"test_cookie_{datetime.now().strftime('%Y%m%d_%H%M%S')}@test.com"
        self.test_order_id = None

    def log(self, msg, level="INFO"):
        """Log test messages"""
        prefix = {
            "INFO": "ℹ️ ",
            "SUCCESS": "✅",
            "ERROR": "❌",
            "WARNING": "⚠️ "
        }.get(level, "")
        print(f"{prefix} {msg}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, 
                 use_session=False, params=None):
        """Run a single API test"""
        url = f"{BASE_URL}{endpoint}"
        req_headers = {'Content-Type': 'application/json'}
        if headers:
            req_headers.update(headers)

        self.tests_run += 1
        self.log(f"\n{'='*70}")
        self.log(f"Test #{self.tests_run}: {name}")
        self.log(f"Method: {method} {endpoint}")
        self.log(f"Expected: {expected_status} | Using session: {use_session}")
        self.log(f"{'='*70}")
        
        try:
            client = self.session if use_session else requests
            
            if method == 'GET':
                response = client.get(url, headers=req_headers, params=params, timeout=10)
            elif method == 'POST':
                response = client.post(url, json=data, headers=req_headers, timeout=10)
            elif method == 'PATCH':
                response = client.patch(url, json=data, headers=req_headers, timeout=10)
            else:
                self.log(f"Unsupported method: {method}", "ERROR")
                return False, {}

            success = response.status_code == expected_status
            
            # Check for Set-Cookie header
            if 'Set-Cookie' in response.headers:
                self.log(f"🍪 Set-Cookie header present: {response.headers['Set-Cookie'][:100]}...")
            
            if success:
                self.tests_passed += 1
                self.log(f"PASSED - Status: {response.status_code}", "SUCCESS")
                try:
                    resp_data = response.json()
                    if isinstance(resp_data, dict) and len(str(resp_data)) < 500:
                        self.log(f"Response: {resp_data}")
                    elif isinstance(resp_data, list):
                        self.log(f"Response: List with {len(resp_data)} items")
                    return True, resp_data
                except:
                    return True, {}
            else:
                self.log(f"FAILED - Expected {expected_status}, got {response.status_code}", "ERROR")
                try:
                    self.log(f"Response: {response.json()}", "ERROR")
                except:
                    self.log(f"Response text: {response.text[:200]}", "ERROR")
                return False, {}

        except requests.exceptions.Timeout:
            self.log(f"FAILED - Request timeout", "ERROR")
            return False, {}
        except Exception as e:
            self.log(f"FAILED - Error: {str(e)}", "ERROR")
            return False, {}

    # ============ COOKIE AUTH TESTS ============
    
    def test_register_sets_cookie(self):
        """Test POST /api/auth/register sets httpOnly cookie AND returns token+user"""
        self.log("\n🔐 Testing Register Sets Cookie")
        success, response = self.run_test(
            "Register with Cookie",
            "POST",
            "/auth/register",
            200,
            data={
                "name": "Test Customer",
                "email": self.customer_email,
                "password": "TestPass123!"
            },
            use_session=True
        )
        if success:
            if response.get('token') and response.get('user'):
                self.customer_token = response['token']
                self.log(f"Token returned: {self.customer_token[:20]}...", "SUCCESS")
                self.log(f"User: {response['user'].get('email')} (role: {response['user'].get('role')})", "SUCCESS")
                # Check if cookie was set in session
                cookies = self.session.cookies.get_dict()
                if 'ddd_token' in cookies:
                    self.log(f"Cookie 'ddd_token' set in session", "SUCCESS")
                    return True
                else:
                    self.log(f"Cookie 'ddd_token' NOT found in session. Cookies: {cookies}", "ERROR")
                    return False
            else:
                self.log(f"Missing token or user in response", "ERROR")
                return False
        return False

    def test_login_sets_cookie(self):
        """Test POST /api/auth/login sets httpOnly cookie AND returns token+user"""
        self.log("\n🔐 Testing Login Sets Cookie (Admin)")
        # Use a fresh session for admin
        admin_session = requests.Session()
        
        url = f"{BASE_URL}/auth/login"
        response = admin_session.post(url, json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        }, timeout=10)
        
        self.tests_run += 1
        if response.status_code == 200:
            self.tests_passed += 1
            data = response.json()
            if data.get('token') and data.get('user'):
                self.admin_token = data['token']
                self.log(f"PASSED - Admin login successful", "SUCCESS")
                self.log(f"Token returned: {self.admin_token[:20]}...", "SUCCESS")
                self.log(f"User: {data['user'].get('email')} (role: {data['user'].get('role')})", "SUCCESS")
                
                # Check cookie
                cookies = admin_session.cookies.get_dict()
                if 'ddd_token' in cookies:
                    self.log(f"Cookie 'ddd_token' set in session", "SUCCESS")
                    return True
                else:
                    self.log(f"Cookie 'ddd_token' NOT found. Cookies: {cookies}", "ERROR")
                    return False
            else:
                self.log(f"Missing token or user in response", "ERROR")
                return False
        else:
            self.log(f"FAILED - Status {response.status_code}: {response.text[:200]}", "ERROR")
            return False

    def test_auth_me_cookie_only(self):
        """Test GET /api/auth/me works with ONLY cookie (no Authorization header)"""
        self.log("\n🔐 Testing /auth/me with Cookie Only (No Header)")
        success, response = self.run_test(
            "Auth Me - Cookie Only",
            "GET",
            "/auth/me",
            200,
            use_session=True  # Uses session with cookie, no Authorization header
        )
        if success and response.get('email'):
            self.log(f"User retrieved via cookie: {response.get('email')}", "SUCCESS")
            return True
        return False

    def test_auth_me_bearer_only(self):
        """Test GET /api/auth/me works with Authorization Bearer header (no cookie)"""
        self.log("\n🔐 Testing /auth/me with Bearer Token Only (No Cookie)")
        # Use requests (not session) to avoid sending cookie
        success, response = self.run_test(
            "Auth Me - Bearer Only",
            "GET",
            "/auth/me",
            200,
            headers={"Authorization": f"Bearer {self.customer_token}"},
            use_session=False  # Don't use session, so no cookie sent
        )
        if success and response.get('email'):
            self.log(f"User retrieved via Bearer token: {response.get('email')}", "SUCCESS")
            return True
        return False

    def test_auth_me_no_auth(self):
        """Test GET /api/auth/me returns 401 with neither cookie nor header"""
        self.log("\n🔐 Testing /auth/me with No Auth (Expect 401)")
        # Use fresh requests (no session, no header)
        success, response = self.run_test(
            "Auth Me - No Auth",
            "GET",
            "/auth/me",
            401,
            use_session=False
        )
        if success:
            self.log(f"Correctly returned 401 for unauthenticated request", "SUCCESS")
            return True
        return False

    def test_logout_clears_cookie(self):
        """Test POST /api/auth/logout clears cookie (subsequent /auth/me is 401)"""
        self.log("\n🔐 Testing Logout Clears Cookie")
        
        # First, verify we're authenticated via cookie
        self.log("Step 1: Verify authenticated before logout")
        success, _ = self.run_test(
            "Auth Me Before Logout",
            "GET",
            "/auth/me",
            200,
            use_session=True
        )
        if not success:
            self.log("Failed to verify auth before logout", "ERROR")
            return False
        
        # Logout
        self.log("Step 2: Call logout endpoint")
        success, _ = self.run_test(
            "Logout",
            "POST",
            "/auth/logout",
            200,
            use_session=True
        )
        if not success:
            self.log("Logout endpoint failed", "ERROR")
            return False
        
        # Verify cookie cleared - /auth/me should now return 401
        self.log("Step 3: Verify /auth/me returns 401 after logout")
        success, _ = self.run_test(
            "Auth Me After Logout (Expect 401)",
            "GET",
            "/auth/me",
            401,
            use_session=True
        )
        if success:
            self.log("Cookie successfully cleared - /auth/me returns 401", "SUCCESS")
            return True
        else:
            self.log("Cookie NOT cleared - /auth/me still works", "ERROR")
            return False

    # ============ ADMIN ENDPOINT TESTS ============
    
    def test_admin_orders_via_cookie(self):
        """Test admin endpoints work via cookie auth"""
        self.log("\n🔐 Testing Admin Orders via Cookie")
        
        # Login admin with new session
        admin_session = requests.Session()
        login_resp = admin_session.post(f"{BASE_URL}/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        }, timeout=10)
        
        if login_resp.status_code != 200:
            self.log("Admin login failed", "ERROR")
            return False
        
        # Test admin endpoint with cookie (no Authorization header)
        self.tests_run += 1
        orders_resp = admin_session.get(f"{BASE_URL}/admin/orders", timeout=10)
        
        if orders_resp.status_code == 200:
            self.tests_passed += 1
            orders = orders_resp.json()
            self.log(f"PASSED - Admin retrieved {len(orders)} orders via cookie", "SUCCESS")
            return True
        else:
            self.log(f"FAILED - Status {orders_resp.status_code}", "ERROR")
            return False

    def test_admin_stats_via_cookie(self):
        """Test admin stats endpoint via cookie"""
        self.log("\n🔐 Testing Admin Stats via Cookie")
        
        # Login admin with new session
        admin_session = requests.Session()
        login_resp = admin_session.post(f"{BASE_URL}/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        }, timeout=10)
        
        if login_resp.status_code != 200:
            self.log("Admin login failed", "ERROR")
            return False
        
        # Test stats endpoint with cookie
        self.tests_run += 1
        stats_resp = admin_session.get(f"{BASE_URL}/admin/stats", timeout=10)
        
        if stats_resp.status_code == 200:
            self.tests_passed += 1
            stats = stats_resp.json()
            self.log(f"PASSED - Stats: total={stats.get('total')}, new={stats.get('new')}", "SUCCESS")
            return True
        else:
            self.log(f"FAILED - Status {stats_resp.status_code}", "ERROR")
            return False

    def test_admin_forbidden_for_customer(self):
        """Test admin endpoints return 403 for customer (via cookie)"""
        self.log("\n🔐 Testing Admin Endpoint Returns 403 for Customer")
        
        # Re-login customer (session was cleared by logout test)
        self.log("Re-logging in customer for this test")
        login_resp = self.session.post(f"{BASE_URL}/auth/login", json={
            "email": self.customer_email,
            "password": "TestPass123!"
        }, timeout=10)
        
        if login_resp.status_code != 200:
            self.log("Customer re-login failed", "ERROR")
            return False
        
        # Now test admin endpoint with customer cookie
        success, _ = self.run_test(
            "Admin Orders as Customer (Expect 403)",
            "GET",
            "/admin/orders",
            403,
            use_session=True  # Customer session
        )
        if success:
            self.log("Correctly blocked customer from admin endpoint", "SUCCESS")
            return True
        return False

    # ============ ORDER ENDPOINT TESTS ============
    
    def test_create_order_guest(self):
        """Test POST /api/orders works for guest (no auth)"""
        self.log("\n📦 Testing Order Creation (Guest)")
        success, response = self.run_test(
            "Create Order - Guest",
            "POST",
            "/orders",
            200,
            data={
                "name": "Guest User",
                "email": "guest@test.com",
                "phone": "081234567890",
                "company": "Test Co",
                "services": ["Landing Page Website"],
                "budget": "Rp 5 - 10 juta",
                "deadline": "1 - 2 minggu",
                "message": "Test guest order"
            },
            use_session=False
        )
        if success and response.get('id'):
            self.log(f"Guest order created: {response['id']}", "SUCCESS")
            return True
        return False

    def test_create_order_authenticated(self):
        """Test POST /api/orders works for authenticated user (via cookie)"""
        self.log("\n📦 Testing Order Creation (Authenticated via Cookie)")
        success, response = self.run_test(
            "Create Order - Authenticated",
            "POST",
            "/orders",
            200,
            data={
                "name": "Test Customer",
                "email": self.customer_email,
                "phone": "081234567890",
                "company": "Test Co",
                "services": ["Content Creator", "Designer Reels & Banner"],
                "budget": "Rp 10 - 20 juta",
                "deadline": "3 - 4 minggu",
                "message": "Test authenticated order"
            },
            use_session=True  # Uses customer cookie
        )
        if success and response.get('id'):
            self.test_order_id = response['id']
            self.log(f"Authenticated order created: {self.test_order_id}", "SUCCESS")
            return True
        return False

    def test_my_orders_via_cookie(self):
        """Test GET /api/orders/me via cookie"""
        self.log("\n📦 Testing My Orders via Cookie")
        success, response = self.run_test(
            "Get My Orders",
            "GET",
            "/orders/me",
            200,
            use_session=True
        )
        if success and isinstance(response, list):
            self.log(f"Retrieved {len(response)} order(s)", "SUCCESS")
            return True
        return False

    def test_update_order_status_via_cookie(self):
        """Test PATCH /api/admin/orders/{id} via cookie"""
        self.log("\n📦 Testing Update Order Status via Cookie")
        
        if not self.test_order_id:
            self.log("No test order ID, skipping", "WARNING")
            return True
        
        # Login admin with new session
        admin_session = requests.Session()
        login_resp = admin_session.post(f"{BASE_URL}/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        }, timeout=10)
        
        if login_resp.status_code != 200:
            self.log("Admin login failed", "ERROR")
            return False
        
        # Update order status
        self.tests_run += 1
        update_resp = admin_session.patch(
            f"{BASE_URL}/admin/orders/{self.test_order_id}",
            json={"status": "in_progress"},
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if update_resp.status_code == 200:
            self.tests_passed += 1
            order = update_resp.json()
            self.log(f"PASSED - Order status updated to: {order.get('status')}", "SUCCESS")
            return True
        else:
            self.log(f"FAILED - Status {update_resp.status_code}", "ERROR")
            return False

    def run_all_tests(self):
        """Run all backend tests"""
        self.log("\n" + "="*70)
        self.log("🚀 Backend Cookie Auth Migration Tests - Digital Dawn Develop")
        self.log("="*70)
        self.log(f"Base URL: {BASE_URL}")
        self.log(f"Timestamp: {datetime.now().isoformat()}")
        
        tests = [
            ("Register Sets Cookie", self.test_register_sets_cookie),
            ("Login Sets Cookie", self.test_login_sets_cookie),
            ("Auth Me - Cookie Only", self.test_auth_me_cookie_only),
            ("Auth Me - Bearer Only", self.test_auth_me_bearer_only),
            ("Auth Me - No Auth (401)", self.test_auth_me_no_auth),
            ("Logout Clears Cookie", self.test_logout_clears_cookie),
            ("Admin Orders via Cookie", self.test_admin_orders_via_cookie),
            ("Admin Stats via Cookie", self.test_admin_stats_via_cookie),
            ("Admin Forbidden for Customer", self.test_admin_forbidden_for_customer),
            ("Create Order - Guest", self.test_create_order_guest),
            ("Create Order - Authenticated", self.test_create_order_authenticated),
            ("My Orders via Cookie", self.test_my_orders_via_cookie),
            ("Update Order Status via Cookie", self.test_update_order_status_via_cookie),
        ]
        
        failed_tests = []
        for test_name, test_func in tests:
            try:
                result = test_func()
                if not result:
                    failed_tests.append(test_name)
            except Exception as e:
                self.log(f"Test '{test_name}' crashed: {str(e)}", "ERROR")
                failed_tests.append(test_name)
        
        # Summary
        self.log("\n" + "="*70)
        self.log("📊 TEST SUMMARY")
        self.log("="*70)
        self.log(f"Total Tests: {self.tests_run}")
        self.log(f"Passed: {self.tests_passed} ✅")
        self.log(f"Failed: {self.tests_run - self.tests_passed} ❌")
        success_rate = (self.tests_passed/self.tests_run*100) if self.tests_run > 0 else 0
        self.log(f"Success Rate: {success_rate:.1f}%")
        
        if failed_tests:
            self.log("\n❌ Failed Tests:", "ERROR")
            for test in failed_tests:
                self.log(f"  - {test}", "ERROR")
        else:
            self.log("\n✅ All tests passed!", "SUCCESS")
        
        self.log("="*70)
        
        return 0 if len(failed_tests) == 0 else 1

def main():
    tester = CookieAuthTester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())
