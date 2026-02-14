# 🚀 Tanmay01-D3V — Developer Portfolio

A cinematic, scroll-driven portfolio built with **React**, **Three.js**, and **GSAP**. Every animation is intentional — designed to feel like an experience, not just a webpage.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-r182-000000?logo=three.js&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-3.14-88CE02?logo=greensock&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

---

## ✨ Features

### 🎬 Frame-by-Frame Scroll Animation
154 hand-sequenced frames play back as you scroll — like watching a film unfold in real time. Powered by GSAP ScrollTrigger with canvas rendering for maximum performance.

### 🌀 3D Interactive Elements
- **Rotating Skills Cylinder** — A textured, bloom-enhanced 3D cylinder showcasing skills, built with React Three Fiber and post-processing effects.
- **Video-Mapped Smiley** — A pixel-art smiley face made of hundreds of cubes, each mapped with a live video texture using custom GLSL shaders.

### ↔️ Horizontal Scrolling
The Skills section scrolls horizontally while you scroll vertically — pinned and scrubbed with GSAP ScrollTrigger for a seamless experience.

### 🧈 Smooth Scrolling
Lenis provides buttery-smooth, momentum-based scrolling across the entire site, perfectly synced with GSAP animations.

### 📬 Contact Form
A clean, minimal contact form styled with a dark premium aesthetic — opens the user's email client with pre-filled fields.

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | React 19 |
| **Build Tool** | Vite 8 |
| **3D Rendering** | Three.js, React Three Fiber, React Three Drei |
| **Post-Processing** | React Three Postprocessing (Bloom) |
| **Animation** | GSAP + ScrollTrigger |
| **Smooth Scroll** | Lenis |
| **Styling** | Tailwind CSS v4 |
| **Fonts** | Pirata One, Cinzel, Merriweather (Google Fonts) |
| **Video Hosting** | Cloudinary CDN |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
Portfolio_website/
├── Porfolio_page/              # Main application
│   ├── public/
│   │   ├── frames/             # 154 JPEG frames for scroll animation
│   │   ├── Frame 1.png         # Skills showcase image
│   │   ├── Frame 2.png         # Cylinder texture
│   │   └── smile.jpg           # Smiley mask image
│   ├── src/
│   │   ├── App.jsx             # Main app component (all pages)
│   │   ├── models.jsx          # Three.js model utilities
│   │   ├── GLApp.js            # WebGL app helper
│   │   ├── index.css           # Global styles + Tailwind config
│   │   └── main.jsx            # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** >= 18
- **npm** >= 9

### Installation

```bash
# Clone the repository
git clone https://github.com/Tanmay01-D3V/portfolio-website.git
cd portfolio-website/Porfolio_page

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The site will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🌐 Deployment

This project is deployed on **Vercel** with the following configuration:

| Setting | Value |
|---|---|
| Root Directory | `Porfolio_page` |
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

> **Note:** The video texture is hosted externally on Cloudinary to stay within Vercel's 100MB deployment limit.

---

## 📄 Pages

| Page | Description |
|---|---|
| **Home** | Hero section with 154-frame scroll animation and animated navigation |
| **Skills** | Horizontally scrolling section with a large typography header and skills showcase |
| **Projects** | 3D rotating cylinder with bloom post-processing effects |
| **Contact** | Dark-themed contact form alongside an interactive 3D video-mapped smiley |

---

## 🤝 Connect

- **GitHub:** [Tanmay01-D3V](https://github.com/Tanmay01-D3V)
- **Email:** tanmayvijaysherkar@gmail.com

---

<p align="center">
  Built with ☕ and curiosity by <strong>Tanmay Vijay Sherkar</strong>
</p>
