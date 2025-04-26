# 📚 Team Git Workflow Guide

## 1. Project Setup
- One member creates the GitHub repository.
- Add teammates as collaborators or have each member fork the repo.

## 2. Clone the Repository
```bash
git clone https://github.com/your-team/project-name.git
```

## 3. Branching for Features & Tasks
- Create a new branch for each task:
  ```bash
  git checkout -b branch-name
  ```
- **Branch naming:**  
  `feature/feature-name`  
  `bugfix/bug-name`  
  `hotfix/urgent-fix`

## 4. Code & Commit Often
- Stage and commit changes:
  ```bash
  git add .
  git commit -m "Clear, concise message"
  ```
- **Tips:**  
  - Use meaningful commit messages.  
  - Keep commits small and focused.

## 5. Push Your Branch
```bash
git push -u origin branch-name
```

## 6. Open a Pull Request (PR)
- On GitHub, open a PR from your branch to `develop`.
- Write a brief, clear PR description.

## 7. Review & Merge
- Teammates review PRs, leave comments, and request changes if needed.
- After approval, merge into `develop`.

## 8. Keep Your Code Updated
- To update `develop`:
  ```bash
  git checkout develop
  git pull origin develop
  ```
- To update your feature branch:
  ```bash
  git fetch origin
  git rebase origin/develop
  ```

## 9. Resolve Merge Conflicts
- Fix conflicts manually, then:
  ```bash
  git add .
  git commit
  ```

## 📌 Best Practices
- Always work on a feature branch—never commit directly to `develop`.
- Review PRs thoroughly before merging.
- Keep commit messages short and meaningful.
- Sync your branch with `develop` regularly to avoid conflicts.