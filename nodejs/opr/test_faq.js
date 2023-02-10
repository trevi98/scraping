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
  await page.goto("https://opr.ae/faq/how-much-does-it-cost-to-live-in-dubai");
  const links = await page.evaluate(() => {
    let qeustion = document.querySelector(
      "div#header-menu-mobile ~ div.node.section-clear.section.menu2 div.node.widget-text.cr-text.widget.lg-hidden p.textable"
    ).textContent;

    let answer = document.querySelector(
      "div.node.widget-text.cr-text.widget.links-on-black-text p"
    ).textContent;

    return {
      qeustion: qeustion,
      answer: answer,
    };
  });
  console.log(links);
  await browser.close();
}
run();
