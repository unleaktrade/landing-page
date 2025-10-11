# 🛡️ UmbraTrade Landing Page

Welcome to the official **UmbraTrade** landing page — a high-performance and visually engaging web experience designed to introduce the UmbraTrade ecosystem.

---

## 🚀 Overview

This project is built using **Vite** and **React**, focusing on speed, maintainability, and scalability.  
It represents the public-facing entry point to the UmbraTrade platform and emphasizes performance, simplicity, and brand identity.

---

## ✨ Features

- ⚡ **Vite-powered** — instant hot reloads and optimized builds  
- 🎨 **Modern design** following UmbraTrade’s dark aesthetic  
- 📱 **Fully responsive** across devices  
- 🧱 **Clean modular structure** for easy maintenance  
- 🔧 **Automated CI/CD** with GitHub Actions — auto-deploys on commits to `main`  

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-------------|
| Framework | [Vite](https://vitejs.dev/) + [React](https://react.dev/) |
| Styling | Tailwind CSS |
| Deployment | GitHub Pages (via GitHub Actions) |
| Language | JavaScript / TypeScript |

---

## 🧭 Local Development

Run the project locally for development and testing:

```bash
# Clone the repository
git clone https://github.com/umbratrade/landing-page.git
cd landing-page

# Install dependencies
npm install

# Start the local server
npm run dev
```

The site will be available at [http://localhost:3000](http://localhost:3000).

---

## ⚙️ DevOps Pipeline

This project includes an **automated GitHub Actions workflow** that:  

- Builds the project on every push to the main branch  
- Automatically deploys the latest version to **GitHub Pages**  

No manual deployment steps are required — simply commit and push your changes.

---

## 🖼️ Branding

The favicon and title are configured in the `index.html` file:

```html
<title>UmbraTrade | Welcome</title>
<link rel="icon" type="image/png" href="/favicon.png" />
```

To update branding, replace the favicon in `public/favicon.png`.

---

---

## 🤝 Contributing

Pull requests are welcome!
Please follow conventional commit messages and open an issue before introducing major changes.

## 📜 License

This project is licensed under the **MIT License**.  
See the `LICENSE` file for details.

---

© UmbraTrade — All rights reserved.
