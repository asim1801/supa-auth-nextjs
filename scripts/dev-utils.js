#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Check environment setup
function checkEnvironment() {
  log('🔍 Checking environment setup...', 'blue');
  
  const envFile = path.join(process.cwd(), '.env.local');
  const envExample = path.join(process.cwd(), '.env.example');
  
  if (!fs.existsSync(envFile)) {
    log('⚠️  .env.local not found', 'yellow');
    
    if (fs.existsSync(envExample)) {
      log('📋 Copying .env.example to .env.local', 'cyan');
      fs.copyFileSync(envExample, envFile);
      log('✅ Created .env.local from .env.example', 'green');
      log('🔧 Please edit .env.local with your actual values', 'yellow');
    }
  } else {
    log('✅ .env.local exists', 'green');
  }
  
  // Check for required environment variables
  require('dotenv').config({ path: envFile });
  
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'ENCRYPTION_KEY'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    log(`⚠️  Missing environment variables: ${missingVars.join(', ')}`, 'yellow');
    log('ℹ️  App will run in demo mode', 'blue');
  } else {
    log('✅ All required environment variables are set', 'green');
  }
}

// Generate encryption key
function generateEncryptionKey() {
  const crypto = require('crypto');
  const key = crypto.randomBytes(32).toString('hex');
  
  log('🔐 Generated encryption key:', 'blue');
  log(`ENCRYPTION_KEY=${key}`, 'cyan');
  log('📋 Copy this to your .env.local file', 'yellow');
  
  return key;
}

// Database utilities
function checkDatabase() {
  log('🗄️  Checking database connection...', 'blue');
  
  // Simple check - try to import supabase
  try {
    const { supabase } = require('../src/lib/supabase');
    log('✅ Supabase client initialized', 'green');
    
    // Test connection
    supabase.from('profiles').select('count', { count: 'exact', head: true })
      .then(({ error, count }) => {
        if (error) {
          log(`❌ Database connection failed: ${error.message}`, 'red');
        } else {
          log(`✅ Database connected (${count} profiles)`, 'green');
        }
      });
  } catch (error) {
    log(`❌ Supabase setup error: ${error.message}`, 'red');
  }
}

// Code quality checks
function runQualityChecks() {
  log('🔍 Running quality checks...', 'blue');
  
  const checks = [
    { name: 'TypeScript check', command: 'npx tsc --noEmit' },
    { name: 'ESLint check', command: 'npx eslint . --ext .ts,.tsx --max-warnings 0' },
    { name: 'Prettier check', command: 'npx prettier --check .' }
  ];
  
  checks.forEach(({ name, command }) => {
    log(`Running ${name}...`, 'cyan');
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        log(`❌ ${name} failed`, 'red');
        if (stderr) console.log(stderr);
      } else {
        log(`✅ ${name} passed`, 'green');
      }
    });
  });
}

// Performance audit
function performanceAudit() {
  log('⚡ Running performance audit...', 'blue');
  
  const bundleAnalyzer = 'npx next build --debug';
  
  exec(bundleAnalyzer, (error, stdout, stderr) => {
    if (error) {
      log('❌ Performance audit failed', 'red');
      console.log(error);
    } else {
      log('✅ Performance audit completed', 'green');
      log('📊 Check the output above for bundle analysis', 'cyan');
    }
  });
}

// Security audit
function securityAudit() {
  log('🛡️  Running security audit...', 'blue');
  
  const audits = [
    { name: 'npm audit', command: 'npm audit --audit-level=moderate' },
    { name: 'Dependency check', command: 'npx audit-ci --moderate' }
  ];
  
  audits.forEach(({ name, command }) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        log(`⚠️  ${name} found issues`, 'yellow');
        console.log(stdout);
      } else {
        log(`✅ ${name} passed`, 'green');
      }
    });
  });
}

// Clean development environment
function cleanDev() {
  log('🧹 Cleaning development environment...', 'blue');
  
  const cleanTargets = [
    '.next',
    'node_modules/.cache',
    'out',
    '*.log'
  ];
  
  cleanTargets.forEach(target => {
    if (fs.existsSync(target)) {
      fs.rmSync(target, { recursive: true });
      log(`🗑️  Removed ${target}`, 'cyan');
    }
  });
  
  log('✅ Development environment cleaned', 'green');
}

// Show project stats
function showStats() {
  log('📊 Project Statistics', 'blue');
  
  const packageJson = require('../package.json');
  log(`Name: ${packageJson.name}`, 'cyan');
  log(`Version: ${packageJson.version}`, 'cyan');
  
  // Count files
  const srcPath = path.join(process.cwd(), 'src');
  const countFiles = (dir, ext) => {
    let count = 0;
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    files.forEach(file => {
      if (file.isDirectory()) {
        count += countFiles(path.join(dir, file.name), ext);
      } else if (file.name.endsWith(ext)) {
        count++;
      }
    });
    
    return count;
  };
  
  if (fs.existsSync(srcPath)) {
    log(`TypeScript files: ${countFiles(srcPath, '.ts') + countFiles(srcPath, '.tsx')}`, 'cyan');
    log(`Component files: ${countFiles(path.join(srcPath, 'components'), '.tsx')}`, 'cyan');
  }
  
  // Dependencies count
  const deps = Object.keys(packageJson.dependencies || {}).length;
  const devDeps = Object.keys(packageJson.devDependencies || {}).length;
  log(`Dependencies: ${deps} production, ${devDeps} development`, 'cyan');
}

// Main CLI
const command = process.argv[2];

switch (command) {
  case 'check':
  case 'health':
    checkEnvironment();
    checkDatabase();
    break;
    
  case 'key':
  case 'generate-key':
    generateEncryptionKey();
    break;
    
  case 'quality':
  case 'lint':
    runQualityChecks();
    break;
    
  case 'perf':
  case 'performance':
    performanceAudit();
    break;
    
  case 'security':
  case 'audit':
    securityAudit();
    break;
    
  case 'clean':
    cleanDev();
    break;
    
  case 'stats':
    showStats();
    break;
    
  default:
    log('🚀 Supauth Development Utilities', 'magenta');
    log('');
    log('Available commands:', 'blue');
    log('  check/health     - Check environment and database setup', 'cyan');
    log('  key/generate-key - Generate a new encryption key', 'cyan');
    log('  quality/lint     - Run code quality checks', 'cyan');
    log('  perf/performance - Run performance audit', 'cyan');
    log('  security/audit   - Run security audit', 'cyan');
    log('  clean            - Clean development environment', 'cyan');
    log('  stats            - Show project statistics', 'cyan');
    log('');
    log('Usage: node scripts/dev-utils.js <command>', 'yellow');
    break;
} 