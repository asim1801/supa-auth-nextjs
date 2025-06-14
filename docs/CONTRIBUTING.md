
# Contributing to Supauth

Thank you for your interest in contributing to Supauth! This guide will help you get started.

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/asim1801/supa-auth-nextjs.git`
3. Install dependencies: `npm install`
4. Follow the [Setup Guide](./SETUP.md) to configure your environment
5. Create a feature branch: `git checkout -b feature/your-feature-name`

## Code Style

### TypeScript
- Use TypeScript for all new code
- Provide proper type definitions
- Avoid `any` types when possible

### React
- Use functional components with hooks
- Follow React best practices
- Keep components small and focused

### Styling
- Use Tailwind CSS classes
- Follow the existing design system
- Ensure responsive design
- Test both light and dark themes

### File Organization
- Keep components small (preferably under 200 lines)
- Create separate files for different concerns
- Use descriptive file names
- Follow the existing folder structure:
  ```
  src/
  ├── components/        # Reusable UI components
  ├── pages/            # Page components
  ├── hooks/            # Custom hooks
  ├── lib/              # Utility functions
  └── components/ui/    # ShadCN UI components
  ```

## Commit Messages

Use conventional commit format:
- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `style:` formatting changes
- `refactor:` code refactoring
- `test:` adding tests
- `chore:` maintenance tasks

Examples:
- `feat: add user profile avatar upload`
- `fix: resolve theme toggle state sync issue`
- `docs: update setup instructions`

## Testing

Before submitting a PR:
- Test your changes thoroughly
- Verify responsive design works
- Test both light and dark themes
- Ensure authentication flows work correctly
- Test different user roles and permissions

## Pull Request Process

1. **Create a descriptive PR title** following conventional commit format
2. **Fill out the PR template** with:
   - Description of changes
   - Testing performed
   - Screenshots (for UI changes)
   - Breaking changes (if any)
3. **Link related issues** using keywords like "Fixes #123"
4. **Request review** from maintainers
5. **Address feedback** promptly and professionally

## What to Contribute

### High Priority
- Bug fixes
- Performance improvements
- Accessibility improvements
- Documentation improvements
- Test coverage

### Medium Priority
- New authentication providers
- UI/UX enhancements
- Additional team management features
- Internationalization

### Ideas for Contributions
- Add more comprehensive error handling
- Implement user onboarding flow
- Add bulk user operations
- Create admin dashboard
- Add audit logging
- Implement organization settings
- Add user activity tracking

## Code Review Guidelines

When reviewing PRs:
- Be constructive and respectful
- Focus on code quality and maintainability
- Consider security implications
- Check for proper error handling
- Verify accessibility standards
- Ensure documentation is updated

## Getting Help

- Open an issue for bugs or feature requests
- Ask questions in pull request comments
- Check existing issues and PRs first
- Be patient and respectful

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).
