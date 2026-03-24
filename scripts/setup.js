#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function divider() {
  log('═'.repeat(60), 'cyan');
}

async function checkSupabase(url) {
  return new Promise((resolve) => {
    log(`\n🔗 Checking Supabase connection...`, 'blue');
    const req = https.get(url, { timeout: 10000 }, (res) => {
      if (res.statusCode === 200) {
        log(`✅ Connected to Supabase successfully!`, 'green');
        resolve(true);
      } else {
        log(`⚠️  Supabase returned status: ${res.statusCode}`, 'yellow');
        resolve(false);
      }
    });
    req.on('error', (err) => {
      log(`❌ Failed to connect: ${err.message}`, 'red');
      resolve(false);
    });
    req.on('timeout', () => {
      log(`❌ Connection timeout`, 'red');
      req.destroy();
      resolve(false);
    });
  });
}

async function testApiEndpoint() {
  return new Promise((resolve) => {
    log(`\n🔗 Testing API endpoint...`, 'blue');
    const http = require('http');
    const req = http.get('http://localhost:3000/api/health', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.status === 'ok') {
            log(`✅ Backend API is running!`, 'green');
            log(`   Response: ${JSON.stringify(json)}`, 'cyan');
          } else {
            log(`⚠️  API returned unexpected response`, 'yellow');
          }
        } catch (e) {
          log(`⚠️  Could not parse response`, 'yellow');
        }
        resolve(true);
      });
    });
    req.on('error', () => {
      log(`⚠️  Backend not running yet (start with: cd backend && npm run dev)`, 'yellow');
      resolve(false);
    });
    req.setTimeout(3000, () => {
      log(`⚠️  Backend not responding`, 'yellow');
      req.destroy();
      resolve(false);
    });
  });
}

function printInstructions() {
  divider();
  log(`\n📋 NEXT STEPS:`, 'blue');
  divider();
  
  log(`
1. CREATE SUPABASE PROJECT
   → Go to: https://supabase.com
   → Sign up / Sign in
   → Click "New Project"
   → Name: caretaker-dev
   
2. GET CREDENTIALS
   → Settings → API
   → Copy: Project URL, anon public key, service_role secret

3. RUN MIGRATION
   → SQL Editor → New query
   → Paste from: backend/src/db/migrations/001_initial_schema.sql
   → Click "Run"

4. CONFIGURE ENVIRONMENT
   → Create backend/.env with your credentials
   → Create frontend/.env with your credentials

5. START SERVERS
   → cd backend && npm install && npm run dev
   → cd frontend && npm install && npm run dev
   
6. TEST
   → Open: http://localhost:5173
   → Register a new account
   → Book a caretaker!
  `, 'reset');
  
  divider();
}

async function main() {
  console.clear();
  divider();
  log(`
   ██████╗██╗   ██╗ ██████╗ ██████╗ ███████╗    ███████╗██╗      ██████╗  ██████╗ 
  ██╔════╝██║   ██║██╔═══██╗██╔══██╗██╔════╝    ██╔════╝██║     ██╔═══██╗██╔════╝ 
  ██║     ██║   ██║██║   ██║██║  ██║█████╗      █████╗  ██║     ██║   ██║██║  ███╗
  ██║     ╚██╗ ██╔╝██║   ██║██║  ██║██╔══╝      ██╔══╝  ██║     ██║   ██║██║   ██║
  ╚██████╗ ╚████╔╝ ╚██████╔╝██████╔╝███████╗    ███████╗███████╗╚██████╔╝╚██████╔╝
   ╚═════╝  ╚═══╝   ╚═════╝ ╚═════╝ ╚══════╝    ╚══════╝╚══════╝ ╚═════╝  ╚═════╝ 
  
  `, 'cyan');
  
  log(`  CareTaker App - Setup & Validation`, 'blue');
  divider();

  const supabaseUrl = process.env.SUPABASE_URL;
  if (supabaseUrl) {
    await checkSupabase(supabaseUrl);
  } else {
    log(`\n⚠️  SUPABASE_URL not set in .env`, 'yellow');
    log(`   Copy backend/.env.example to backend/.env and add your credentials`, 'yellow');
  }

  await testApiEndpoint();
  printInstructions();
}

main().catch(console.error);
