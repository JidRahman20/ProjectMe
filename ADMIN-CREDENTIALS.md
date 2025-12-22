# Admin Credentials

## Default Admin Account
- Email: ajid@gmail.com
- Password: ajid123
- Role: admin

## Test User Accounts
1. dika@gmail.com / dika123 (user)
2. fauji@gmail.com / fauji123 (user)
3. gading@gmail.com / gading123 (user)
4. riza@gmail.com / riza123 (user)

## Setup Instructions

### Option 1: Using Service Role Key (Recommended)
1. Go to Supabase Dashboard → Project Settings → API
2. Copy the `service_role` key (under "Project API keys")
3. Add to `.env` file:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```
4. Run: `npm run db:seed`

### Option 2: Disable RLS (Quick but less secure)
1. Go to Supabase Dashboard → SQL Editor
2. Run the SQL from `scripts/disable-rls.sql`:
   ```sql
   ALTER TABLE users DISABLE ROW LEVEL SECURITY;
   ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
   ```
3. Run: `npm run db:seed`

## Troubleshooting
If you get RLS (Row Level Security) errors:
- Follow Option 1 or Option 2 above
- Make sure your Supabase credentials in `.env` are correct
- Check that tables exist: Go to Supabase Dashboard → Table Editor

