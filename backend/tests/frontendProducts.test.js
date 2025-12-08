jest.setTimeout(30000);

const puppeteer = require('puppeteer');

describe('Frontend Product Display', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.goto('http://localhost:5500/index.html');
    });

    afterAll(async () => {
        await browser.close();
    });

    test('should display product list', async () => {
        await page.waitForSelector('#productList');
        const productCount = await page.evaluate(() => {
            return document.querySelectorAll('#productList .product-item').length;
        });
        expect(productCount).toBeGreaterThan(0);
    });

    test('should filter products by category', async () => {
        await page.select('#categoryFilter', 'Fruits');
        await page.click('#applyFilters');
        await page.waitForTimeout(1000); // wait for products to reload
        const productCount = await page.evaluate(() => {
            return document.querySelectorAll('#productList .product-item').length;
        });
        expect(productCount).toBeGreaterThan(0);
    });
});
