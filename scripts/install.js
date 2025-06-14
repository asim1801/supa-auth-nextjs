#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function detectPackageManager() {
  // Check for lock files to determine preferred package manager
  if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm';
  if (fs.existsSync('yarn.lock')) return 'yarn';
  if (fs.existsSync('package-lock.json')) return 'npm';
  
  // Check if package managers are available
  try {
    execSync('pnpm --version', { stdio: 'ignore' });
    return 'pnpm';
  } catch {}
  
  try {
    execSync('yarn --version', { stdio: 'ignore' });
    return 'yarn';
  } catch {}
  
  return 'npm';
}

function runCommand(command) {
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Failed to execute: ${command}`);
    return false;
  }
}

function main() {
  const packageManager = detectPackageManager();
  
  console.log(`🚀 Installing dependencies with ${packageManager}...`);
  
  const installCommands = {
    npm: 'npm install',
    yarn: 'yarn install',
    pnpm: 'pnpm install'
  };
  
  const success = runCommand(installCommands[packageManager]);
  
  if (success) {
    console.log(`✅ Dependencies installed successfully with ${packageManager}!`);
    console.log('\n📋 Next steps:');
    console.log('1. Copy .env.example to .env.local');
    console.log('2. Add your Supabase credentials');
    console.log(`3. Run: ${packageManager === 'npm' ? 'npm run dev' : `${packageManager} dev`}`);
  } else {
    console.error('❌ Installation failed');
    process.exit(1);
  }
}

main(); 