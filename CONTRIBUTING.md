# Contributing to AI Tracking Engine

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes
6. Commit: `git commit -m "Add: your feature description"`
7. Push: `git push origin feature/your-feature-name`
8. Create a Pull Request

## Development Setup

Follow the [SETUP.md](./SETUP.md) guide to set up your development environment.

## Code Style

### TypeScript
- Use TypeScript for all new code
- Follow existing code style
- Use meaningful variable names
- Add comments for complex logic

### React Components
- Use functional components with hooks
- Keep components small and focused
- Use TypeScript interfaces for props
- Follow the existing component structure

### Backend Services
- Keep services focused on single responsibility
- Add error handling
- Log important operations
- Write descriptive function names

## Commit Messages

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Examples:
```
feat: add user authentication
fix: resolve confidence score calculation bug
docs: update setup instructions
```

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Manual Testing
1. Start the application
2. Test all major features:
   - Document upload
   - Query system
   - Dashboard drag-and-drop
   - Analytics charts
3. Check console for errors
4. Verify API responses

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Request review from maintainers

### PR Checklist
- [ ] Code follows project style
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No console errors
- [ ] Builds successfully
- [ ] Tested locally

## Feature Requests

Open an issue with:
- Clear description
- Use case
- Expected behavior
- Mockups (if UI change)

## Bug Reports

Include:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment (OS, Node version, etc.)

## Code Review

All submissions require review. We use GitHub pull requests for this purpose.

### Review Criteria
- Code quality
- Test coverage
- Documentation
- Performance impact
- Security considerations

## Areas for Contribution

### High Priority
- [ ] User authentication system
- [ ] Real-time dashboard updates
- [ ] Advanced analytics features
- [ ] Comprehensive test suite
- [ ] Performance optimizations

### Medium Priority
- [ ] Multi-language support
- [ ] Export functionality
- [ ] Email notifications
- [ ] Advanced filtering
- [ ] Batch operations

### Good First Issues
- [ ] UI improvements
- [ ] Documentation enhancements
- [ ] Error message improvements
- [ ] Loading state refinements
- [ ] Accessibility improvements

## Questions?

- Open an issue for questions
- Check existing issues first
- Be respectful and constructive

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to AI Tracking Engine! 🎉
