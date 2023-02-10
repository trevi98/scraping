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
    "https://www.hausandhaus.com/new-developments-details/studios-and-1-2-bedroom-apartments-for-sale-in-belmont-residences-by-ellington-properties/54687"
  );
  const links = await page.evaluate(() => {
    let title = document.querySelector(
      "div.intro-content div.titile"
    ).textContent;
    let overview = "";
    try {
      overview = document.querySelector(
        "div.main section.section-developments-details div.section-body section.section-header div.container header p.lead"
      ).textContent;
    } catch (error) {
      overview = "";
    }
    let brochure = "";
    try {
      brochure = document.querySelector(
        "div.main section.section-developments-details div.section-body section.section-header div.container header div.btn-group a"
      ).href;
    } catch (error) {
      brochure = "";
    }
    return {
      title: title,
      overview: overview,
      brochure: brochure,
    };
  });
  console.log(links);

  await browser.close();
}
run();
