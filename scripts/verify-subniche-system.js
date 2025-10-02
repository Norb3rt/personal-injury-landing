/**
 * Verification Script for Subniche Pages System
 * 
 * This script verifies that the subniche pages system is properly configured
 * and ready for deployment.
 * 
 * Run with: node scripts/verify-subniche-system.js
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFileExists(filePath, description) {
  const fullPath = path.join(process.cwd(), filePath);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    log(`✅ ${description}: ${filePath}`, 'green');
    return true;
  } else {
    log(`❌ ${description}: ${filePath} NOT FOUND`, 'red');
    return false;
  }
}

function checkDirectoryExists(dirPath, description) {
  const fullPath = path.join(process.cwd(), dirPath);
  const exists = fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
  
  if (exists) {
    log(`✅ ${description}: ${dirPath}`, 'green');
    return true;
  } else {
    log(`❌ ${description}: ${dirPath} NOT FOUND`, 'red');
    return false;
  }
}

function checkFileContent(filePath, searchString, description) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    log(`❌ ${description}: File not found`, 'red');
    return false;
  }
  
  const content = fs.readFileSync(fullPath, 'utf8');
  const found = content.includes(searchString);
  
  if (found) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description}: Content not found`, 'red');
    return false;
  }
}

async function runVerification() {
  log('\n🔍 Starting Subniche Pages System Verification\n', 'cyan');
  
  let totalChecks = 0;
  let passedChecks = 0;
  
  // Check 1: Practice Areas Configuration
  log('\n📋 Checking Practice Areas Configuration...', 'blue');
  totalChecks++;
  if (checkFileExists('lib/data/practice-areas-config.ts', 'Practice areas config')) {
    passedChecks++;
    totalChecks++;
    if (checkFileContent('lib/data/practice-areas-config.ts', 'PRACTICE_AREAS', 'PRACTICE_AREAS array exists')) {
      passedChecks++;
    }
    totalChecks++;
    if (checkFileContent('lib/data/practice-areas-config.ts', 'car-accident', 'Car accident practice area defined')) {
      passedChecks++;
    }
  }
  
  // Check 2: Subniche Page Template
  log('\n📄 Checking Subniche Page Template...', 'blue');
  totalChecks++;
  if (checkDirectoryExists('app/[state]/[city]/[practice]', 'Practice directory')) {
    passedChecks++;
    totalChecks++;
    if (checkFileExists('app/[state]/[city]/[practice]/page.tsx', 'Practice page template')) {
      passedChecks++;
      totalChecks++;
      if (checkFileContent('app/[state]/[city]/[practice]/page.tsx', 'generateStaticParams', 'Static params generation')) {
        passedChecks++;
      }
      totalChecks++;
      if (checkFileContent('app/[state]/[city]/[practice]/page.tsx', 'getPracticeAreaBySlug', 'Practice area lookup')) {
        passedChecks++;
      }
    }
  }
  
  // Check 3: Modified City Page
  log('\n🏙️ Checking Modified City Page...', 'blue');
  totalChecks++;
  if (checkFileExists('app/[state]/[city]/page.tsx', 'City page')) {
    passedChecks++;
    totalChecks++;
    if (checkFileContent('app/[state]/[city]/page.tsx', 'slug:', 'Services have slug property')) {
      passedChecks++;
    }
    totalChecks++;
    if (checkFileContent('app/[state]/[city]/page.tsx', 'Learn More', 'Button text updated')) {
      passedChecks++;
    }
  }
  
  // Check 4: Sitemap System
  log('\n🗺️ Checking Sitemap System...', 'blue');
  totalChecks++;
  if (checkDirectoryExists('app/sitemap-index.xml', 'Sitemap index directory')) {
    passedChecks++;
    totalChecks++;
    if (checkFileExists('app/sitemap-index.xml/route.ts', 'Sitemap index route')) {
      passedChecks++;
    }
  }
  
  totalChecks++;
  if (checkDirectoryExists('app/sitemap-cities.xml', 'Cities sitemap directory')) {
    passedChecks++;
    totalChecks++;
    if (checkFileExists('app/sitemap-cities.xml/route.ts', 'Cities sitemap route')) {
      passedChecks++;
    }
  }
  
  totalChecks++;
  if (checkDirectoryExists('app/sitemap-subniches.xml', 'Subniches sitemap directory')) {
    passedChecks++;
    totalChecks++;
    if (checkFileExists('app/sitemap-subniches.xml/route.ts', 'Subniches sitemap route')) {
      passedChecks++;
    }
  }
  
  // Check 5: Robots.txt
  log('\n🤖 Checking Robots.txt...', 'blue');
  totalChecks++;
  if (checkFileExists('app/robots.txt', 'Robots.txt')) {
    passedChecks++;
    totalChecks++;
    if (checkFileContent('app/robots.txt', 'sitemap-index.xml', 'Sitemap index referenced')) {
      passedChecks++;
    }
    totalChecks++;
    if (checkFileContent('app/robots.txt', 'sitemap-cities.xml', 'Cities sitemap referenced')) {
      passedChecks++;
    }
    totalChecks++;
    if (checkFileContent('app/robots.txt', 'sitemap-subniches.xml', 'Subniches sitemap referenced')) {
      passedChecks++;
    }
  }
  
  // Check 6: Type System
  log('\n📐 Checking Type System...', 'blue');
  totalChecks++;
  if (checkFileExists('lib/types/location.types.ts', 'Location types')) {
    passedChecks++;
    totalChecks++;
    if (checkFileContent('lib/types/location.types.ts', 'practice?:', 'Practice field in SitemapEntry')) {
      passedChecks++;
    }
  }
  
  // Check 7: Documentation
  log('\n📚 Checking Documentation...', 'blue');
  totalChecks++;
  if (checkFileExists('SUBNICHE_SYSTEM.md', 'System documentation')) {
    passedChecks++;
  }
  totalChecks++;
  if (checkFileExists('IMPLEMENTATION_GUIDE.md', 'Implementation guide')) {
    passedChecks++;
  }
  
  // Summary
  log('\n' + '='.repeat(60), 'cyan');
  log('📊 VERIFICATION SUMMARY', 'cyan');
  log('='.repeat(60), 'cyan');
  
  const percentage = Math.round((passedChecks / totalChecks) * 100);
  const color = percentage === 100 ? 'green' : percentage >= 80 ? 'yellow' : 'red';
  
  log(`\nTotal Checks: ${totalChecks}`, 'blue');
  log(`Passed: ${passedChecks}`, 'green');
  log(`Failed: ${totalChecks - passedChecks}`, 'red');
  log(`Success Rate: ${percentage}%`, color);
  
  if (percentage === 100) {
    log('\n✅ All checks passed! System is ready for deployment.', 'green');
    log('\nNext steps:', 'cyan');
    log('1. Run: npm run build', 'yellow');
    log('2. Test locally: npm run start', 'yellow');
    log('3. Verify sitemaps at /sitemap-index.xml', 'yellow');
    log('4. Test sample URLs from IMPLEMENTATION_GUIDE.md', 'yellow');
  } else if (percentage >= 80) {
    log('\n⚠️ Most checks passed, but some issues found.', 'yellow');
    log('Review the failed checks above and fix any issues.', 'yellow');
  } else {
    log('\n❌ Multiple checks failed. Please review the errors above.', 'red');
    log('Refer to IMPLEMENTATION_GUIDE.md for setup instructions.', 'yellow');
  }
  
  log('\n' + '='.repeat(60) + '\n', 'cyan');
}

// Run verification
runVerification().catch(error => {
  log(`\n❌ Verification script error: ${error.message}`, 'red');
  process.exit(1);
});

