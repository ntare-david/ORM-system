# How to See Changes

If you're not seeing changes after updates, follow these steps:

## 1. Stop the Dev Server
Press `Ctrl+C` in the terminal where the dev server is running

## 2. Clear Vite Cache
```powershell
Remove-Item -Path "node_modules\.vite" -Recurse -Force -ErrorAction SilentlyContinue
```

## 3. Restart Dev Server
```powershell
npm run dev
```

## 4. Hard Refresh Browser
- **Chrome/Edge**: Press `Ctrl+Shift+R` or `Ctrl+F5`
- **Firefox**: Press `Ctrl+Shift+R` or `Ctrl+F5`
- **Safari**: Press `Cmd+Shift+R`

## 5. Clear Browser Cache (if still not working)
- Open DevTools (F12)
- Right-click the refresh button
- Select "Empty Cache and Hard Reload"

## Verify Signup Flow
1. Go to http://localhost:3000/signup
2. Fill in the form
3. Click "Sign Up"
4. You should be redirected to /onboarding

If it still doesn't work, check the browser console (F12) for any errors.

