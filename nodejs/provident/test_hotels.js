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
  await page.goto("https://www.providentestate.com/buy-hotels-in-dubai.html");
  const links = await page.evaluate(() => {
    let content = Array.from(
      document.querySelectorAll(
        "div.wpb_column.vc_column_container.vc_col-sm-4 div.vc_column-inner div.wpb_wrapper"
      )
    );
    let cover_image = "";
    let title = "";
    let start = "";
    let price = "";

    content.forEach((e) => {
      cover_image = e.querySelector(
        "div.wpb_single_image.wpb_content_element.vc_align_left figure img"
      ).src;
      title = e.querySelector("h4").textContent;
      start = e.querySelector("p").textContent.split("Hotel")[0];
      price = e.querySelector("p").textContent.split("Hotel")[1];
    });
    return {
      title: title,
      cover_image: cover_image,
      start: start,
      price: price,
    };
  });
  console.log(links);

  await browser.close();
}
run();
