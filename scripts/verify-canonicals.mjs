import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3000';

// List of URLs to check
const urlsToCheck = [
    '/',
    '/privacy-policy',
    '/terms-of-service',
    '/personal-injury-lawyer/california/los-angeles',
    '/personal-injury-lawyer/california/san-diego',
    '/personal-injury-lawyer/california/los-angeles/car-accident-lawyer',
];

async function fetchAndParse(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) {
            return { url, error: `Failed to fetch: ${res.status} ${res.statusText}` };
        }
        const html = await res.text();

        // Simple regex to find canonical tag
        // <link rel="canonical" href="..." /> or <link href="..." rel="canonical" />
        const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*>/i);

        if (!canonicalMatch) {
            return { url, canonical: null, error: 'No canonical tag found' };
        }

        const tag = canonicalMatch[0];
        const hrefMatch = tag.match(/href=["']([^"']*)["']/i);

        if (!hrefMatch) {
            return { url, canonical: null, error: 'Canonical tag found but no href' };
        }

        return { url, canonical: hrefMatch[1], error: null };
    } catch (err) {
        return { url, error: err.message };
    }
}

async function run() {
    console.log('Starting Canonical Tag Verification...');
    console.log(`Base URL: ${BASE_URL}\n`);

    const results = [];

    for (const path of urlsToCheck) {
        const fullUrl = `${BASE_URL}${path}`;
        const result = await fetchAndParse(fullUrl);
        results.push(result);
    }

    console.log('--- Results ---');
    let hasErrors = false;

    results.forEach(r => {
        if (r.error) {
            console.error(`[FAIL] ${r.url}: ${r.error}`);
            hasErrors = true;
        } else {
            // Check if canonical matches expected logic
            // We expect canonicals to be absolute URLs matching the production domain or the configured domain
            // Since we are running locally, it might show localhost or the production domain depending on env vars.
            // Based on previous file reads, it should be 'https://personalinjury.lawproactive.com' + path

            const expectedDomain = 'https://personalinjury.lawproactive.com';
            // Handle homepage redirect case if necessary, but here we are checking the fetched content.
            // If homepage redirects, fetch follows it by default usually.

            // Construct expected canonical
            let expectedPath = r.url.replace(BASE_URL, '');
            if (expectedPath === '/') expectedPath = ''; // Homepage often has no path or just /

            // Special handling: The user wants to ensure specific pages have specific canonicals.
            // We need to see what the actual output is to verify correctness.

            console.log(`[OK] ${r.url}`);
            console.log(`     Found: ${r.canonical}`);
        }
    });

    if (hasErrors) {
        console.log('\nVerification FAILED with errors.');
        process.exit(1);
    } else {
        console.log('\nVerification COMPLETED.');
    }
}

run();
