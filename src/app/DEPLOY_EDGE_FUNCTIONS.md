# 🚀 Deploy Supabase Edge Functions - Quick Guide

**Problem**: Your Edge Functions are not deployed, causing `ERR_NAME_NOT_RESOLVED`  
**Solution**: Deploy them using Supabase CLI

---

## ⚡ Quick Fix (5 Minutes)

### Step 1: Install Supabase CLI

Choose your operating system:

#### **macOS**
```bash
brew install supabase/tap/supabase
```

#### **Windows**
Using Scoop:
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

Or download directly: https://github.com/supabase/cli/releases

#### **Linux**
```bash
brew install supabase/tap/supabase
```

#### **Any OS (using npm)**
```bash
npm install -g supabase
```

**Verify installation:**
```bash
supabase --version
```

You should see something like: `supabase version 1.x.x`

---

### Step 2: Login to Supabase

```bash
supabase login
```

This will:
1. Open your browser
2. Ask you to authorize the CLI
3. Create an access token

**Expected output:**
```
✓ Supabase CLI is now logged in
```

---

### Step 3: Link Your Project

In your terminal, navigate to your project directory (where your code is), then run:

```bash
supabase link --project-ref uynzzsvnjviopyazkrzc
```

**You'll be asked for your database password:**
- This is the password you set when creating the Supabase project
- If you forgot it, go to: https://supabase.com/dashboard → Project Settings → Database → Reset password

**Expected output:**
```
✓ Linked to project: uynzzsvnjviopyazkrzc
```

---

### Step 4: Deploy the Edge Functions

Now deploy all three functions:

```bash
# Deploy the main server function
supabase functions deploy server

# Deploy the receipt processing function
supabase functions deploy processReceipt

# Deploy the expense setup function
supabase functions deploy setupExpenses
```

**Expected output for each:**
```
✓ Deployed Function server on project uynzzsvnjviopyazkrzc
Function URL: https://uynzzsvnjviopyazkrzc.supabase.co/functions/v1/server
```

---

### Step 5: Verify Deployment

Run this in your browser console:

```javascript
backendTests.quickCheck()
```

**Expected output:**
```
✅ SUCCESS: API is accessible
Trip ID: [some-uuid]
```

---

## 🔍 Troubleshooting

### Error: "supabase: command not found"
**Solution**: The CLI isn't installed or not in PATH.
- Try closing and reopening your terminal
- On macOS: Try `brew link supabase`
- On Windows: Restart PowerShell/CMD as Administrator

### Error: "Project not found"
**Solution**: You're not logged in or wrong project ID.
```bash
supabase login
supabase link --project-ref uynzzsvnjviopyazkrzc
```

### Error: "Invalid database password"
**Solution**: Reset your database password:
1. Go to: https://supabase.com/dashboard
2. Select project: uynzzsvnjviopyazkrzc
3. Settings → Database → Reset Database Password
4. Use the new password when linking

### Error: "Function deployment failed"
**Solution**: Check the error message. Common issues:
- Missing dependencies in function
- Syntax errors in code
- Missing environment variables

Check logs:
```bash
supabase functions logs server
```

---

## 📝 What Just Happened?

When you deployed, Supabase:
1. ✅ Packaged your Edge Function code
2. ✅ Uploaded it to Supabase servers
3. ✅ Made it available at: `https://uynzzsvnjviopyazkrzc.supabase.co/functions/v1/server`
4. ✅ Set up routing for all your endpoints

Your endpoints are now live:
- `POST /server/make-server-97df1df1/trips` - Create trip
- `GET /server/make-server-97df1df1/trips/:id` - Get trip
- `POST /server/make-server-97df1df1/trips/:id/generate-itineraries` - Generate options
- And all the others!

---

## 🎯 Next Steps

After deployment succeeds:

1. **Run the test again:**
   ```javascript
   backendTests.quickCheck()
   ```

2. **If it passes:**
   - ✅ Backend is working!
   - ✅ Proceed to Amadeus setup
   - ✅ Read `/IMMEDIATE_ACTION_ITEMS.md`

3. **If it still fails:**
   - Copy the error message
   - Check Supabase logs: `supabase functions logs server`
   - Tell me the error and I'll help debug

---

## 🔑 Environment Variables (After Deployment)

Your functions need environment variables set in Supabase:

### Check Current Secrets
```bash
supabase secrets list
```

### Set Required Secrets
If any are missing, set them:

```bash
# For Flowise (if you're using it)
supabase secrets set FLOWISE_API_URL=your_flowise_url
supabase secrets set FLOWISE_API_KEY=your_flowise_key
supabase secrets set FLOWISE_FLOW_ID=your_flow_id

# For expense receipt processing
supabase secrets set EXPENSE_FLOWISE_API_URL=your_flowise_url
supabase secrets set EXPENSE_FLOWISE_FLOW_ID=your_expense_flow_id
supabase secrets set EXPENSE_FLOWISE_API_KEY=your_flowise_key
```

**Note**: If Flowise isn't configured, the app will automatically use mock data fallback (which is fine for now).

---

## 🚀 Quick Command Reference

```bash
# Login
supabase login

# Link project
supabase link --project-ref uynzzsvnjviopyazkrzc

# Deploy single function
supabase functions deploy server

# Deploy all functions
supabase functions deploy server && \
supabase functions deploy processReceipt && \
supabase functions deploy setupExpenses

# View logs
supabase functions logs server

# List secrets
supabase secrets list

# Set a secret
supabase secrets set KEY_NAME=value
```

---

## ✅ Success Checklist

After running the deployment commands, verify:

- [ ] CLI installed: `supabase --version` works
- [ ] Logged in: `supabase login` succeeded
- [ ] Project linked: No errors when running `supabase link`
- [ ] Functions deployed: Saw "✓ Deployed Function" messages
- [ ] API accessible: `backendTests.quickCheck()` passes
- [ ] Can create trips through the UI

---

## 📞 Still Stuck?

**Show me**:
1. Output of: `supabase --version`
2. Output of: `supabase functions deploy server`
3. Any error messages you see

And I'll help you debug! 🛠️
