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
  await page.goto("https://opr.ae/video-overviews");
  const links = await page.evaluate(() => {
    let video = Array.from(
      document.querySelectorAll("div.s-elements-cell iframe")
    );
    let s = [];
    video.forEach((e) => s.push(e.src));
    return {
      video: s,
    };
  });
  console.log(links);
  await browser.close();
}
run();
