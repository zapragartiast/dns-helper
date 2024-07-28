const puppeteer = require('puppeteer-extra');

async function scrape(url) {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: [
                '--disable-dev-shm-usage',
                '--no-sandbox',
                '--disable-features=site-per-process',
                '--mute-audio',
                '--incognito'
            ],
        });
        let page = (await browser.pages())[0];
        const client = await page.target().createCDPSession();
        const { windowId } = await client.send('Browser.getWindowForTarget');
        await client.send('Browser.setWindowBounds', {
            windowId,
            bounds: { windowState: 'minimized' }
        });
        await page.goto(url, {
            waitUntil: 'networkidle2'
        });
        await page.waitForFunction(() => document.readyState === 'complete');

        const results = await page.waitForSelector('.SearchResult > a > strong', {
            timeout: 1000,
            visible: true
        }).catch(() => null);
        
        var dataResult = '';
        if(results) {
            const resultSelector = await page.$$('.SearchResult > a > strong');
            const resultData = await Promise.all(resultSelector.map(item => item.evaluate(node => node.textContent.trim()))).then(values => values.join("\n"));
            dataResult += resultData;
        } else {
            const limit = await page.waitForSelector('h2.title.product', {
                timeout: 1000,
                visible: true
            }).catch(() => null);
            if(limit) {
                dataResult = 'limit';
            } else {
                dataResult = 'nothing';
            }            
        }
        return dataResult;
    } catch (error) {
        console.error('Error:', error);
        return null;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

module.exports = {
    scrape
};