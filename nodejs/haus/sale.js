const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/sale_haus${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "images", title: "images" },
      { id: "Area", title: "Area" },
      { id: "Bathrooms", title: "Bathrooms" },
      { id: "Bedrooms", title: "Bedrooms" },
      { id: "features", title: "features" },
      { id: "price", title: "price" },
      { id: "overview", title: "overview" },
      { id: "brochure", title: "brochure" },
      { id: "signaturea", title: "signaturea" },
    ],
  });
}

function csv_error_handler(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/error_links.csv`,
    header: [
      { id: "link", title: "link" },
      { id: "error", title: "error" },
    ],
  });
}

let csvErrr = csv_error_handler("sale_haus");
let csvWriter = csv_handler("sale_haus", 1);
let batch = 0;
let j = 0;
let main_err_record = 0;
let visit_err_record = 0;

async function visit_each(link, page) {
  // await page.setCacheEnabled(false);
  await page.goto(link);
  let data = [];
  data.push(
    await page.evaluate(async () => {
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

      let title = document.querySelector(
        "div.main section.section-details.section-details-1 div.section-body.section-body-wrapper div.container div.row.row-wrapper div.col-wrapper h1.h3.item-heading"
      ).textContent;
      let images = [];
      let temp = Array.from(
        document.querySelectorAll("div.section-gallery.js-animate-top img")
      );
      temp.forEach((e) => images.push(e.src));
      images = [...new Set(images)];
      let bathrooms = "";
      let bedrooms = "";
      let area = "";
      temp = Array.from(document.querySelectorAll("ul.list-icons li"));
      temp.forEach((e) => {
        if (/Bedrooms/i.test(e.textContent)) {
          bedrooms = e.querySelector("span").textContent;
        }
        if (/Bathrooms/i.test(e.textContent)) {
          bathrooms = e.querySelector("span").textContent;
        }
        if (/Square/i.test(e.textContent)) {
          area = e.querySelector("span").textContent;
        }
      });
      let features = [];
      temp = Array.from(
        document.querySelectorAll(
          "div.main section.section-details.section-details-1 div.section-body.section-body-wrapper div.container div.row.row-wrapper div.col-wrapper div.section-tabs div.tabs-details.slider-multiple-filters div.tab-content div.active.sub-section div.item-features ul li"
        )
      );
      try {
        temp.forEach((e) => features.push(e.textContent));
      } catch (error) {
        features = [];
      }
      let price = document.querySelector(
        "div.main section.section-details.section-details-1 div.section-body.section-body-wrapper div.container div.row.row-wrapper div.col-wrapper h6.item-price"
      );
      try {
        price = price.textContent;
      } catch (error) {
        price = "";
      }
      let overview = document.querySelector(
        "div.main section.section-details.section-details-1 div.section-body.section-body-wrapper div.container div.row.row-wrapper div.col-wrapper div.section-tabs div.tabs-details.slider-multiple-filters div.tab-content div.active.sub-section div.item-intro-text"
      );
      try {
        overview = clean(overview.textContent);
      } catch (error) {
        overview = "";
      }
      let brochure = "";
      temp = Array.from(document.querySelectorAll("ul.tabs-list li a"));
      temp.forEach((e) => {
        if (/brochure/i.test(e.textContent)) {
          try {
            brochure = e.href;
          } catch (error) {
            brochure = "";
          }
        }
      });
      return {
        title: title,
        images: images,
        Area: area,
        Bathrooms: bathrooms,
        Bedrooms: bedrooms,
        features: features,
        price: price,
        overview: overview,
        brochure: brochure,
        signaturea: Date.now(),
      };
    })
  );

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("sale_haus", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://www.hausandhaus.com/property-sales/properties-available-for-sale-in-dubai/page-${i}`;
  if (i == 1) {
    target =
      "https://www.hausandhaus.com/property-sales/properties-available-for-sale-in-dubai";
  }
  console.log(target);
  await page.goto(target);
  const links = await page.evaluate(() => {
    let all = [];
    let link = Array.from(
      document.querySelectorAll(
        "div.properties.map-properties.equalize-items div.col.col-property.col-sm-6.col-xs-6.col-xs-custom.js-animate-bottom div.card.card-white.card-primary.card-property.property.results-property div.card-image div.img-wrapper a"
      )
    );
    link.forEach((e) => all.push(e.href));
    let uniqe_links = [...new Set(all)];
    return uniqe_links;
  });

  for (const link of links) {
    try {
      await visit_each(link, page);
    } catch (error) {
      try {
        await visit_each(link, page);
      } catch (err) {
        try {
          await visit_each(link, page);
        } catch (error) {
          console.error(error);
          csvErrr
            .writeRecords({ link: link, error: err })
            .then(() => console.log("error logged main loop"));
          continue;
        }
      }
    }
  }
}

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--enable-automation"],
  });
  const page = await browser.newPage();
  // let plans_data = {};
  for (let i = 1; i <= 65; i++) {
    try {
      await main_loop(page, i);
    } catch (error) {
      try {
        await main_loop(page, i);
      } catch (error) {
        console.error(error);
        csvErrr
          .writeRecords({ link: i, error: error })
          .then(() => console.log("error logged main"));
        continue;
      }
    }
  }
  await browser.close();
}

main();
