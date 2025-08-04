<div align="center">
  
# ⚡ UPSAPI ⚡
### *Raspberry Pi UPS Monitoring & Hubitat Integration*

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Raspberry Pi](https://img.shields.io/badge/Raspberry%20Pi-A22846?style=for-the-badge&logo=raspberry-pi&logoColor=white)](https://www.raspberrypi.org/)
[![Hubitat](https://img.shields.io/badge/Hubitat-00A1C9?style=for-the-badge&logo=smartthings&logoColor=white)](https://hubitat.com/)

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=flat-square)](LICENSE)
[![Stars](https://img.shields.io/github/stars/neerpatel/upsapi?style=flat-square)](https://github.com/neerpatel/upsapi/stargazers)
[![Issues](https://img.shields.io/github/issues/neerpatel/upsapi?style=flat-square)](https://github.com/neerpatel/upsapi/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

**🔋 Monitor your APC UPS from a Raspberry Pi and automate your smart home with Hubitat!**  
*Track power status, battery health, and automate alerts or actions when your UPS changes state.*

![Demo GIF or Screenshot Placeholder]

</div>

---

## � Documentation

<div align="center">

| 📋 Document | 📝 Description |
|-------------|----------------|
| [🏗️ Project Overview](./docs/overview.md) | High-level architecture and data flow |
| [⚙️ apcupsd-scripts](./docs/apcupsd-scripts.md) | UPS daemon configuration |
| [🚀 app](./docs/app.md) | Node.js API server details |
| [🏠 Hubitat](./docs/hubitat.md) | Smart home integration guide |

</div>

---

## 🏗️ System Architecture

<div align="center">

```mermaid
flowchart TD
    A[⚡ APC UPS] -- USB/Network --> B[🔧 apcupsd Daemon]
    B -- Socket/CLI --> C[🚀 upsapi Node.js App]
    C -- POST /notify --> D[🏠 Hubitat Hub]
    D --> E[📱 UPSMonitor Driver]
    
    style A fill:#ff6b6b,stroke:#d63031,stroke-width:3px,color:#fff
    style B fill:#74b9ff,stroke:#0984e3,stroke-width:3px,color:#fff
    style C fill:#55a3ff,stroke:#2d3436,stroke-width:3px,color:#fff
    style D fill:#00b894,stroke:#00a085,stroke-width:3px,color:#fff
    style E fill:#fdcb6e,stroke:#e17055,stroke-width:3px,color:#fff
```

</div>

---

## ✨ Features

<div align="center">

| Feature | Description |
|---------|-------------|
| 🔄 **Real-time Monitoring** | Live UPS status via network socket or CLI |
| 🌐 **REST API** | Clean endpoints for UPS status and metrics |
| ⏰ **Automated Polling** | Scheduled data push to Hubitat every 5 minutes |
| 🔔 **Smart Notifications** | Customizable alerts and device attributes |
| 🚀 **Easy Deployment** | One-command setup with PM2 and shell scripts |
| 🔧 **Extensible** | Add new metrics or automation rules easily |
| 📊 **Dashboard Ready** | Works seamlessly with Hubitat dashboards |
| 🔋 **Battery Health** | Track charge level, runtime, and voltage |

</div>

---

## 🚀 Quick Start

<div align="center">

### 🎯 *Get up and running in minutes!*

</div>

| Step | Action | Command |
|------|--------|---------|
| **1️⃣** | **Prepare Raspberry Pi** | *Ensure OS is installed and networked* |
| **2️⃣** | **Setup SSH Keys** | `ssh-keygen -t rsa && ssh-copy-id pi@<PI_IP>` |
| **3️⃣** | **Install Dependencies** | `curl -sL https://raw.githubusercontent.com/neerpatel/upsapi/main/setup.sh \| sudo -E bash -` |
| **4️⃣** | **Deploy Application** | `curl -sL https://raw.githubusercontent.com/neerpatel/upsapi/main/app/ecosystem.config.js -O && pm2 deploy production setup && pm2 deploy production` |

<div align="center">

### 🎉 **That's it! Your UPS monitoring is now live!**

</div>

---

## 🤝 Contributing

<div align="center">

**🌟 We welcome your contributions! 🌟**

[![Contributors](https://img.shields.io/github/contributors/neerpatel/upsapi?style=for-the-badge)](https://github.com/neerpatel/upsapi/graphs/contributors)
[![Forks](https://img.shields.io/github/forks/neerpatel/upsapi?style=for-the-badge)](https://github.com/neerpatel/upsapi/network/members)

</div>

| Type | How to Help |
|------|-------------|
| 🐛 **Bug Reports** | Found an issue? [Open an issue](https://github.com/neerpatel/upsapi/issues/new) |
| ✨ **Feature Requests** | Have an idea? [Request a feature](https://github.com/neerpatel/upsapi/issues/new) |
| 🔧 **Code Contributions** | See our [CONTRIBUTING.md](CONTRIBUTING.md) guide |
| 📖 **Documentation** | Help improve our docs and examples |

<div align="center">

*Check out our [Contributing Guidelines](CONTRIBUTING.md) to get started!*

</div>

---

## 💡 Why Choose UPSAPI?

<div align="center">

| Benefit | Description |
|---------|-------------|
| 🛡️ **Peace of Mind** | Always know your backup power status |
| 🏠 **Smart Integration** | Automate lights, notifications, shutdowns on power events |
| 🔓 **Open Source** | Built for the community, by the community |
| ⚡ **Performance** | Lightweight, efficient, reliable monitoring |
| 🔧 **Flexibility** | Easy to customize and extend |

</div>

---

## 📬 Support & Community

<div align="center">

[![GitHub Issues](https://img.shields.io/badge/GitHub-Issues-red?style=for-the-badge&logo=github)](https://github.com/neerpatel/upsapi/issues)
[![Discussions](https://img.shields.io/badge/GitHub-Discussions-purple?style=for-the-badge&logo=github)](https://github.com/neerpatel/upsapi/discussions)

**Questions? Ideas? Just want to chat?**  
*We'd love to hear from you!*

</div>

---

<div align="center">

### 🌟 **Star this repo if it helped you!** 🌟

**Made with ❤️ for the Raspberry Pi and Home Automation community**

</div>




