const puppeteer = require("puppeteer");
async function run() {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--enable-automation"],
  });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(80000);
  await page.goto(
    "https://www.binayah.com/apartment/sale/downtown-dubai/dubai/boulevard-point-apartment-for-sale-in-downtown-dubai-1-bedroom/"
  );
  const links = await page.evaluate(() => {
    let title = "";
    try {
      title = document.title;
    } catch (error) {}

    return {
      title: title,
    };
  });
  console.log(links);

  await browser.close();
}
run();
