# Contributing to Grindify

Thank you for your interest in contributing to Grindify! 🎉
We welcome all contributions — bug fixes, features, docs, and more.

---

## Before You Start

### 1. Sign the CLA

By submitting a Pull Request, you agree to our
[Contributor License Agreement](./CLA.md).

To sign it, add your details to [CONTRIBUTORS.md](./CONTRIBUTORS.md)
in the same PR:

```text
| Your Name | @github-username | YYYY-MM-DD |
```

### 2. Check Existing Issues

Before starting work, check if there's already an
[open issue](https://github.com/FalkenDev/grindify/issues) for it.
If not, open one first so we can discuss it.

---

## Getting Started

### Prerequisites

- Node.js >= 18
- Git

### Setup

```bash
git clone https://github.com/FalkenDev/grindify.git
cd grindify
npm install
npm run dev
```

---

## How to Contribute

### Reporting Bugs

- Use the **Bug Report** issue template
- Include steps to reproduce
- Include browser/OS info if relevant

### Suggesting Features

- Use the **Feature Request** issue template
- Explain the use case, not just the solution

### Submitting a Pull Request

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Make your changes
4. Commit using conventional commits (see below)
5. Push and open a PR against `main`

---

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

| Type        | When to use                      |
| ----------- | -------------------------------- |
| `feat:`     | New feature                      |
| `fix:`      | Bug fix                          |
| `docs:`     | Documentation changes            |
| `style:`    | Formatting, no logic change      |
| `refactor:` | Code restructure, no feature/fix |
| `chore:`    | Build, deps, tooling             |

**Example:**

```bash
git commit -m "feat: add user profile page"
```

---

## Code Style

- Follow existing code style and structure
- Keep components small and focused
- Write accessible UI (ARIA labels, keyboard nav)
- No commented-out code in PRs

---

## License

By contributing, you agree your contributions will be licensed
under the [AGPL-3.0 License](./LICENSE).
