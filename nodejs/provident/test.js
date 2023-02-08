const puppeteer = require("puppeteer");
async function run() {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--enable-automation"],
  });
  const page = await browser.newPage();
  await page.goto(
    "https://www.providentestate.com/dubai-off-plan-properties.html"
  );
  const links = await page.evaluate(() => {
    let as = Array.from(document.querySelectorAll(".item-post__image"),a=>a.href);
    let uniqe = [...new Set(as)];
    return uniqe;
  });
  console.log(links);
  await browser.close();
}
run();
