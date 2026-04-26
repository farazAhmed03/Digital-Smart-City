import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd());
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const checks = [];
const check = (name, fn) => checks.push({ name, fn });

check('backend package has required production scripts', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.type, 'module');
  assert.ok(pkg.scripts.start, 'start script is required for PM2/deployment');
  assert.ok(pkg.dependencies.express, 'express dependency is required');
  assert.ok(pkg.dependencies.mongoose, 'mongoose dependency is required');
});

check('admin and user authentication routes are registered', () => {
  const routes = read('Router/Auth/auth.routes.js');
  assert.match(routes, /post\(["']\/SuperAdminLogin["']/);
  assert.match(routes, /post\(["']\/SuperAdminLogout["']/);
  assert.match(routes, /post\(["']\/user\/login["']/);
  assert.match(routes, /post\(["']\/user\/logout["']/);
});

check('server enables key middleware for production API behavior', () => {
  const index = read('index.js');
  assert.match(index, /cors\(/, 'CORS middleware should be configured');
  assert.match(index, /cookieParser\(\)/, 'cookie parser should be enabled');
  assert.match(index, /generalLimiter/, 'rate limiter should be enabled');
  assert.match(index, /express\.json\(/, 'JSON body parser should be enabled');
});

check('secrets are not committed in backend folder', () => {
  const forbidden = ['.env', '.env.local', '.env.production'];
  for (const file of forbidden) {
    assert.equal(fs.existsSync(path.join(root, file)), false, `${file} must not be committed`);
  }
});

let failed = 0;
for (const { name, fn } of checks) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL ${name}`);
    console.error(error.message);
  }
}

if (failed > 0) {
  process.exit(1);
}
console.log(`All ${checks.length} backend CI checks passed.`);
