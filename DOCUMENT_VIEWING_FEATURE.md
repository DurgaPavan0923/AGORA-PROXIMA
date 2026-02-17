# 📄 Document Viewing Feature Added!

## ✅ What Was Added

Admin can now VIEW and DOWNLOAD the uploaded Aadhaar and Voter ID PDFs when reviewing pending user registrations.

### New Features

1. **Enhanced Document Display**
   - Beautiful card layout for each document
   - Blue card for Aadhaar Card
   - Green card for Voter ID Card
   - Shows document type and format

2. **View Button**
   - Click to open PDF in new browser tab
   - View the actual uploaded document
   - Zoom, download, or print from browser

3. **Secure Access**
   - Only authenticated admins can view documents
   - JWT token required
   - Files served from protected backend route

## 🎯 Files Changed/Created

### Frontend
1. **`client/components/admin-pending-users.tsx`**
   - Enhanced document section with styled cards
   - Added "View" buttons for each document
   - Extracts filename from full path

2. **`client/app/api/documents/[filename]/route.ts`** (NEW)
   - API route to fetch documents from backend
   - Passes authentication token
   - Returns PDF with proper headers

### Backend
3. **`server/src/server.ts`**
   - Added `/uploads` static file route
   - Protected with authentication middleware
   - Serves PDFs from uploads directory

## 🚀 How to Use

### Step 1: Restart Both Servers

**Backend** (if not already running):
```powershell
cd server
npm run dev
```

**Frontend**:
```powershell
# Stop with Ctrl+C
cd client
Remove-Item -Path ".next" -Recurse -Force
npm run dev
```

### Step 2: Test Document Viewing

1. Login as admin (`ADMIN-AGR-001`)
2. Go to **Pending** tab
3. Click **"View"** on any user (e.g., NISHANT GUPTA)
4. In the user details dialog, scroll to **"Uploaded Documents"**
5. You'll see two cards:
   ```
   ┌────────────────────────────────────┐
   │ 📄 Aadhaar Card         [View]    │
   │    PDF Document                    │
   └────────────────────────────────────┘
   
   ┌────────────────────────────────────┐
   │ 📄 Voter ID Card        [View]    │
   │    PDF Document                    │
   └────────────────────────────────────┘
   ```
6. Click **"View"** button → PDF opens in new tab!

## 📊 How It Works

### Document Flow:

```
User Registers
  ↓
Uploads Aadhaar.pdf & VoterID.pdf
  ↓
Stored in: server/uploads/
Filename: aadhaarCard-1732567890-123456789.pdf
  ↓
Path saved in PendingUser database
  ↓
Admin clicks "View" in dashboard
  ↓
Frontend: /api/documents/[filename]
  ↓
Next.js API Route: Passes auth token
  ↓
Backend: /uploads/[filename]
  ↓
Serves PDF file (with authentication check)
  ↓
Browser opens PDF in new tab
```

### Security:

1. **Authentication Required**
   - Frontend API checks for JWT token in cookies
   - Backend route protected with `authenticate` middleware
   - Only logged-in admins can access

2. **File Path Sanitization**
   - Extracts only filename from full path
   - Prevents directory traversal attacks
   - Validates file exists before serving

3. **Proper Headers**
   - Content-Type: application/pdf
   - Content-Disposition: inline (opens in browser)

## 🎨 UI Improvements

### Before:
```
Uploaded Documents:
• Aadhaar Card uploaded
• Voter ID Card uploaded
```
❌ Can't see the actual documents!

### After:
```
┌─────────────────────────────────────┐
│ 📄 Aadhaar Card         [👁️ View]  │
│    PDF Document                      │
│    ───────────────────────────────  │
│    Blue background, styled card     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 📄 Voter ID Card        [👁️ View]  │
│    PDF Document                      │
│    ───────────────────────────────  │
│    Green background, styled card    │
└─────────────────────────────────────┘
```
✅ Click View → See actual PDF!

## 🔧 Troubleshooting

### Issue 1: "Document not found"
**Cause**: File doesn't exist in uploads folder

**Solution**:
- Check if `server/uploads/` directory exists
- Verify file was actually uploaded during registration
- Check filename matches what's in database

### Issue 2: "Unauthorized"
**Cause**: Not logged in or JWT token expired

**Solution**:
- Logout and login again
- Make sure you're logged in as admin
- Check browser cookies for `token`

### Issue 3: PDF doesn't open
**Cause**: Backend not serving files correctly

**Solution**:
```powershell
# Verify backend uploads route
curl http://localhost:5000/uploads/test.pdf
# Should return 401 if not authenticated, or file if exists
```

### Issue 4: "Failed to fetch document"
**Cause**: Backend not running or wrong URL

**Solution**:
- Ensure backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Should be: `http://localhost:5000/api`

## 📁 File Storage

### Location:
```
server/uploads/
├── aadhaarCard-1732567890-123456789.pdf
├── voterIdCard-1732567890-987654321.pdf
├── aadhaarCard-1732568000-111222333.pdf
└── voterIdCard-1732568000-444555666.pdf
```

### Naming Convention:
```
[fieldname]-[timestamp]-[random]-[extension]

Example:
aadhaarCard-1732567890-123456789.pdf
```

### File Size Limit:
- Maximum: 5MB per file
- Format: PDF only
- Enforced by multer middleware

## 🎯 Testing Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Logged in as admin
- [ ] Can see pending users
- [ ] Can click "View" on user
- [ ] User details dialog opens
- [ ] Documents section shows two cards (if uploaded)
- [ ] Click "View" on Aadhaar Card
- [ ] PDF opens in new tab
- [ ] Can zoom, download, print PDF
- [ ] Click "View" on Voter ID Card
- [ ] Second PDF opens in new tab
- [ ] Both PDFs are readable

## ✨ Benefits

1. **Better Decision Making**
   - Admin can verify documents before approving
   - Check if Aadhaar number matches document
   - Verify Voter ID details

2. **Fraud Prevention**
   - See actual documents, not just metadata
   - Catch fake or altered documents
   - Cross-verify information

3. **Improved UX**
   - Clean, styled document cards
   - Easy one-click viewing
   - Opens in new tab (doesn't lose place)

4. **Professional Look**
   - Color-coded document types
   - Icon + label + action button
   - Consistent with modern admin panels

---

## 🎉 Success!

Admins can now:
1. ✅ Review user registrations
2. ✅ View uploaded Aadhaar Card PDF
3. ✅ View uploaded Voter ID Card PDF
4. ✅ Make informed approval decisions
5. ✅ Verify document authenticity

**Restart the servers and test it out!** 🚀
