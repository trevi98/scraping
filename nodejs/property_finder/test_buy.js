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
    "https://www.propertyfinder.ae/en/plp/buy/villa-for-sale-dubai-arabian-ranches-alma-alma-1-9418024.html"
  );
  let images = [];
  await page.waitForSelector;
  const exist = await page.evaluate(() => {
    return (
      document.querySelector(
        ".property-page__gallery-button-area > .button-2.button-floating.button-floating--shadow.property-page__gallery-button"
      ) !== null
    );
  });
  if (exist) {
    let number = await page.evaluate(() => {
      let number = document.querySelector(
        ".property-page__gallery-button-area > .button-2.button-floating.button-floating--shadow.property-page__gallery-button"
      ).textContent;
      return number.match(/(\d+)/)[0];
    });
    await page.click(
      ".property-page__gallery-button-area > .button-2.button-floating.button-floating--shadow.property-page__gallery-button"
    );

    for (let i = 0; i < number + 1; i++) {
      await page.evaluate(() =>
        document.querySelector(".gallery__item").click()
      );
    }
    images = await page.evaluate(() => {
      let temp = Array.from(document.querySelectorAll(".gallery__item img "));
      let imgs = [];
      temp.forEach((e) => {
        imgs.push(e.src);
      });
      return imgs;
    });
  }

  console.log(images);
  console.log(images.length);
  console.log([...new Set(images)]);
  console.log([...new Set(images)].length);

  await browser.close();
}
run();
