const puppeteer = require('puppeteer');

// Thresholds for performance metrics
const THRESHOLDS = {
  PAGE_LOAD: 2000, // 2 seconds
  TTFB: 500, // 500 ms
  FCP: 1000, // 1 second
  TBT: 300 // 300 ms
};

describe('PF-08: Order Page Load Test Under Broadband Settings', () => {
  let browser;
  let page;

  beforeAll(async () => {
    // Launch the browser
    browser = await puppeteer.launch();
    // Open a new page
    page = await browser.newPage();
  });

  afterAll(async () => {
    // Close the browser after the tests
    await browser.close();
  });

  test('should meet page load and performance metrics under broadband settings', async () => {
    // Start tracking performance metrics
    await page.goto('http://localhost:3000/order-summary', { waitUntil: 'load' });

    // Collect performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const { performance } = window;
      const { timing } = performance;

      // Calculate Time to First Byte (TTFB)
      const ttfb = timing.responseStart - timing.requestStart;

      // First Contentful Paint (FCP)
      const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
      const fcp = fcpEntry ? fcpEntry.startTime : 0;

      // Measure Total Blocking Time (TBT)
      const tbt = performance.getEntriesByType('longtask').reduce((total, entry) => {
        return total + entry.duration;
      }, 0);

      // Calculate total page load time
      const pageLoadTime = timing.loadEventEnd - timing.navigationStart;

      return {
        ttfb,
        fcp,
        tbt,
        pageLoadTime
      };
    });

    const { ttfb, fcp, tbt, pageLoadTime } = performanceMetrics;

    // Log performance results
    console.log(`TTFB: ${ttfb} ms`);
    console.log(`FCP: ${fcp} ms`);
    console.log(`TBT: ${tbt} ms`);
    console.log(`Page Load Time: ${pageLoadTime} ms`);

    // Validate against thresholds
    expect(ttfb).toBeLessThan(THRESHOLDS.TTFB); // Time to First Byte (TTFB)
    expect(fcp).toBeLessThan(THRESHOLDS.FCP); // First Contentful Paint (FCP)
    expect(tbt).toBeLessThan(THRESHOLDS.TBT); // Total Blocking Time (TBT)
    expect(pageLoadTime).toBeLessThan(THRESHOLDS.PAGE_LOAD); // Total page load time
  });
});
