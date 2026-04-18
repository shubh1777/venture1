# 🚀 InternConnect - Updated Feature Quick Reference

## What Changed

### ❌ Removed
- Automatic plan selection screen after login
- Razorpay pricing page
- Direct premium upgrade flow

### ✅ Added
- **Course System** - Create, browse, and purchase courses (₹49, ₹149, ₹199)
- **Withdrawal System** - Request withdrawals (min ₹100) with bank details
- **Admin Role** - Separate admin sign-up and dashboard access
- **Dual Sign-Up** - Student vs Admin sign-up pages
- **Course-Based Earnings** - Admins get 100% of course price, referrers get commissions

---

## 🔑 Key URLs

**Authentication**
- Login: `http://localhost:3001/login`
- Student Sign-Up: `http://localhost:3001/signup`
- Admin Sign-Up: `http://localhost:3001/admin-signup`

**Student Pages**
- Dashboard: `http://localhost:3001/dashboard`
- Courses: `http://localhost:3001/courses`
- Withdrawal: `http://localhost:3001/withdrawal`
- Referrals: `http://localhost:3001/referrals`

**Admin Pages**
- Admin Dashboard: `http://localhost:3001/admin-dashboard` (to be created)

---

## 💳 Test Card Details (Unchanged)
```
Card: 4111 1111 1111 1111
Expiry: 12/25
CVV: 123
```

---

## 🎓 Test User Flow

### Create Admin
1. Go to `/admin-signup`
2. Fill form with:
   - Name: "Tech Instructor"
   - Email: "admin@test.com"
   - Password: "test123"
   - Organization: "My School"
3. Submit

### Create Student
1. Go to `/signup`
2. Fill form with:
   - Name: "John Student"
   - Email: "student@test.com"
   - Password: "test123"
   - College: "XYZ University"
3. **Save referral code** displayed after signup

### Create Another Student with Referral
1. Go to `/signup`
2. Fill form with:
   - Name: "Jane Student"
   - Email: "jane@test.com"
   - Password: "test123"
   - Referral Code: (paste from Step 1)
3. Submit

### Admin Creates Course
1. Login as admin@test.com / test123
2. Navigate to Admin Dashboard (endpoint: `/api/courses/create`)
3. Create course:
   ```
   {
     "name": "Web Development 101",
     "description": "Learn web dev basics",
     "price": 149,
     "commission": 25
   }
   ```

### Student Enrolls in Course
1. Login as jane@test.com / test123
2. Click "Browse Courses"
3. Select course → "Enroll Now"
4. Enter test card details
5. ✅ Course purchased!

### Check Earnings
1. John's Dashboard → should show:
   - +1 Total Referrals
   - +₹25 Total Earnings
   - +₹25 Pending Earnings

2. Admin Dashboard → should show:
   - +₹149 Total Earnings
   - +₹149 Pending Earnings

---

## 💰 Withdrawal Request

### Step 1: Request Withdrawal (Student)
1. Dashboard → Click "Request Withdrawal" button
2. Enter amount: 100 (must be ≤ pending earnings)
3. Bank details:
   - Account Holder: John Student
   - Account Number: 1234567890
   - IFSC Code: HDFC0001234
   - Bank Name: HDFC Bank
4. Submit

✅ Withdrawal shows as "pending"

### Step 2: Approve Withdrawal (Admin)
1. Call: `PUT /api/withdrawals/admin/approve/{withdrawalId}`
2. Status changes to "completed"
3. withdrawnEarnings incremented

---

## 📊 Commission Structure

Per course, admin sets commission for referrers:

```
Example:
- Course price: ₹149
- Referral commission: ₹25

When student referred by A buys course:
- Admin gets: ₹149
- Referrer (A) gets: ₹25
- Student sees: Course enrolled
```

---

## 🔌 API Endpoints Summary

### Courses
```
GET    /api/courses                     - List all courses
GET    /api/courses/:id                 - Get course details
POST   /api/courses/create              - Create course (Admin only)
GET    /api/courses/admin/courses       - List my courses (Admin)
POST   /api/courses/admin/approve-enrollment    - Approve student
POST   /api/courses/admin/reject-enrollment     - Reject student
```

### Payments
```
POST   /api/payment/course-purchase     - Enroll in course (new!)
```

### Withdrawals
```
POST   /api/withdrawals/request         - Submit withdrawal request
GET    /api/withdrawals/history         - View my requests
GET    /api/withdrawals/admin/pending   - Pending requests (Admin only)
PUT    /api/withdrawals/admin/approve/:id   - Approve (Admin only)
PUT    /api/withdrawals/admin/reject/:id    - Reject (Admin only)
```

### Auth (Updated)
```
POST   /api/auth/register   - Now accepts role: "student" | "admin"
POST   /api/auth/login      - Returns role in response
```

---

## ⚙️ Server Status

**Backend**: ✅ Running on port 5000
**Frontend**: ✅ Running on port 3001
**Database**: ✅ MongoDB Connected

---

## 🆘 Troubleshooting

### Issue: Course not showing after purchase
- Check if admin approved the enrollment
- Verify courseId is saved in user.enrolledCourses

### Issue: Withdrawal rejected
- Amount must be ≤ pending earnings
- Account details must be valid
- Minimum amount is ₹100

### Issue: Referral commission not credited
- Student must register WITH referral code
- Admin must approve course enrollment
- Check user.referredBy field is set

### Issue: Admin dashboard 404
- Admin dashboard page not yet created
- Use API endpoints directly for testing: `GET /api/courses/admin/courses`

---

## 📝 Database Fields to Track

**User Model** (additions)
- `role`: "student" or "admin"
- `enrolledCourses`: [{courseId, enrolledAt}]
- `pendingEarnings`: Number (from referrals)
- `withdrawnEarnings`: Number (completed withdrawals)

**Withdrawal Status Flow**
```
pending → approved → completed
             ↓
         rejected (refunds to pendingEarnings)
```

---

## 🎯 Next Session Priorities

1. ✅ Create AdminDashboard page component
2. ✅ Implement course create form in admin dashboard
3. ✅ Test complete flow end-to-end
4. ✅ Add email notifications
5. ✅ Deploy to production

---

**Last Updated**: April 18, 2026
**Version**: 2.0.0 - Courses & Withdrawals
