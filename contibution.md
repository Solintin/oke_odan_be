# Git Workflow for Backend Development

This document outlines the Git workflow for our backend team to ensure smooth collaboration and maintain a clean repository.

## Branching Strategy

### Main (or Master)

- The main branch is the production branch.
- Only the team lead can merge changes into main.
- No direct commits or pushes to main.

### Develop

- The develop branch is used for integrating features before they go to main.
- All feature branches should be merged into develop through a pull request (PR).
- No direct commits or pushes to develop.

### Feature Branches

- Each developer creates a new branch from develop for their assigned feature.
- The branch should be named following this format:
  ```
  feature/<feature-name>
  ```
- Example: `feature/user-authentication`

### Bugfix Branches

- If a bug is found in develop, create a branch with this format:
  ```
  bugfix/<bug-name>
  ```
- Example: `bugfix/fix-login-error`

### Hotfix Branches

- If an urgent fix is required in main, create a branch with this format:
  ```
  hotfix/<fix-name>
  ```
- Example: `hotfix/critical-security-patch`

## Git Workflow

### 1. Cloning the Repository

If you haven't cloned the repository yet, do so with:

```bash
git clone <repo-url>
cd <repo-name>
git checkout develop
```

### 2. Creating a Feature Branch

```bash
git checkout develop
git pull origin develop    # Ensure your local develop is up to date
git checkout -b feature/<feature-name>
```

### 3. Making Changes & Committing

Work on your feature.
Add your changes:

```bash
git add .
```

Commit with a meaningful message:

```bash
git commit -m "Add <feature-name>: Brief description"
```

Example:

```bash
git commit -m "Add user authentication: Implement JWT login"
```

### 4. Pushing Your Feature Branch

```bash
git push origin feature/<feature-name>
```

### 5. Creating a Pull Request (PR)

- Go to the repository on GitHub.
- Find your `feature/<feature-name>` branch.
- Open a Pull Request (PR) to develop.
- Add a meaningful title and description.
- Assign reviewers.

### 6. Merging Process

- Only after approval, merge the PR into develop.
- Team members should NOT merge into main or develop directly.

### 7. Keeping Your Branch Up to Date

If develop has new changes while you're working on your branch:

```bash
git checkout develop
git pull origin develop
git checkout feature/<feature-name>
git merge develop  # Resolve conflicts if necessary
```

## Deployment Process

The Team Lead merges develop into main when the project is ready for release.
The command for merging:

```bash
git checkout main
git merge develop
git push origin main
```

## Rules and Best Practices

- ✅ Always create a feature branch from develop.
- ✅ Always raise a PR to develop, never main.
- ✅ Regularly pull from develop to keep your branch updated.
- ✅ Write meaningful commit messages.
- ✅ Never force push to develop or main.
- ✅ Only the Team Lead merges develop → main.
