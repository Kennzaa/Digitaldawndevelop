#!/usr/bin/env python3
"""
Backend API Testing for Digital Dawn Develop
Tests all backend endpoints with proper authentication and authorization.
"""
import requests
import sys
from datetime import datetime

BASE_URL = "https://gradient-showcase-18.preview.emergentagent.com/api"

# Admin credentials from .env
ADMIN_EMAIL = "Admin@digitaldawndevelop.xyz"
ADMIN_PASSWORD = "DigitalDawn2026!"

class APITester:
    def __init__(self):
        self.tests_run = 0
        self.tests_passed = 0
        self.admin_token = None
        self.customer_token = None
        self.customer_email = f"test_customer_{datetime.now().strftime('%Y%m%d_%H%M%S')}@test.com"
        self.test_order_id = None

    def log(self, msg, level="INFO"):
        """Log test messages"""
        print(f"[{level}] {msg}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, params=None):
        """Run a single API test"""
        url = f"{BASE_URL}{endpoint}"
        req_headers = {'Content-Type': 'application/json'}
        if headers:
            req_headers.update(headers)

        self.tests_run += 1
        self.log(f"\n{'='*60}")
        self.log(f"Test #{self.tests_run}: {name}")
        self.log(f"{'='*60}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=req_headers, params=params, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=req_headers, timeout=10)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=req_headers, timeout=10)
            else:
                self.log(f"Unsupported method: {method}", "ERROR")
                return False, {}

            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                self.log(f"✅ PASSED - Status: {response.status_code}", "SUCCESS")
                try:
                    resp_data = response.json()
                    self.log(f"Response: {resp_data}")
                    return True, resp_data
                except:
                    return True, {}
            else:
                self.log(f"❌ FAILED - Expected {expected_status}, got {response.status_code}", "ERROR")
                try:
                    self.log(f"Response: {response.json()}", "ERROR")
                except:
                    self.log(f"Response text: {response.text}", "ERROR")
                return False, {}

        except requests.exceptions.Timeout:
            self.log(f"❌ FAILED - Request timeout", "ERROR")
            return False, {}
        except Exception as e:
            self.log(f"❌ FAILED - Error: {str(e)}", "ERROR")
            return False, {}

    def test_services(self):
        """Test GET /api/services - should return 5 services"""
        self.log("\n🔍 Testing Services Endpoint")
        success, response = self.run_test(
            "Get Services List",
            "GET",
            "/services",
            200
        )
        if success:
            if isinstance(response, list) and len(response) == 5:
                self.log(f"✅ Correct: Found 5 services", "SUCCESS")
                for svc in response:
                    self.log(f"  - {svc.get('title', 'N/A')}")
                return True
            else:
                self.log(f"❌ Expected 5 services, got {len(response) if isinstance(response, list) else 'invalid response'}", "ERROR")
                return False
        return False

    def test_register(self):
        """Test POST /api/auth/register - create customer account"""
        self.log("\n🔍 Testing Customer Registration")
        success, response = self.run_test(
            "Register New Customer",
            "POST",
            "/auth/register",
            200,
            data={
                "name": "Test Customer",
                "email": self.customer_email,
                "password": "TestPass123!"
            }
        )
        if success and response.get('token') and response.get('user'):
            self.customer_token = response['token']
            user = response['user']
            self.log(f"✅ Customer registered: {user.get('name')} ({user.get('email')})", "SUCCESS")
            self.log(f"✅ Customer role: {user.get('role')}", "SUCCESS")
            return True
        return False

    def test_admin_login(self):
        """Test POST /api/auth/login - admin login"""
        self.log("\n🔍 Testing Admin Login")
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "/auth/login",
            200,
            data={
                "email": ADMIN_EMAIL,
                "password": ADMIN_PASSWORD
            }
        )
        if success and response.get('token') and response.get('user'):
            self.admin_token = response['token']
            user = response['user']
            self.log(f"✅ Admin logged in: {user.get('name')} ({user.get('email')})", "SUCCESS")
            self.log(f"✅ Admin role: {user.get('role')}", "SUCCESS")
            if user.get('role') != 'admin':
                self.log(f"❌ Expected role 'admin', got '{user.get('role')}'", "ERROR")
                return False
            return True
        return False

    def test_customer_login(self):
        """Test POST /api/auth/login - customer login"""
        self.log("\n🔍 Testing Customer Login")
        success, response = self.run_test(
            "Customer Login",
            "POST",
            "/auth/login",
            200,
            data={
                "email": self.customer_email,
                "password": "TestPass123!"
            }
        )
        if success and response.get('token'):
            self.log(f"✅ Customer login successful", "SUCCESS")
            return True
        return False

    def test_auth_me(self):
        """Test GET /api/auth/me - get current user with Bearer token"""
        self.log("\n🔍 Testing Auth Me Endpoint")
        
        # Test with customer token
        success, response = self.run_test(
            "Get Current User (Customer)",
            "GET",
            "/auth/me",
            200,
            headers={"Authorization": f"Bearer {self.customer_token}"}
        )
        if not success:
            return False
        
        # Test with admin token
        success, response = self.run_test(
            "Get Current User (Admin)",
            "GET",
            "/auth/me",
            200,
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        return success

    def test_create_order_guest(self):
        """Test POST /api/orders - create order as guest"""
        self.log("\n🔍 Testing Order Creation (Guest)")
        success, response = self.run_test(
            "Create Order (Guest)",
            "POST",
            "/orders",
            200,
            data={
                "name": "Guest Customer",
                "email": "guest@test.com",
                "phone": "081234567890",
                "company": "Test Company",
                "services": ["Landing Page Website", "Content Creator"],
                "budget": "Rp 5 - 10 juta",
                "deadline": "1 - 2 minggu",
                "message": "Test order from guest user"
            }
        )
        if success and response.get('id'):
            self.log(f"✅ Guest order created with ID: {response['id']}", "SUCCESS")
            return True
        return False

    def test_create_order_authenticated(self):
        """Test POST /api/orders - create order as authenticated user"""
        self.log("\n🔍 Testing Order Creation (Authenticated)")
        success, response = self.run_test(
            "Create Order (Authenticated)",
            "POST",
            "/orders",
            200,
            data={
                "name": "Test Customer",
                "email": self.customer_email,
                "phone": "081234567890",
                "company": "Test Company",
                "services": ["Designer Reels & Banner", "WhatsApp Perusahaan"],
                "budget": "Rp 10 - 20 juta",
                "deadline": "3 - 4 minggu",
                "message": "Test order from authenticated customer"
            },
            headers={"Authorization": f"Bearer {self.customer_token}"}
        )
        if success and response.get('id'):
            self.test_order_id = response['id']
            self.log(f"✅ Authenticated order created with ID: {self.test_order_id}", "SUCCESS")
            return True
        return False

    def test_my_orders(self):
        """Test GET /api/orders/me - get user's orders"""
        self.log("\n🔍 Testing My Orders Endpoint")
        success, response = self.run_test(
            "Get My Orders",
            "GET",
            "/orders/me",
            200,
            headers={"Authorization": f"Bearer {self.customer_token}"}
        )
        if success and isinstance(response, list):
            self.log(f"✅ Found {len(response)} order(s) for customer", "SUCCESS")
            return True
        return False

    def test_admin_orders_forbidden(self):
        """Test GET /api/admin/orders - should return 403 for customer"""
        self.log("\n🔍 Testing Admin Orders (Customer - Should Fail)")
        success, response = self.run_test(
            "Admin Orders (Customer - Expect 403)",
            "GET",
            "/admin/orders",
            403,
            headers={"Authorization": f"Bearer {self.customer_token}"}
        )
        if success:
            self.log(f"✅ Correctly blocked customer from admin endpoint", "SUCCESS")
            return True
        return False

    def test_admin_orders(self):
        """Test GET /api/admin/orders - admin access"""
        self.log("\n🔍 Testing Admin Orders Endpoint")
        success, response = self.run_test(
            "Get All Orders (Admin)",
            "GET",
            "/admin/orders",
            200,
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        if success and isinstance(response, list):
            self.log(f"✅ Admin retrieved {len(response)} order(s)", "SUCCESS")
            return True
        return False

    def test_admin_stats(self):
        """Test GET /api/admin/stats - get order statistics"""
        self.log("\n🔍 Testing Admin Stats Endpoint")
        success, response = self.run_test(
            "Get Admin Stats",
            "GET",
            "/admin/stats",
            200,
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        if success and 'total' in response:
            self.log(f"✅ Stats retrieved:", "SUCCESS")
            self.log(f"  - Total: {response.get('total', 0)}")
            self.log(f"  - New: {response.get('new', 0)}")
            self.log(f"  - In Progress: {response.get('in_progress', 0)}")
            self.log(f"  - Done: {response.get('done', 0)}")
            return True
        return False

    def test_update_order_status(self):
        """Test PATCH /api/admin/orders/{id} - update order status"""
        self.log("\n🔍 Testing Order Status Update")
        if not self.test_order_id:
            self.log("⚠️  No test order ID available, skipping status update test", "WARNING")
            return True  # Don't fail if we don't have an order
        
        success, response = self.run_test(
            "Update Order Status (Admin)",
            "PATCH",
            f"/admin/orders/{self.test_order_id}",
            200,
            data={"status": "in_progress"},
            headers={"Authorization": f"Bearer {self.admin_token}"}
        )
        if success and response.get('status') == 'in_progress':
            self.log(f"✅ Order status updated to 'in_progress'", "SUCCESS")
            return True
        return False

    def run_all_tests(self):
        """Run all backend tests in sequence"""
        self.log("\n" + "="*60)
        self.log("🚀 Starting Backend API Tests for Digital Dawn Develop")
        self.log("="*60)
        self.log(f"Base URL: {BASE_URL}")
        self.log(f"Timestamp: {datetime.now().isoformat()}")
        
        # Run tests in order
        tests = [
            ("Services", self.test_services),
            ("Register", self.test_register),
            ("Admin Login", self.test_admin_login),
            ("Customer Login", self.test_customer_login),
            ("Auth Me", self.test_auth_me),
            ("Create Order (Guest)", self.test_create_order_guest),
            ("Create Order (Authenticated)", self.test_create_order_authenticated),
            ("My Orders", self.test_my_orders),
            ("Admin Orders (Forbidden)", self.test_admin_orders_forbidden),
            ("Admin Orders", self.test_admin_orders),
            ("Admin Stats", self.test_admin_stats),
            ("Update Order Status", self.test_update_order_status),
        ]
        
        failed_tests = []
        for test_name, test_func in tests:
            try:
                result = test_func()
                if not result:
                    failed_tests.append(test_name)
            except Exception as e:
                self.log(f"❌ Test '{test_name}' crashed: {str(e)}", "ERROR")
                failed_tests.append(test_name)
        
        # Print summary
        self.log("\n" + "="*60)
        self.log("📊 TEST SUMMARY")
        self.log("="*60)
        self.log(f"Total Tests: {self.tests_run}")
        self.log(f"Passed: {self.tests_passed}")
        self.log(f"Failed: {self.tests_run - self.tests_passed}")
        self.log(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if failed_tests:
            self.log("\n❌ Failed Tests:", "ERROR")
            for test in failed_tests:
                self.log(f"  - {test}", "ERROR")
        else:
            self.log("\n✅ All tests passed!", "SUCCESS")
        
        self.log("="*60)
        
        return 0 if len(failed_tests) == 0 else 1

def main():
    tester = APITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())
