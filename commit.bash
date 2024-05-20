# Add changes to git.
git config --local user.email "github-actions[bot]@users.noreply.github.com"
git config --local user.name "github-actions[bot]"
git add .

# Commit changes.
msg="实时更新微博热搜 - building site $(date)"
if [ $# -gt 0 ]; then
    msg="实时更新微博热搜 - $1"
fi
git commit --allow-empty -m "实时更新微博热搜 - $(now)"

git push
