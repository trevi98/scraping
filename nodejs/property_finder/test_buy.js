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
    "https://www.propertyfinder.ae/en/plp/buy/apartment-for-sale-dubai-al-barsha-al-barsha-south-maisan-residence-towers-9401742.html"
  );
  let images = [];
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
    images.push(
      await page.evaluate(
        () =>
          document.querySelector(".gallery__img.progressive-image--loaded").src
      )
    );
    // let temp=Array.from(document.querySelectorAll(""))
    for (let i = 1; i < number + 1; i++) {
      await page.waitForTimeout(10000);
      await page.evaluate(() =>
        document.querySelectorAll(".modal-gallery__thumbnail-item")[i].click()
      );
      images.push(
        await page.evaluate(
          () =>
            document.querySelectorAll(
              ".gallery__img.progressive-image--loaded"
            )[i].src
        )
      );
    }
  }

  console.log(images);

  await browser.close();
}
run();
