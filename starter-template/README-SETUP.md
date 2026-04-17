# Setup and run

- Bootstrap (create venv, install Python and Node deps, install skills):

PowerShell:
```powershell
scripts\bootstrap.ps1
# or with force update of skills:
scripts\bootstrap.ps1 -Force
```

- Start backend and frontend:

PowerShell:
```powershell
scripts\run-all.ps1
```

- What the scripts do:
  - Creates `backend\\.venv` and installs `backend/requirements.txt`
  - Runs `npm install` in `my-app`
  - Clones skills from `skills-lock.json` into `.agents/skills` (if not present)
  - Starts backend at http://localhost:8000 and frontend at http://localhost:3000

- Notes:
  - Requires Python 3.10+, Node.js, npm, and Git on PATH
  - If you prefer manual steps, use the quick-run commands in the original starter README(s)
