# Add changes to git.
git config --local user.email "github-actions[bot]@users.noreply.github.com"
git config --local user.name "github-actions[bot]"
git add .

# Commit changes.
git commit -m "实时更新微博热搜 - $(date +'%Y/%m/%d %I%p')"
