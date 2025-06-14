# Contributing to Supauth

Thank you for your interest in contributing to Supauth! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm
- Git
- A Supabase account for testing

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/supa-auth-nextjs.git
   cd supa-auth-nextjs
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Add your Supabase credentials
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📋 How to Contribute

### 1. Issues
- Check existing issues before creating new ones
- Use issue templates when available
- Provide clear reproduction steps for bugs
- Include screenshots/videos when helpful

### 2. Pull Requests

**Before Starting:**
- Comment on the issue you want to work on
- Wait for maintainer confirmation
- Fork the repository

**Pull Request Process:**
1. Create a feature branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes
   - Follow the coding standards below
   - Add tests if applicable
   - Update documentation if needed

3. Test your changes
   ```bash
   npm run lint
   npm run build
   ```

4. Commit your changes
   ```bash
   git commit -m "feat: add amazing new feature"
   ```

5. Push and create PR
   ```bash
   git push origin feature/your-feature-name
   ```

### 3. Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

## 🎨 Coding Standards

### TypeScript
- Use TypeScript for all new code
- Provide proper type definitions
- Avoid `any` types when possible

### React
- Use functional components with hooks
- Follow React best practices
- Use proper component naming (PascalCase)

### Styling
- Use Tailwind CSS classes
- Follow existing design patterns
- Ensure responsive design
- Support dark/light modes

### File Organization
```
src/
├── app/                # Next.js app router pages
├── components/         # Reusable components
│   ├── ui/            # Base UI components
│   └── feature/       # Feature-specific components
├── lib/               # Utilities and configurations
├── hooks/             # Custom React hooks
└── types/             # TypeScript type definitions
```

## 🧪 Testing

- Write tests for new features
- Ensure existing tests pass
- Include both unit and integration tests when applicable

```bash
# Run tests (when available)
npm run test

# Run linting
npm run lint
```

## 📚 Documentation

- Update README.md for significant changes
- Add JSDoc comments for complex functions
- Update API documentation if applicable
- Include examples in documentation

## 🔒 Security

- Never commit sensitive information
- Use environment variables for secrets
- Report security issues privately
- Follow security best practices

## 🤝 Code Review Process

1. **Automated Checks**: All PRs must pass CI/CD pipeline
2. **Code Review**: At least one maintainer review required
3. **Testing**: Manual testing for UI changes
4. **Documentation**: Ensure docs are updated
5. **Merge**: Squash and merge after approval

## 📞 Getting Help

- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Create issues for bugs and feature requests
- **Discord/Slack**: Join our community (links in README)

## 🏆 Recognition

Contributors will be:
- Added to the contributors list
- Mentioned in release notes
- Given credit in relevant documentation

## 📝 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Supauth! Every contribution helps make authentication easier for developers worldwide. 🚀 