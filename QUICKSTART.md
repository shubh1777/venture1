# Quick Start Guide - InternConnect

## Setup in 5 Minutes

### Step 1: Backend Setup

```bash
cd server
npm install
npm run dev
```

**Expected Output:**
```
Server running on port 5000
MongoDB Connected: localhost
```

### Step 2: Frontend Setup (New Terminal)

```bash
cd client
npm install
npm run dev
```

**Expected Output:**
```
  VITE v5.0.8  ready in 234 ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

### Step 3: Test the Application

1. **Visit:** `http://localhost:3000`
2. **Click:** "Get Started" button
3. **Register** with your details
4. **Select a Plan** (Basic: ₹49, Standard: ₹99, Premium: ₹199)
5. **Enter Test Card:**
   - Number: `4111 1111 1111 1111`
   - Expiry: `12/25`
   - CVV: `123`
6. **Click:** "Pay ₹XX"
7. **✅ Success!** Dashboard updates with premium status

## Test Referral System

### As Referrer:
1. Login to your account
2. Go to Dashboard
3. Copy your referral code (e.g., `ABC123XYZ`)
4. Share code with friend

### As Friend (Referred):
1. Visit: `http://localhost:3000/register?ref=ABC123XYZ`
2. Register with referral code pre-filled
3. Go to Pricing → Select plan
4. Complete dummy payment
5. Referrer sees commission in their Dashboard!

## Project Structure

```
internconnect/
├── client/              # React app (port 3000)
│   ├── src/
│   │   ├── pages/      # Login, Register, Dashboard, Pricing, etc.
│   │   ├── components/ # Reusable components
│   │   ├── services/   # API calls
│   │   └── context/    # State management
│   └── package.json
│
├── server/              # Express API (port 5000)
│   ├── controllers/     # Business logic
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API endpoints
│   ├── middleware/     # Auth, error handling
│   ├── config/         # Database config
│   └── package.json
│
└── README.md
```

## Key URLs

| Page | URL |
|------|-----|
| Home | http://localhost:3000 |
| Register | http://localhost:3000/register |
| Login | http://localhost:3000/login |
| Pricing | http://localhost:3000/pricing |
| Dashboard | http://localhost:3000/dashboard |
| Opportunities | http://localhost:3000/opportunities |
| Referrals | http://localhost:3000/referrals |
| Profile | http://localhost:3000/profile |

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`

### Payment (Dummy)
- `POST /api/payment/create-order`
- `POST /api/payment/process` ← Test with dummy card
- `GET /api/payment/history`

### Referrals
- `GET /api/referrals/stats`
- `GET /api/referrals/history`
- `GET /api/referrals/validate/:code`

### Opportunities
- `GET /api/opportunities`
- `GET /api/opportunities/:id`

## Dummy Payment Details

### Test Cards
| Card | Details |
|------|---------|
| Number | 4111 1111 1111 1111 |
| Expiry | 12/25 (any future date) |
| CVV | 123 (any 3 digits) |

### Plan Commissions
| Plan | Price | Commission |
|------|-------|-----------|
| Basic | ₹49 | ₹10 |
| Standard | ₹99 | ₹20 |
| Premium | ₹199 | ₹40 |

## Dashboard Features

Once logged in, see:

- **Total Referrals:** Count of people who joined via your code
- **Total Earnings:** ₹XX (lifetime earnings)
- **Pending Earnings:** ₹XX (ready for withdrawal)
- **Withdrawn:** ₹XX (already withdrawn)
- **Recent Referrals:** List with dates and amounts
- **Your Referral Code:** Share this to earn
- **Referral Link:** Direct link to register with your code

## Troubleshooting

### Backend Not Starting?
```bash
# Check if port 5000 is in use
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# If in use, kill process or use different port
```

### Frontend Not Loading?
```bash
# Check if port 3000 is in use
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### MongoDB Connection Error?
```bash
# Check if MongoDB is running
# Windows: mongod
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Verify connection string in server/.env
```

### Payment Not Working?
```bash
# Check browser console for errors (F12)
# Check server logs for validation errors
# Ensure all 3 terminals are running:
#   1. mongod
#   2. npm run dev (server)
#   3. npm run dev (client)
```

## Features to Explore

✅ **User Registration:** With optional college and phone  
✅ **Login System:** JWT-based authentication  
✅ **Referral Codes:** Unique code for each user  
✅ **Dummy Payments:** Test payment flow without real charges  
✅ **Dashboard:** Real-time earnings and referral tracking  
✅ **Opportunities:** Browse internships, hackathons, competitions  
✅ **Referral History:** Track who joined and how much you earned  
✅ **Responsive Design:** Works on mobile and desktop  
✅ **Premium Content:** Unlock exclusive opportunities  

## Next Steps

1. ✅ **Complete one full referral cycle:**
   - Create account A
   - Create account B with A's referral code
   - Pay with dummy card on account B
   - See commission reflected on account A

2. ✅ **Explore all pages:**
   - Dashboard, Opportunities, Referrals, Profile

3. ✅ **Test edge cases:**
   - Invalid card numbers
   - Missing form fields
   - Referral code validation

4. ✅ **Ready for production?**
   - Review DUMMY_PAYMENT_GUIDE.md for Razorpay integration
   - Update environment variables
   - Deploy to cloud

## Support & Documentation

- 📖 Full README: `internconnect/README.md`
- 🔐 Payment Guide: `internconnect/DUMMY_PAYMENT_GUIDE.md`
- 📝 API Docs: Check server logs and postman collection

---

**Happy coding! 🚀**

Questions? Check the troubleshooting section or review the full documentation.
