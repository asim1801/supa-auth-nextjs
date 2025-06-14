#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

function detectPackageManager() {
  // Check for lock files first (most reliable)
  if (fs.existsSync('pnpm-lock.yaml')) {
    console.log('pnpm');
    return;
  }
  
  if (fs.existsSync('yarn.lock')) {
    console.log('yarn');
    return;
  }
  
  if (fs.existsSync('package-lock.json')) {
    console.log('npm');
    return;
  }
  
  // Check which package managers are available
  const managers = ['pnpm', 'yarn', 'npm'];
  
  for (const manager of managers) {
    try {
      execSync(`${manager} --version`, { stdio: 'ignore' });
      console.log(manager);
      return;
    } catch {
      // Continue to next manager
    }
  }
  
  // Fallback to npm
  console.log('npm');
}

detectPackageManager(); 