#!/bin/bash

# Supauth One-Liner Installer
# Usage: curl -fsSL https://raw.githubusercontent.com/asim1801/supa-auth-nextjs/main/install.sh | bash

set -e

echo "🚀 Installing Supauth..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is required but not installed. Please install git first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed. Please install Node.js 18+ first."
    exit 1
fi

# Clone the repository
echo "📦 Cloning repository..."
git clone https://github.com/asim1801/supa-auth-nextjs.git
cd supa-auth-nextjs

# Detect and use appropriate package manager
echo "🔍 Detecting package manager..."

if command -v pnpm &> /dev/null; then
    echo "✅ Using pnpm"
    pnpm install
    PM="pnpm"
elif command -v yarn &> /dev/null; then
    echo "✅ Using yarn"
    yarn install
    PM="yarn"
else
    echo "✅ Using npm"
    npm install
    PM="npm"
fi

# Run setup
echo "⚙️  Running setup..."
node scripts/setup.js

echo ""
echo "🎉 Installation complete!"
echo ""
echo "📋 Next steps:"
echo "1. cd supa-auth-nextjs"
echo "2. Update .env.local with your Supabase credentials"
echo "3. Run: $PM dev"
echo ""
echo "📖 For detailed instructions, see README.md" 