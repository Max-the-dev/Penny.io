'use strict';

/**
 * Simple CLI utility to exercise the API rate limiters defined in backend/src/routes.ts.
 *
 * Usage:
 *   node backend/scripts/testRateLimits.js <read|write|critical|upload> [--limit=N] [--base-url=http://localhost:3001/api]
 *
 * Notes:
 * - Start the backend with 'NODE_ENV=production npm --prefix backend run dev' so the limiters are enabled.
 * - The script fires (limit + 5) sequential requests to the chosen endpoint until it observes HTTP 429.
 * - Override --limit if you temporarily changed the limiter thresholds in code.
 */

const { argv, env } = process;
const { randomUUID } = require('crypto');

if (typeof fetch === 'undefined') {
  // Lazy-load node-fetch for Node versions < 18.
  globalThis.fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));
}

const DEFAULT_BASE_URL = env.API_BASE_URL || 'http://localhost:3001/api';
const DEFAULT_ADDRESS =
  env.RATE_LIMIT_TEST_ADDRESS || '0x1111111111111111111111111111111111111111';

const TARGETS = {
  read: {
    label: 'General read limiter',
    defaultLimit: 100,
    message: 'Too many requests from this IP, please try again later.',
    async request({ baseUrl }) {
      const url = `${baseUrl}/articles?authorAddress=${DEFAULT_ADDRESS}`;
      return fetch(url);
    }
  },
  write: {
    label: 'Write limiter',
    defaultLimit: 20,
    message: 'Too many write requests. Please slow down and try again later.',
    async request({ baseUrl, iteration }) {
      const url = `${baseUrl}/articles/validate`;
      const body = {
        title: `Rate limit probe ${iteration} ${Date.now()}`,
        content: generateTestContent(iteration),
        price: 0.1,
        authorAddress: DEFAULT_ADDRESS,
        categories: ['Technology']
      };
      return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    }
  },
  critical: {
    label: 'Critical limiter',
    defaultLimit: 10,
    message: 'Too many attempts. Please wait before trying again.',
    async request({ baseUrl }) {
      const url = `${baseUrl}/articles/recalculate-popularity`;
      return fetch(url, { method: 'POST' });
    }
  },
  upload: {
    label: 'Upload limiter',
    defaultLimit: 30,
    message: 'Too many upload requests. Please wait before uploading more files.',
    async request({ baseUrl, iteration }) {
      const url = `${baseUrl}/upload`;
      const form = createUploadForm(iteration);
      return fetch(url, { method: 'POST', body: form });
    }
  }
};

async function main() {
  const { target, limit, baseUrl } = parseArgs(argv.slice(2));

  if (!target) {
    printUsage();
    process.exit(1);
  }

  if (!TARGETS[target]) {
    console.error(`Unknown target "${target}".`);
    printUsage();
    process.exit(1);
  }

  const config = TARGETS[target];
  const attempts = (limit || config.defaultLimit) + 5;

  console.log(`→ Testing ${config.label}`);
  console.log(`   Base URL: ${baseUrl}`);
  console.log(`   Planned requests: ${attempts}`);
  if (env.NODE_ENV !== 'production') {
    console.warn(
      '⚠️  NODE_ENV is not "production"; the limiter may be disabled (skip() returns true).'
    );
  }

  let saw429 = false;

  for (let i = 0; i < attempts; i += 1) {
    const iteration = i + 1;
    try {
      const response = await config.request({ baseUrl, iteration });
      const { status } = response;
      const statusText = response.statusText || '';
      process.stdout.write(
        `   #${iteration}: ${status}${statusText ? ` ${statusText}` : ''}\n`
      );

      if (status === 429) {
        saw429 = true;
        const body = await safeReadBody(response);
        console.log('   ↳ Rate limit response body:', body);
        break;
      }

      if (status >= 400) {
        const body = await safeReadBody(response);
        console.log('   ↳ Error body:', body);
      }
    } catch (error) {
      console.error(`   ! Request ${iteration} failed:`, error);
    }
  }

  if (saw429) {
    console.log('✅ Rate limiter responded with 429 as expected.');
  } else {
    console.warn(
      '⚠️  Did not observe a 429 response. Ensure the backend is running in production mode and the limit value matches the server configuration.'
    );
  }
}

function parseArgs(args) {
  let target = null;
  let limit = null;
  let baseUrl = DEFAULT_BASE_URL;

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (!target && !arg.startsWith('--')) {
      target = arg;
      continue;
    }

    if (arg.startsWith('--limit=')) {
      limit = Number(arg.split('=')[1]);
    } else if (arg === '--limit') {
      limit = Number(args[i + 1]);
      i += 1;
    } else if (arg.startsWith('--base-url=')) {
      baseUrl = arg.split('=')[1];
    } else if (arg === '--base-url') {
      baseUrl = args[i + 1];
      i += 1;
    } else if (arg === '--help' || arg === '-h') {
      return {};
    }
  }

  return { target, limit, baseUrl };
}

function printUsage() {
  console.log(`
Rate limit test helper
----------------------
Usage:
  node backend/scripts/testRateLimits.js <target> [--limit=N] [--base-url=URL]

Targets:
  read      → GET /articles (general read limiter, default max 100)
  write     → POST /articles/validate (write limiter, default max 20)
  critical  → POST /articles/recalculate-popularity (critical limiter, default max 10)
  upload    → POST /upload (upload limiter, default max 30)

Examples:
  NODE_ENV=production npm --prefix backend run dev
  node backend/scripts/testRateLimits.js read
  node backend/scripts/testRateLimits.js write --limit=5
  node backend/scripts/testRateLimits.js upload --base-url=http://127.0.0.1:3001/api
`);
}

function generateTestContent(iteration) {
  const words = [];
  for (let i = 0; i < 60; i += 1) {
    words.push(`word${iteration}_${i}`);
  }
  return words.join(' ');
}

async function safeReadBody(response) {
  try {
    const text = await response.text();
    return text ? text.slice(0, 500) : '<empty>';
  } catch (error) {
    return `<failed to read body: ${error.message}>`;
  }
}

main().catch((error) => {
  console.error('Unexpected error while running rate limit test:', error);
  process.exit(1);
});

function createUploadForm(iteration) {
  const filename = `rate-limit-test-${randomUUID()}.txt`;
  const content = `rate-limit-test-${iteration}-${Date.now()}`;

  if (typeof FormData !== 'undefined' && typeof Blob !== 'undefined') {
    const form = new FormData();
    form.append('file', new Blob([content], { type: 'text/plain' }), filename);
    return form;
  }

  try {
    // Lazy load for Node versions without native FormData/Blob.
    // eslint-disable-next-line global-require
    const FormDataLib = require('form-data');
    const form = new FormDataLib();
    form.append('file', Buffer.from(content), {
      filename,
      contentType: 'text/plain'
    });
    return form;
  } catch (error) {
    throw new Error(
      'FormData/Blob not available. Install the "form-data" package or run on Node >= 18.'
    );
  }
}
