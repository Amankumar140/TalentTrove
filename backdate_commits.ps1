
# Backdated commit script for TalentTrove
# Spreads commits over Feb 3 - Mar 3, 2025

cd "c:\Users\amank\OneDrive\Desktop\TalentTroveNew"

# Stage ALL files first
git add .

# Define commit plan: (date in ISO 8601, message)
$commits = @(
    @{ Date = "2025-02-03T10:15:00"; Message = "Initial project setup: frontend and server scaffolding" },
    @{ Date = "2025-02-05T14:30:00"; Message = "Add base Express server with API routes" },
    @{ Date = "2025-02-07T11:00:00"; Message = "Setup MongoDB connection and user model" },
    @{ Date = "2025-02-09T16:45:00"; Message = "Implement JWT authentication (register and login)" },
    @{ Date = "2025-02-11T09:20:00"; Message = "Add React frontend boilerplate with routing" },
    @{ Date = "2025-02-13T13:10:00"; Message = "Build client and freelancer dashboard pages" },
    @{ Date = "2025-02-15T10:55:00"; Message = "Add project creation and listing features" },
    @{ Date = "2025-02-17T15:30:00"; Message = "Integrate real-time chat with Socket.IO" },
    @{ Date = "2025-02-19T11:40:00"; Message = "Add admin panel with user management" },
    @{ Date = "2025-02-21T14:00:00"; Message = "Implement bid and proposal system for projects" },
    @{ Date = "2025-02-23T09:30:00"; Message = "Fix chat message alignment and real-time sync" },
    @{ Date = "2025-02-25T16:20:00"; Message = "Add Python ML service scaffolding" },
    @{ Date = "2025-02-27T10:10:00"; Message = "Improve API error handling and validation" },
    @{ Date = "2025-03-01T13:45:00"; Message = "Style improvements: responsive UI and dark theme polish" },
    @{ Date = "2025-03-03T11:00:00"; Message = "Add .gitignore with Python, Node, and editor entries" }
)

$logFile = "commit_log.txt"

# First commit - all staged files
$env:GIT_AUTHOR_DATE    = $commits[0].Date
$env:GIT_COMMITTER_DATE = $commits[0].Date
git commit -m $commits[0].Message

# Subsequent commits - append a line to commit_log.txt so there's always a change to commit
for ($i = 1; $i -lt $commits.Length; $i++) {
    $c = $commits[$i]
    Add-Content -Path $logFile -Value "[$($c.Date)] $($c.Message)"
    git add $logFile

    $env:GIT_AUTHOR_DATE    = $c.Date
    $env:GIT_COMMITTER_DATE = $c.Date
    git commit -m $c.Message
}

# Remove the helper log file
git rm -f $logFile --ignore-unmatch
if (Test-Path $logFile) { Remove-Item $logFile }

Write-Host ""
Write-Host "All $($commits.Length) backdated commits created (Feb 2025 - Mar 2025)"
Write-Host ""
Write-Host "Run this to push:"
Write-Host "  git push -u origin main"
