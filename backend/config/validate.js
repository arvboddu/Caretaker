#!/usr/bin/env node

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const https = require('https');
const http = require('http');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkUrl(url, name) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, { timeout: 5000 }, (res) => {
      if (res.statusCode === 200) {
        log(`✅ ${name}: ${url}`, 'green');
        resolve(true);
      } else {
        log(`⚠️  ${name}: Status ${res.statusCode}`, 'yellow');
        resolve(false);
      }
    });
    req.on('error', (err) => {
      log(`❌ ${name}: ${err.message}`, 'red');
      resolve(false);
    });
    req.on('timeout', () => {
      log(`❌ ${name}: Timeout`, 'red');
      req.destroy();
      resolve(false);
    });
  });
}

async function validateEnv() {
  log('\n🔍 Validating CareTaker Setup...\n', 'blue');

  let allPassed = true;

  log('📋 Environment Variables:', 'blue');
  
  const envVars = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'JWT_SECRET',
    'CLIENT_URL'
  ];

  for (const varName of envVars) {
    const value = process.env[varName];
    if (value) {
      if (varName.includes('KEY') && value.length > 20) {
        log(`✅ ${varName}: [SET - ${value.substring(0, 10)}...]`, 'green');
      } else {
        log(`✅ ${varName}: ${value}`, 'green');
      }
    } else {
      log(`❌ ${varName}: [NOT SET]`, 'red');
      allPassed = false;
    }
  }

  log('\n🌐 Testing URLs:', 'blue');
  
  if (process.env.SUPABASE_URL) {
    await checkUrl(process.env.SUPABASE_URL, 'Supabase');
    await checkUrl(`${process.env.SUPABASE_URL}/rest/v1/`, 'Supabase REST API');
  }

  if (process.env.CLIENT_URL) {
    await checkUrl(process.env.CLIENT_URL, 'Frontend');
  }

  log('\n📊 Validation Summary:', 'blue');
  
  if (allPassed) {
    log('✅ All environment variables are set!', 'green');
    log('\n🚀 Next Steps:', 'blue');
    log('1. Run: npm run dev', 'reset');
    log('2. Test API: curl http://localhost:3000/api/health', 'reset');
    log('3. Open: http://localhost:5173', 'reset');
  } else {
    log('❌ Some environment variables are missing!', 'red');
    log('Please check your .env file in the backend folder.', 'yellow');
  }

  log('', 'reset');
}

validateEnv().catch(console.error);
