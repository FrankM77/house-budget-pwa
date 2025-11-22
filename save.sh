#!/bin/bash

# 1. Add all changes
echo "📦 Staging all changes..."
git add .

# 2. Ask for a commit message
echo "📝 Enter your commit message:"
read commitMessage

# Check if message is empty
if [ -z "$commitMessage" ]; then
  echo "❌ Error: Commit message cannot be empty."
  exit 1
fi

# 3. Commit
echo "💾 Committing..."
git commit -m "$commitMessage"

# 4. Push
echo "🚀 Pushing to GitHub..."
git push

echo "✅ Done! Code is safely on GitHub."
