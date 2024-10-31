const puppeteer = require('puppeteer');

const THRESHOLDS = {
  PAGE_LOAD: 2000, // 2 seconds
  TTFB: 500, // 500 ms
  FCP: 1000, // 1 second
  TBT: 300 // 300 ms
};

describe('PF-06: Component Page Load Test Under Broadband Settings', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('should meet page load and performance metrics', async () => {
    // Start tracking performance metrics
    await page.goto('http://localhost:3000', { waitUntil: 'load' });

    // Collect performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const { performance } = window;
      const { timing } = performance;

      // Calculate Time to First Byte (TTFB)
      const ttfb = timing.responseStart - timing.requestStart;

      // First Contentful Paint (FCP) and Total Blocking Time (TBT) via `performance.getEntriesByType()`
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
