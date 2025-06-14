# 🔐 Supauth

**Free, Open Source Authentication Kit for Modern Web Applications**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

Supauth is a complete, production-ready authentication system built with modern web technologies. Get up and running with secure authentication in minutes, not days.

## ✨ Features

- 🆓 **100% Free & Open Source** - No hidden costs, no vendor lock-in
- 🔒 **Enterprise-grade Security** - Built with security best practices
- ⚡ **Production Ready** - Ready to deploy and scale
- 🎨 **Beautiful UI** - Modern interface with shadcn/ui components
- 🌙 **Dark/Light Mode** - Automatic theme switching
- 📱 **Responsive Design** - Works on all devices
- 🔑 **Complete Auth Flow** - Sign up, sign in, password reset, email verification
- 👥 **Team Management** - Organization and member management
- 🛡️ **2FA Support** - Two-factor authentication ready
- 🚀 **Fast Setup** - Get started in under 5 minutes

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React

## 📦 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- A Supabase account (free tier available)

### 1. Clone & Install

**Option A: One-Liner Installation (Fastest)**
```bash
curl -fsSL https://raw.githubusercontent.com/asim1801/supa-auth-nextjs/main/install.sh | bash
```

**Option B: Quick Setup (Recommended)**
```bash
git clone https://github.com/asim1801/supa-auth-nextjs.git
cd supa-auth-nextjs
npm run setup  # Automatically detects your package manager
```

**Option C: Manual Installation**

With npm:
```bash
git clone https://github.com/asim1801/supa-auth-nextjs.git
cd supa-auth-nextjs
npm install
```

With yarn:
```bash
git clone https://github.com/asim1801/supa-auth-nextjs.git
cd supa-auth-nextjs
yarn install
```

With pnpm:
```bash
git clone https://github.com/asim1801/supa-auth-nextjs.git
cd supa-auth-nextjs
pnpm install
```

### 2. Set up Supabase
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your credentials
3. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
4. Add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_ENCRYPTION_KEY=your_secure_random_key_here
   ```

### 3. Run the Application

Choose your preferred package manager:

```bash
# With npm
npm run dev

# With yarn  
yarn dev

# With pnpm
pnpm dev
```

### 4. Open Your Browser
Navigate to [http://localhost:3000](http://localhost:3000)

🎉 **That's it!** You now have a fully functional authentication system running locally.

### 5. Optional: Set up Database Tables
The app will work in demo mode, but for full functionality, run the SQL migrations in your Supabase dashboard (found in the `/supabase` folder).

## 🏗️ Project Structure

```
supa-auth-nextjs/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   ├── profile/           # User profile pages
│   │   ├── team-members/      # Team management
│   │   └── ...
│   ├── components/            # Reusable components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── auth/             # Authentication components
│   │   └── ...
│   ├── lib/                  # Utilities and configurations
│   ├── hooks/                # Custom React hooks
│   └── types/                # TypeScript type definitions
├── public/                   # Static assets
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── ...
```

## 🔧 Configuration

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Add them to your `.env.local` file
4. Run the database migrations (if any)

### Customization

- **Branding**: Update logos and colors in the components
- **Styling**: Modify Tailwind CSS classes or add custom CSS
- **Features**: Add or remove authentication features as needed

## 🤝 Contributing

I welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚀 Live Demo

🌐 **[View Live Demo](https://asim1801.github.io/supa-auth-nextjs/)**

Experience Supauth in action with our live demonstration.

## 📱 Deployment

### GitHub Pages (Automatic)
Every push to the `main` branch automatically deploys to GitHub Pages via GitHub Actions.

### Manual Deployment
```bash
# Build and deploy to GitHub Pages
npm run deploy

# Or deploy to your own hosting
npm run build
# Upload the 'out' folder to your hosting provider
```

### Vercel Deployment
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/asim1801/supa-auth-nextjs)

### Netlify Deployment
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/asim1801/supa-auth-nextjs)

## 🆘 Support

- 📖 [Documentation](https://github.com/asim1801/supa-auth-nextjs/wiki)
- 🐛 [Report Issues](https://github.com/asim1801/supa-auth-nextjs/issues)
- 💬 [Discussions](https://github.com/asim1801/supa-auth-nextjs/discussions)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Authentication powered by [Supabase](https://supabase.com/)
- Icons by [Lucide](https://lucide.dev/)

---

⭐ **Star this repository if you find it helpful!**

Made with ❤️ for the open source community
