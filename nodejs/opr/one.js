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
    "https://opr.ae/projects/emaar-mina-rashid-yacht-marina-seascape-apartments-in-dubai"
  );
  const links = await page.evaluate(() => {
    let aaa = [];
    // .node.section-clear.section div.container.fullwidth div.cont div.node.widget-tabs.cr-tabs.widget div.metahtml div.tabs1-container.swiper-container.swiper-container-horizontal.swiper-container-autoheight div.tabs1-root div.swiper-wrapper div.swiper-slide
    let floor_plans = Array.from(
      document.querySelectorAll("#fp .swiper-slide p a .fr-dib.fr-draggable")
    );
    floor_plans.forEach((e) => {
      aaa.push(e.src);
    });

    return {
      floor_plans: aaa,
      s: floor_plans.length,
    };
  });
  console.log(links);

  await browser.close();
}
run();
