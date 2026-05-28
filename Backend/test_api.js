const http = require('http');

const API_URL = 'http://localhost:5000';

async function runTests() {
  console.log('🧪 Starting API Health Tests...');
  let passed = 0;
  let total = 0;

  const tests = [
    { name: 'GET /api/health', path: '/api/health', method: 'GET' },
    { name: 'GET /api/products', path: '/api/products', method: 'GET' },
    { name: 'GET /api/products/1', path: '/api/products/1', method: 'GET' },
    { name: 'GET /api/cart', path: '/api/cart', method: 'GET' },
    { name: 'POST /api/cart/add', path: '/api/cart/add', method: 'POST', body: { productId: 1, quantity: 2 }, expectedStatus: 201 },
    { name: 'GET /api/admin/stats', path: '/api/admin/stats', method: 'GET' }
  ];
  for (const test of tests) {
    total++;
    try {
      const res = await makeRequest(test);
      const expected = test.expectedStatus || 200;
      if (res.statusCode === expected) {
        console.log(`✅ ${test.name} - Passed`);
        passed++;
      } else {
        console.log(`❌ ${test.name} - Failed (Expected ${expected}, got ${res.statusCode})`);
      }
    } catch (error) {
      console.log(`❌ ${test.name} - Failed (Error: ${error.message})`);
    }
  }

  const accuracy = (passed / total) * 100;
  console.log('\n====================================');
  console.log(`📊 Test Results: ${passed}/${total} tests passed`);
  console.log(`📈 Webapp Accuracy Score: ${accuracy.toFixed(2)}%`);
  console.log('====================================\n');
}

function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const reqOptions = {
      hostname: 'localhost',
      port: 5000,
      path: options.path,
      method: options.method,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    });

    req.on('error', (err) => reject(err));
    if (options.body) req.write(JSON.stringify(options.body));
    req.end();
  });
}

runTests();
