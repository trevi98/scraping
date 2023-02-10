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
    "https://opr.ae/blog/minimum-income-to-buy-property-in-dubai"
  );
  const links = await page.evaluate(() => {
    let price_payment = [];
    let temp = Array.from(document.querySelectorAll("h2"));
    temp.forEach((e) => price_payment.push(e.textContent));
    let des = [];
    temp = Array.from(
      document.querySelectorAll(
        "div.node.widget-text.cr-text.widget.links-on-black-text p"
      )
    );
    temp.forEach((e) => {
      des.push(e.textContent);
    });
    let list = [];
    temp = Array.from(
      document.querySelectorAll("div.node.widget-list.widget ul li")
    );
    temp.forEach((e) => {
      list.push(e.textContent);
    });
    return {
      price_payment: price_payment,
      des: des,
      list: list,
    };
  });
  console.log(links);
  await browser.close();
}
run();
