# 1. Add all changes
Write-Host "📦 Staging all changes..."
git add .

# 2. Ask for a commit message
# Read-Host pauses the script and prompts the user
$commitMessage = Read-Host "📝 Enter your commit message"

# Check if message is empty
# We use a .NET string method to check for empty or whitespace-only inputs
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    Write-Host "❌ Error: Commit message cannot be empty." -ForegroundColor Red
    exit 1
}

# 3. Commit
Write-Host "💾 Committing..."
git commit -m $commitMessage

# 4. Push
Write-Host "🚀 Pushing to GitHub..."
git push

Write-Host "✅ Done! Code is safely on GitHub." -ForegroundColor Green