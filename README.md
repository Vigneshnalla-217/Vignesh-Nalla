# Vignesh Nalla — Personal Developer Portfolio

Personal portfolio website for **Vignesh Nalla** (`vigneshnalla.com`), built with React, TypeScript, Tailwind CSS, Motion, Three.js, and Express.

---

## 1. Project Structure

```text
├── index.html                  # SEO meta tags, Open Graph, JSON-LD, Google Fonts
├── server.ts                   # Express server + Vite middleware + /api/contact endpoint
├── public/
│   ├── favicon.svg             # VN monogram SVG favicon
│   ├── robots.txt              # Search crawler rules
│   ├── sitemap.xml             # Sitemap pointing to https://vigneshnalla.com/
│   └── assets/...              # Profile portrait image
└── src/
    ├── data/
    │   └── portfolioConfig.ts  # Centralized content configuration (edit this first!)
    ├── hooks/
    │   └── useDeviceCapabilities.ts
    └── components/
        ├── Navbar.tsx          # Sticky navigation & mobile drawer
        ├── HeroScene3D.tsx     # Interactive Three.js 3D geometric stage
        ├── HeroSection.tsx     # Hero typography, portrait, floating cards & CTAs
        ├── AboutSection.tsx    # Bio narrative & 4 pillars
        ├── JourneySection.tsx  # Interactive timeline
        ├── SkillsSection.tsx   # Python & Java ("Currently Learning") + roadmap
        ├── ProjectsSection.tsx # Starter concepts ("Coming Soon") + detail modal
        ├── EducationSection.tsx# MPC Intermediate 2nd Year & certifications slot
        ├── GoalsSection.tsx    # 7-item future goals matrix
        ├── ContactSection.tsx  # Direct email/GitHub/Instagram & contact form
        ├── CustomCursor.tsx    # Desktop-only pointer cursor
        └── Footer.tsx
```

---

## 2. How to Update Your Website Content

Almost all text, links, and portfolio entries live in **`src/data/portfolioConfig.ts`**.

- **Change Profile Photo**: Place your new photo inside `public/assets/` and update `personal.profilePhoto.src`.
- **Update Introduction & Bio**: Edit `personal.heroIntro` and `about.paragraphs`.
- **Add Programming Languages**: Append a new object to `skills.items` (with `status: 'Currently Learning' | 'Practicing' | 'Proficient'`).
- **Add Real Projects & GitHub Links**: Update an existing entry in `projects.items` or add a new one with real `liveUrl` and `githubUrl` values, and set `stageLabel: 'Completed'`.
- **Update Education & Add Certifications**: Edit `education.items` or add entries to `education.certifications`.
- **Add LinkedIn Later**: Set `social.linkedinUrl` when your profile is ready.

---

## 3. Local Development & Optional Email Delivery

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

### Contact Form Email Delivery
By default, if no email API key is configured, the contact form never fakes a successful delivery—instead, it provides an instant **Open in Email App** button pre-filled with the visitor's message and a **Copy Message** button.

To enable direct server-side email delivery to `vigneshnalla28@gmail.com`:
1. Create a free account at [Resend](https://resend.com/) and verify your sending domain (`vigneshnalla.com`).
2. Add `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` to your hosting environment variables (never commit secrets to Git).

---

## 4. Deployment & Custom Domain Guide (`vigneshnalla.com`)

> Note: You will need to register `vigneshnalla.com` through a domain registrar (such as Cloudflare Registrar, Namecheap, or Porkbun) before connecting DNS.

### Option A: Deploy on Vercel (Recommended)

1. **Push Code to GitHub**
   - Create a new repository on [GitHub](https://github.com/Vigneshnalla-217) (for example, `vigneshnalla-portfolio`).
   - Initialize and push your code:
     ```bash
     git init
     git add .
     git commit -m "Initial portfolio website"
     git branch -M main
     git remote add origin https://github.com/Vigneshnalla-217/vigneshnalla-portfolio.git
     git push -u origin main
     ```
2. **Connect GitHub Repository to Vercel**
   - Sign in to [Vercel](https://vercel.com) with your GitHub account.
   - Click **Add New → Project** and import `vigneshnalla-portfolio`.
   - Framework Preset: **Vite** · Build Command: `npm run build` · Output Directory: `dist`.
   - Click **Deploy**.
3. **Connect Custom Domain (`vigneshnalla.com`)**
   - In your Vercel project, go to **Settings → Domains**.
   - Enter `vigneshnalla.com` and click **Add** (Vercel also configures `www.vigneshnalla.com` redirect).
4. **Configure DNS Records at Your Domain Registrar**
   - Vercel will display the exact DNS records to add in your registrar's DNS dashboard:
     - **A Record**: Host `@` → `76.76.21.21`
     - **CNAME Record**: Host `www` → `cname.vercel-dns.com`
5. **Enable HTTPS**
   - Vercel automatically provisions and renews free **SSL/TLS (HTTPS)** certificates via Let's Encrypt once DNS propagates (usually 5–30 minutes).
6. **Update the Website Later**
   - Edit `src/data/portfolioConfig.ts`, commit, and `git push` to `main`. Vercel automatically rebuilds and publishes every push.

### Option B: Deploy on Netlify

1. Push your repository to GitHub (same steps as above).
2. Log in to [Netlify](https://www.netlify.com) → **Add new site → Import an existing project** → choose your GitHub repo.
3. Set Build command: `npm run build` and Publish directory: `dist`.
4. Go to **Domain management → Add a domain** and enter `vigneshnalla.com`.
5. Point your registrar's DNS records as instructed by Netlify (A record to Netlify's load balancer IP `75.2.60.5` and CNAME `www` to `<your-site>.netlify.app`, or switch to Netlify DNS).
6. Under **Domain management → HTTPS**, click **Verify DNS configuration** to issue your free Let's Encrypt HTTPS certificate automatically.
7. Every future `git push` to `main` triggers an automatic Netlify rebuild.
