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
  const floor = await page.evaluate(() => {
    // .node.section-clear.section div.container.fullwidth div.cont div.node.widget-tabs.cr-tabs.widget div.metahtml div.tabs1-container.swiper-container.swiper-container-horizontal.swiper-container-autoheight div.tabs1-root div.swiper-wrapper div.swiper-slide
    let number = Array.from(document.querySelectorAll("#fp .tabs1-page"));
    let f = [];
    for (let i = 0; i < number.length; i++) {
      number[i].id = `h${i + 1}`;
      f.push(`h${i + 1}`);
    }
    return f;
  });
  // console.log(links.length);
  let floor_plans = [];
  if (floor.length > 0) {
    for (let f of floor) {
      await page.click(`#${f}`);
      console.log(f);
      floor_plans.push(
        await page.evaluate(() => {
          let size = "";
          let img = "";
          let title = "";
          try {
            size = document.querySelector(
              "#fp .swiper-slide.swiper-slide-active .node.widget-text.cr-text.widget + .node.widget-text.cr-text.widget p"
            ).textContent;
          } catch (error) {}

          try {
            img = document.querySelector(
              "#fp .swiper-slide.swiper-slide-active a .fr-dib.fr-draggable"
            ).src;
          } catch (error) {}
          try {
            title = document.querySelector(
              "#fp .swiper-slide.swiper-slide-active h3"
            ).textContent;
          } catch (error) {}
          return {
            title: title,
            size: size,
            img: img,
          };
        })
      );
    }
  }
  console.log(floor_plans);
  await browser.close();
}
run();
