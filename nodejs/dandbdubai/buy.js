const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/buy${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "price", title: "price" },
      { id: "area", title: "area" },
      { id: "type", title: "type" },
      { id: "Bedrooms", title: "Bedrooms" },
      { id: "size", title: "size" },
      { id: "Bathrooms", title: "Bathrooms" },
      { id: "garage", title: "garage" },
      { id: "Property_ID", title: "Property_ID" },
      { id: "Permit_Number", title: "Permit_Number" },
      { id: "agent", title: "agent" },
      { id: "description", title: "description" },
      { id: "amenities", title: "amenities" },
      { id: "images", title: "images" },
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

let csvErrr = csv_error_handler("buy");
let csvWriter = csv_handler("buy", 1);
let batch = 0;
let j = 0;
let main_err_record = 0;
let visit_err_record = 0;

async function visit_each(link, page) {
  await page.goto(link);
  let data = [];
  // await page.waitForSelector(".widgetModal .widgetModal-inner");
  // await page.evaluate(() => {
  //   document
  //     .querySelector(
  //       ".widgetModal .widgetModal-inner .widgetModal-close.js-closeModal"
  //     )
  //     .click();
  // });
  await page.addStyleTag({
    content: ".widgetModal { display: none !important; }",
  });
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
      let title = "";
      try {
        title = clean(
          document.querySelector(
            ".pb-1.page-title .d-md-flex.justify-content-md-between.mb-6 h1"
          ).textContent
        );
      } catch (error) {}
      let price = "";
      try {
        price = clean(
          document.querySelector(
            ".pb-1.page-title .d-md-flex.justify-content-md-between.mb-6 h3"
          ).textContent
        );
      } catch (error) {}
      let area = "";
      try {
        area = clean(
          document.querySelector(
            ".pb-1.page-title .d-md-flex.justify-content-md-between.mb-6 p"
          ).textContent
        );
      } catch (error) {}
      let type = "";
      try {
        type = clean(
          document.querySelectorAll(".breadcrumb-wrap li")[2].textContent
        );
      } catch (error) {}
      let temp;
      let images = [];
      temp = Array.from(document.querySelectorAll(".card-img"));
      temp.forEach((e) => {
        try {
          images.push(e.href);
        } catch (error) {}
      });
      images = [...new Set(images)];
      let description = "";
      try {
        description = clean(
          document.querySelector(".pb-8.px-6.pt-5 p").textContent
        );
      } catch (error) {}
      temp = Array.from(
        document.querySelectorAll(".mt-2.pb-3.px-6.pt-5  .row .media-body")
      );
      let Bedrooms = "";
      let size = "";
      let Bathrooms = "";
      let garage = "";
      temp.forEach((e) => {
        let key = clean(e.querySelector("h5").textContent);
        let value = clean(e.querySelector("p").textContent);
        if (/bath/i.test(key)) Bathrooms = value;
        if (/Bed/i.test(key)) Bedrooms = value;
        if (/sqft/i.test(key)) size = value;
        if (/garage/i.test(key)) garage = value;
        if (!type) {
          if (/type/i.test(key)) type = value;
        }
      });
      temp = Array.from(document.querySelectorAll(".mt-2.pb-6.px-6.pt-5 dl"));
      let Property_ID = "";
      let Permit_Number = "";
      temp.forEach((e) => {
        let key = clean(e.querySelector("dt").textContent);
        let value = clean(e.querySelector("dd").textContent);
        if (/Property ID/i.test(key)) Property_ID = value;
        if (/Permit Number/i.test(key)) Permit_Number = value;
        if (!type) {
          if (/type/i.test(key)) type = value;
        }
        if (!Bathrooms) {
          if (/bath/i.test(key)) Bathrooms = value;
        }
        if (!Bedrooms) {
          if (/Bed/i.test(key)) Bedrooms = value;
        }
        if (!size) {
          if (/size/i.test(key)) size = value;
        }
        if (!price) {
          if (/price/i.test(key)) price = value;
        }
        if (!garage) {
          if (/garage/i.test(key)) garage = value;
        }
      });
      let amenities = [];
      temp = Array.from(document.querySelectorAll(".mt-2.pb-7.px-6.pt-5 li"));
      temp.forEach((e) => {
        try {
          amenities.push(clean(e.textContent));
        } catch (error) {}
      });
      let agent = "";
      try {
        agent = clean(
          document.querySelector(
            "aside#sidebar .fs-16.lh-214.text-dark.mb-0.font-weight-500.hover-primary"
          ).textContent
        );
      } catch (error) {}
      return {
        title: title,
        price: price,
        area: area,
        type: type,
        Bedrooms: Bedrooms,
        size: size,
        Bathrooms: Bathrooms,
        garage: garage,
        Property_ID: Property_ID,
        Permit_Number: Permit_Number,
        agent: agent,
        description: description,
        amenities: amenities,
        images: images,
        signaturea: Date.now(),
      };
    })
  );

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("buy", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://dandbdubai.com/sale-property-dubai`;
  console.log(target);
  await page.goto(target);
  await page.addStyleTag({
    content: ".widgetModal { display: none !important; }",
  });
  let all = [];
  for (let i = 0; i < 90; i++) {
    all.push(
      await page.evaluate(() => {
        let links = [];
        let temp = Array.from(
          document.querySelectorAll(".hover-change-image a")
        );
        temp.forEach((e) => {
          links.push(e.href);
        });
        return links;
      })
    );
    await page.evaluate(() => {
      let temp = Array.from(document.querySelectorAll(".page_numeric2"));
      document.querySelectorAll(".page_numeric2")[temp.length - 2].click();
    });
    await page.waitForSelector(".hover-change-image");
    await page.waitForTimeout(3000);
  }
  let all_links = [];
  all.forEach((e) => {
    e.forEach((s) => {
      all_links.push(s);
    });
  });

  all_links = [...new Set(all_links)];
  for (const link of all_links) {
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
  for (let i = 1; i <= 1; i++) {
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
