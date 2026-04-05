# Supabase Database Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with GitHub or email
4. Create a new project:
   - **Project name**: `astral-gym`
   - **Password**: Create a strong password
   - **Region**: Choose closest to you
   - Click **Create new project**

Wait 2-3 minutes for the project to be set up.

## Step 2: Get API Keys

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

3. Update `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...YOUR_KEY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...YOUR_SERVICE_KEY
```

## Step 3: Create Database Tables

Go to **SQL Editor** in Supabase and run each query **separately** (copy one at a time):

### 1. Create Members Table (Run First)
```sql
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  join_date DATE NOT NULL,
  membership_type VARCHAR(50) DEFAULT 'basic',
  status VARCHAR(50) DEFAULT 'active',
  expiry_date DATE NOT NULL,
  attendance_rate NUMERIC DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Create Transactions Table
```sql
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  payment_method VARCHAR(50),
  transaction_type VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Create Attendance Table
```sql
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  check_in_time TIMESTAMP,
  check_out_time TIMESTAMP,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Create Classes Table
```sql
CREATE TABLE IF NOT EXISTS gym_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  instructor VARCHAR(255),
  schedule VARCHAR(255),
  capacity INTEGER,
  enrolled_count INTEGER DEFAULT 0,
  level VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 5. Create Staff Table
```sql
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'staff',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## ⚠️ Column Reference Guide

**DO NOT USE `user_id`** - Use these instead:

| Table | ID Column | Foreign Key Reference |
|-------|-----------|----------------------|
| members | `id` | N/A (primary) |
| transactions | `id` | `member_id` (references members) |
| attendance | `id` | `member_id` (references members) |
| gym_classes | `id` | N/A |
| staff | `id` | N/A |

### Common Query Examples (CORRECT)

```sql
-- Get all members
SELECT * FROM members;

-- Get transactions for a specific member
SELECT * FROM transactions WHERE member_id = 'uuid-here';

-- Get attendance for a member
SELECT * FROM attendance WHERE member_id = 'uuid-here';

-- Insert a member
INSERT INTO members (name, email, phone, join_date, expiry_date) 
VALUES ('John Doe', 'john@email.com', '+63 123 456 7890', '2026-03-31', '2026-06-30');

-- Record a payment
INSERT INTO transactions (member_id, amount, payment_method, transaction_type, status)
VALUES ('member-uuid-here', 2500, 'gcash', 'membership', 'paid');

-- Log attendance check-in
INSERT INTO attendance (member_id, check_in_time, date)
VALUES ('member-uuid-here', NOW(), CURRENT_DATE);
```

### ❌ WRONG Examples (DON'T DO THIS)

```sql
-- WRONG - user_id doesn't exist
SELECT * FROM transactions WHERE user_id = 'uuid';

-- WRONG - members table has no user_id
SELECT * FROM members WHERE user_id = 'uuid';

-- WRONG - attendance uses member_id, not user_id
SELECT * FROM attendance WHERE user_id = 'uuid';
```

## Step 4: Enable Row Level Security (RLS)

**Important for security:**

1. Go to **Authentication** → **Policies**
2. For each table, create policies:
   - Enable RLS
   - Add "Enable read access for all users" (public select)
   - Add "Enable insert for authenticated users" (insert)
   - Add "Enable update for authenticated users" (update)

## Step 5: Test Connection

Restart your dev server:
```bash
npm run dev
```

Test the APIs:
- **Get all members**: `curl http://localhost:3000/api/members`
- **Dashboard stats**: `curl http://localhost:3000/api/dashboard/stats`

## Step 6: Insert Sample Data (Optional)

In Supabase **SQL Editor**, insert test data:

```sql
INSERT INTO members (name, email, phone, join_date, membership_type, status, expiry_date) VALUES
('Maria Santos', 'maria@email.com', '+63 917 123 4567', '2024-12-10', 'basic', 'active', '2026-01-31'),
('Carlo Reyes', 'carlo@email.com', '+63 910 987 6543', '2024-11-15', 'premium', 'active', '2026-02-14'),
('Ana Lim', 'ana@email.com', '+63 908 765 4321', '2024-10-22', 'premium', 'active', '2026-01-03'),
('Derek Cruz', 'derek@email.com', '+63 920 456 7890', '2024-12-28', 'vip', 'active', '2026-12-28');
```

## Environment Variables Checklist

- ✅ `NEXT_PUBLIC_SUPABASE_URL` - Project URL
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public API key
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Service role key

## API Endpoints Available

```
GET  /api/members                 - Get all members
POST /api/members                 - Create member
PUT  /api/members?id=<id>        - Update member
DELETE /api/members?id=<id>      - Delete member

GET  /api/transactions            - Get all transactions
POST /api/transactions            - Create transaction
PUT  /api/transactions?id=<id>   - Update transaction

GET  /api/dashboard/stats         - Get dashboard statistics
```

## Troubleshooting

### "Cannot read property 'from' of null"
- Check `NEXT_PUBLIC_SUPABASE_URL` is correct
- Restart dev server after updating `.env.local`

### "Invalid API key"
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Check it's from the **anon public** key, not **service_role**

### "RLS policy violation"
- Make sure RLS policies are enabled in Supabase
- Check that public select is allowed

## Next Steps

After setup:
1. Connect frontend components to API endpoints
2. Add authentication/login system
3. Implement real-time updates with Supabase subscriptions
4. Add more features (search, filters, exports)

---

**Questions?** Check [Supabase Docs](https://supabase.com/docs)
