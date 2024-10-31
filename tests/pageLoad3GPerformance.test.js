const puppeteer = require('puppeteer');

// Manually define network conditions for Fast 3G
const NETWORK_CONDITIONS = {
  offline: false,
  downloadThroughput: (1.6 * 1024 * 1024) / 8, // Approx. 1.6 Mbps download
  uploadThroughput: (750 * 1024) / 8, // Approx. 750 kbps upload
  latency: 150 // Latency of 150 ms (typical for fast 3G)
};

const THRESHOLDS = {
  PAGE_LOAD: 5000, // 5 seconds
  TTFB: 1000, // 1 second
  TBT: 500 // 500 ms
};

describe('PF-07: Component Page Load Test Under Poor Network Conditions (3G)', () => {
  let browser;
  let page;

  beforeAll(async () => {
    // Launch the browser
    browser = await puppeteer.launch();
    // Open a new page
    page = await browser.newPage();

    // Emulate 3G network conditions using CDP session
    const client = await page.target().createCDPSession();
    await client.send('Network.emulateNetworkConditions', {
      offline: NETWORK_CONDITIONS.offline,
      downloadThroughput: NETWORK_CONDITIONS.downloadThroughput,
      uploadThroughput: NETWORK_CONDITIONS.uploadThroughput,
      latency: NETWORK_CONDITIONS.latency,
    });
  });

  afterAll(async () => {
    // Close the browser after the tests
    await browser.close();
  });

  test('should meet page load and performance metrics under 3G conditions', async () => {
    // Start tracking performance metrics
    await page.goto('http://localhost:3000', { waitUntil: 'load' });
  
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
  }, 15000); // Set the timeout to 15 seconds  
});
