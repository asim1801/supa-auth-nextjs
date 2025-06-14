#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function copyEnvFile() {
  const envExample = '.env.example';
  const envLocal = '.env.local';
  
  if (!fs.existsSync(envLocal)) {
    if (fs.existsSync(envExample)) {
      fs.copyFileSync(envExample, envLocal);
      console.log('✅ Created .env.local from .env.example');
      return true;
    } else {
      console.log('⚠️  .env.example not found');
      return false;
    }
  } else {
    console.log('ℹ️  .env.local already exists');
    return true;
  }
}

function generateEncryptionKey() {
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
}

function updateEnvFile() {
  const envLocal = '.env.local';
  
  if (fs.existsSync(envLocal)) {
    let content = fs.readFileSync(envLocal, 'utf8');
    
    // Generate encryption key if not present
    if (content.includes('your_secure_encryption_key_here')) {
      const encryptionKey = generateEncryptionKey();
      content = content.replace('your_secure_encryption_key_here', encryptionKey);
      fs.writeFileSync(envLocal, content);
      console.log('✅ Generated encryption key');
    }
    
    // Check if Supabase credentials are still placeholders
    if (content.includes('your_supabase_project_url') || content.includes('your_supabase_anon_key')) {
      console.log('\n⚠️  Please update your Supabase credentials in .env.local:');
      console.log('   1. Go to https://supabase.com');
      console.log('   2. Create a new project or select existing one');
      console.log('   3. Go to Settings > API');
      console.log('   4. Copy your Project URL and anon key to .env.local');
    }
  }
}

function checkDependencies() {
  console.log('\n🔍 Checking dependencies...');
  
  const packageManagers = [
    { name: 'npm', command: 'npm --version' },
    { name: 'yarn', command: 'yarn --version' },
    { name: 'pnpm', command: 'pnpm --version' }
  ];
  
  const available = [];
  
  packageManagers.forEach(pm => {
    try {
      const version = execSync(pm.command, { encoding: 'utf8' }).trim();
      available.push(`${pm.name} (${version})`);
    } catch {
      // Package manager not available
    }
  });
  
  if (available.length > 0) {
    console.log(`✅ Available package managers: ${available.join(', ')}`);
  } else {
    console.log('❌ No package managers found. Please install npm, yarn, or pnpm.');
  }
  
  return available.length > 0;
}

function main() {
  console.log('🚀 Setting up Supauth...\n');
  
  // Check dependencies
  if (!checkDependencies()) {
    process.exit(1);
  }
  
  // Copy environment file
  copyEnvFile();
  
  // Update environment file
  updateEnvFile();
  
  console.log('\n🎉 Setup complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Update .env.local with your Supabase credentials');
  console.log('2. Run your preferred command:');
  console.log('   • npm run dev');
  console.log('   • yarn dev');
  console.log('   • pnpm dev');
  console.log('\n📖 For detailed setup instructions, see README.md');
}

main(); 