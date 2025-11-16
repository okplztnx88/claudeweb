# Contributing to ClaudeWeb

Thank you for your interest in contributing to ClaudeWeb! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Current vs proposed behavior**
- **Why this enhancement would be useful**
- **Possible implementation approach**

### Pull Requests

1. **Fork the repository**
2. **Create a branch** from `develop`
   ```bash
   git checkout -b feature/my-feature develop
   ```

3. **Make your changes**
   - Follow code style guidelines
   - Add tests for new features
   - Update documentation

4. **Commit your changes**
   ```bash
   git commit -m "feat: add new feature"
   ```
   Follow [Conventional Commits](https://www.conventionalcommits.org/)

5. **Push to your fork**
   ```bash
   git push origin feature/my-feature
   ```

6. **Open a Pull Request**
   - Reference any related issues
   - Describe your changes
   - Include screenshots/examples if relevant

## Development Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/claudeweb.git
cd claudeweb

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Start development servers
pnpm dev
```

## Code Style

### TypeScript

- Use TypeScript for all new code
- Follow existing patterns
- Add type annotations where helpful
- Avoid `any` types when possible

### Formatting

```bash
# Format code
pnpm format

# Lint code
pnpm lint
```

### Naming Conventions

- **Files:** `camelCase.ts` or `PascalCase.tsx`
- **Components:** `PascalCase`
- **Functions:** `camelCase`
- **Constants:** `UPPER_SNAKE_CASE`

## Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

All new features should include tests.

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body

footer
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

**Examples:**
```
feat(chat): add message search functionality

fix(auth): resolve token expiration issue

docs(readme): update installation instructions
```

## Pull Request Process

1. **Update documentation** for any changed functionality
2. **Add tests** for new features
3. **Ensure all tests pass**
4. **Update CHANGELOG.md** (if applicable)
5. **Request review** from maintainers
6. **Address feedback** promptly

## Project Structure

```
claudeweb/
├── apps/
│   ├── backend/      # Express API
│   └── frontend/     # Next.js app
├── docs/             # Documentation
├── .github/          # GitHub Actions
└── package.json      # Root config
```

## Backend Development

### Adding a New Route

1. Create route file in `apps/backend/src/routes/`
2. Add middleware and validation
3. Implement handler logic
4. Add tests in `__tests__/`
5. Update API documentation

### Database Changes

```bash
# Create migration
cd apps/backend
pnpm prisma migrate dev --name description

# Generate client
pnpm prisma generate
```

## Frontend Development

### Adding a New Component

1. Create component in `apps/frontend/src/components/`
2. Add TypeScript types
3. Include in appropriate pages
4. Add tests if needed

### Adding a New Page

1. Create page in `apps/frontend/src/app/`
2. Follow Next.js App Router conventions
3. Add metadata
4. Update navigation if needed

## Review Process

Maintainers will review PRs for:

- **Code quality** and style
- **Test coverage**
- **Documentation** updates
- **Breaking changes**
- **Performance** impact

## Getting Help

- **Documentation:** Check `/docs` directory
- **Issues:** Search existing issues
- **Discussions:** Use GitHub Discussions
- **Discord:** Join our community server

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to ClaudeWeb!
