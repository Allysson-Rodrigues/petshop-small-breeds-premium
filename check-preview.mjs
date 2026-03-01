import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', error => console.error('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.error('REQUEST FAILED:', request.url(), request.failure()?.errorText));

  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });

  const rootHtml = await page.innerHTML('#root');
  console.log('Root HTML:', rootHtml);

  await browser.close();
})();
