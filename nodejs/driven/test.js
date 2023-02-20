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
    "https://www.drivenproperties.com/dubai/office-for-sale/jumeirah-lake-towers/hds-business-centre/dp-s-41168"
  );
  const links = await page.evaluate(() => {
    function clean(text) {
      try {
        return text
          .replaceAll("\n", "")
          .replaceAll("\r", "")
          .replaceAll("\t", "")
          .replaceAll("  ", "")
          .trim();
      } catch (error) {
        return text;
      }
    }

    let title = "";
    try {
      title = clean(document.querySelector("h2.dpx-headings").textContent);
    } catch (error) {}
    let type = "";
    let location = "";
    try {
      type = clean(
        document
          .querySelector(".dpx-headings-2.dpx-headings-2j")
          .textContent.split(" ")[0]
      );
    } catch (error) {}
    try {
      location = clean(
        document
          .querySelector(".dpx-headings-2.dpx-headings-2j")
          .textContent.split("in")
          .slice(1)
          .join("")
      );
    } catch (error) {}
    let images = [];
    let temp = Array.from(document.querySelectorAll(".carousel-inner img"));
    temp.forEach((e) => {
      try {
        images.push(e.src);
      } catch (error) {}
    });
    images = [...new Set(images)];
    let developer = "";
    try {
      developer = clean(
        document.querySelector(".dpx-aside-box-content h3").textContent
      );
    } catch (error) {}
    temp = Array.from(
      document.querySelectorAll(
        ".nav.nav-pills.nav-justified.dpx-listings-detail-facts .nav-item "
      )
    );
    let price = "";
    let Bedrooms = "";
    let Bathrooms = "";
    let Area = "";
    temp.forEach((e) => {
      let value = clean(e.querySelector("div").textContent);
      if (/aed/i.test(value)) {
        price = value;
      }
      if (/bed/i.test(value)) {
        Bedrooms = value;
      }
      if (/bath/i.test(value)) {
        Bathrooms = value;
      }
      if (/sq/i.test(value)) {
        Area = value;
      }
    });
    let reference = "";
    try {
      reference = clean(
        document.querySelector(".dpx-headings-2i strong").textContent
      );
    } catch (error) {}
    let property_overview = [];
    temp = Array.from(
      document.querySelectorAll(
        ".dpx-content-block.dpx-listings-detail-overview span"
      )
    );
    temp.forEach((e) => {
      try {
        property_overview.push(clean(e.textContent));
      } catch (error) {}
    });
    let description = "";
    try {
      description = clean(
        document.querySelector(".dpx-listings-detail-content").textContent
      );
    } catch (error) {}
    return {
      title: title,
      type: type,
      location: location,
      images: images,
      developer: developer,
      price: price,
      Bedrooms: Bedrooms,
      Bathrooms: Bathrooms,
      Area: Area,
      reference: reference,
      property_overview: property_overview,
      description: description,
    };
  });
  console.log(links);

  await browser.close();
}
run();
