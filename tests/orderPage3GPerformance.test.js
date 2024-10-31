const puppeteer = require('puppeteer');

// Manual network conditions for Slow 3G
const NETWORK_CONDITIONS = {
  offline: false,
  downloadThroughput: (500 * 1024) / 8, // Approx. 500 kbps
  uploadThroughput: (500 * 1024) / 8, // Approx. 500 kbps
  latency: 400 // Latency of 400ms (typical for slow 3G)
};

const THRESHOLDS = {
  PAGE_LOAD: 5000, // 5 seconds
  TTFB: 1000, // 1 second
  TBT: 500 // 500 ms
};

describe('PF-09: Order Page Load Test Under Poor Network Conditions (3G)', () => {
  let browser;
  let page;

  beforeAll(async () => {
    // Launch the browser
    browser = await puppeteer.launch();
    // Open a new page
    page = await browser.newPage();

    // Emulate Slow 3G network conditions manually
    const client = await page.target().createCDPSession();
    await client.send('Network.emulateNetworkConditions', NETWORK_CONDITIONS);
  });

  afterAll(async () => {
    // Close the browser after the tests
    await browser.close();
  });

  test('should meet page load and performance metrics under 3G conditions', async () => {
    // Start tracking performance metrics
    await page.goto('http://localhost:3000/order-summary', { waitUntil: 'load' });

    // Collect performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const { performance } = window;
      const { timing } = performance;

      // Calculate Time to First Byte (TTFB)
      const ttfb = timing.responseStart - timing.requestStart;

      // Measure Total Blocking Time (TBT)
      const tbt = performance.getEntriesByType('longtask').reduce((total, entry) => {
        return total + entry.duration;
      }, 0);

      // Calculate total page load time
      const pageLoadTime = timing.loadEventEnd - timing.navigationStart;

      return {
        ttfb,
        tbt,
        pageLoadTime
      };
    });

    const { ttfb, tbt, pageLoadTime } = performanceMetrics;

    // Log performance results
    console.log(`TTFB: ${ttfb} ms`);
    console.log(`TBT: ${tbt} ms`);
    console.log(`Page Load Time: ${pageLoadTime} ms`);

    // Validate against thresholds
    expect(ttfb).toBeLessThan(THRESHOLDS.TTFB); // Time to First Byte (TTFB)
    expect(tbt).toBeLessThan(THRESHOLDS.TBT); // Total Blocking Time (TBT)
    expect(pageLoadTime).toBeLessThan(THRESHOLDS.PAGE_LOAD); // Total page load time
  });
});
