# How to Start the Backend Server

The frontend needs the backend server running on **http://localhost:8000**

## Quick Start (PowerShell)

1. **Open a new PowerShell window**

2. **Navigate to backend directory:**
   ```powershell
   cd D:\ORM\backend
   ```

3. **Activate virtual environment:**
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```
   
   If you get an execution policy error:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

4. **Start the server:**
   ```powershell
   python run.py
   ```

5. **You should see:**
   ```
   INFO:     Uvicorn running on http://0.0.0.0:8000
   INFO:     Application startup complete.
   ```

6. **Keep this window open** - the server needs to keep running

7. **Test it:** Open http://localhost:8000/api/health in your browser

## Alternative: Use the startup script

```powershell
cd D:\ORM\backend
.\start.bat
```

## Verify Backend is Running

- Visit: http://localhost:8000/api/health
- Should return: `{"status":"healthy"}`

- Visit: http://localhost:8000/docs
- Should show API documentation

## Troubleshooting

**Port 8000 already in use?**
- Change port in `backend/run.py` (line 11) to `port=8001`
- Update frontend API URL in `src/api/client.js` (line 6) to `http://localhost:8001/api`

**Dependencies not installed?**
```powershell
cd D:\ORM\backend
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**Database not initialized?**
```powershell
python init_db.py
```

