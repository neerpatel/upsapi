# 🤝 Contributing to UPSAPI

<div align="center">

**Thank you for your interest in contributing to UPSAPI!** 🎉  
*Your contributions help make UPS monitoring better for everyone.*

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)
[![First Timers Only](https://img.shields.io/badge/first--timers--only-friendly-blue.svg?style=for-the-badge)](https://www.firsttimersonly.com/)

</div>

---

## 🎯 Ways to Contribute

| Type | Description | Examples |
|------|-------------|----------|
| 🐛 **Bug Reports** | Found something broken? | Connection issues, parsing errors, crashes |
| ✨ **Feature Requests** | Have a cool idea? | New UPS models, additional metrics, UI improvements |
| 🔧 **Code Contributions** | Ready to dive in? | Bug fixes, new features, performance improvements |
| 📖 **Documentation** | Help others understand | API docs, setup guides, troubleshooting |
| 🧪 **Testing** | Help us stay reliable | Test on different hardware, edge cases |

---

## 🚀 Getting Started

### 📋 Prerequisites

- **Node.js** (v14+ recommended)
- **Raspberry Pi** with Raspberry Pi OS
- **APC UPS** compatible with `apcupsd`
- **Hubitat Hub** (for full integration testing)

### 🛠️ Development Setup

1. **Fork & Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/upsapi.git
   cd upsapi
   ```

2. **Install Dependencies**
   ```bash
   cd app
   npm install
   ```

3. **Set up Environment**
   ```bash
   cp example.env .env
   # Edit .env with your configuration
   ```

4. **Run Development Server**
   ```bash
   npm start
   ```

---

## 🔧 Development Guidelines

### 📁 Project Structure

```
upsapi/
├── app/                    # Node.js application
│   ├── api/               # API route handlers
│   ├── config/            # Configuration files
│   ├── server.js          # Main server
│   └── cron.js            # Scheduled tasks
├── apcupsd-scripts/       # UPS daemon configuration
├── Hubitat/              # Groovy device driver
├── docs/                 # Documentation
└── README.md
```

### 🎨 Coding Standards

- **JavaScript**: Use ES6+ features, async/await for promises
- **Logging**: Use Winston logger, include IP addresses for API calls
- **Error Handling**: Always return JSON with proper HTTP status codes
- **Comments**: Document complex logic and API endpoints

### 📝 Commit Convention

Use descriptive commit messages:

```bash
# Good examples
git commit -m "feat: add battery temperature monitoring"
git commit -m "fix: handle apcupsd connection timeout"
git commit -m "docs: update Hubitat setup guide"

# Prefixes
feat:     # New feature
fix:      # Bug fix
docs:     # Documentation
refactor: # Code refactoring
test:     # Adding tests
chore:    # Maintenance
```

---

## 🐛 Reporting Issues

### Before Submitting

- [ ] Check existing [issues](https://github.com/neerpatel/upsapi/issues)
- [ ] Search [discussions](https://github.com/neerpatel/upsapi/discussions)
- [ ] Try the latest version
- [ ] Check logs for error messages

### 🔍 Issue Template

**Bug Report:**
```markdown
## Bug Description
Brief description of the issue

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Raspberry Pi Model: 
- OS Version: 
- Node.js Version: 
- UPS Model: 
- Hubitat Firmware: 

## Logs
```
Paste relevant log entries here
```

## Additional Context
Any other helpful information
```

---

## ✨ Feature Requests

We love new ideas! When submitting feature requests:

1. **Check existing requests** first
2. **Describe the problem** you're trying to solve
3. **Propose a solution** if you have one
4. **Consider the scope** - is it widely useful?

---

## 🔄 Pull Request Process

### 1. Preparation

- [ ] Fork the repository
- [ ] Create a feature branch (`git checkout -b feature/amazing-feature`)
- [ ] Make your changes
- [ ] Test thoroughly

### 2. Before Submitting

- [ ] Update documentation if needed
- [ ] Add tests for new functionality
- [ ] Ensure all tests pass
- [ ] Check code style consistency
- [ ] Update CHANGELOG.md if applicable

### 3. Submitting

- [ ] Push to your fork
- [ ] Create a Pull Request
- [ ] Fill out the PR template
- [ ] Link related issues

### 4. PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing
- [ ] Tested on Raspberry Pi
- [ ] Tested with Hubitat
- [ ] Added unit tests
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or marked as such)

## Screenshots/Logs
If applicable, add screenshots or log outputs
```

---

## 🧪 Testing

### Manual Testing

1. **API Endpoints**
   ```bash
   curl http://localhost:8070/ups/status
   curl http://localhost:8070/hubitat
   ```

2. **Hubitat Integration**
   - Check device status updates
   - Verify attribute changes
   - Test automation triggers

3. **Error Scenarios**
   - Disconnect UPS
   - Stop apcupsd service
   - Network interruptions

---

## 📚 Documentation

Help improve our docs:

- **API Documentation**: Document new endpoints
- **Setup Guides**: Improve installation steps
- **Troubleshooting**: Add common issues and solutions
- **Examples**: Show real-world usage

---

## 🏆 Recognition

Contributors are recognized in:

- GitHub contributors list
- Release notes for significant contributions
- Special mentions for first-time contributors

---

## 💬 Getting Help

Stuck? Need guidance?

- 💬 [GitHub Discussions](https://github.com/neerpatel/upsapi/discussions)
- 🐛 [Issues](https://github.com/neerpatel/upsapi/issues)
- 📧 Open an issue for questions

---

## 📜 Code of Conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/). Please be respectful and inclusive in all interactions.

---

<div align="center">

**🌟 Thank you for contributing to UPSAPI! 🌟**

*Together, we're making UPS monitoring better for everyone.*

</div>
