const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/rent_Townhouse${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "price", title: "price" },
      { id: "location", title: "location" },
      { id: "developer", title: "developer" },
      { id: "Property_Type", title: "Property_Type" },
      { id: "Purpose", title: "Purpose" },
      { id: "Bedrooms", title: "Bedrooms" },
      { id: "Baths", title: "Baths" },
      { id: "Property_ID", title: "Property_ID" },
      { id: "Area_Size", title: "Area_Size" },
      { id: "description", title: "description" },
      { id: "features", title: "features" },
      { id: "Images", title: "Images" },
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

let csvErrr = csv_error_handler("rent_Townhouse");
let csvWriter = csv_handler("rent_Townhouse", 1);
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

      let title = clean(document.querySelector(".page-title h1").textContent);
      let price = clean(
        document.querySelector("div.property-price  div").textContent
      );
      let location = clean(
        document
          .querySelector("div.page-title div.iw-heading-title h2 span")
          .textContent.split("in")[1]
      );
      let developer = clean(
        document.querySelector(
          "aside#iwp-property-author-infomation-2 div.agent-info .agent-name"
        ).textContent
      );
      let Property_Type = "";
      let Purpose = "";
      let Bedrooms = "";
      let Baths = "";
      let Property_ID = "";
      let Area_Size = "";
      let temp = Array.from(
        document.querySelectorAll(
          "div.iwp-single-property-detail div.iwp-property-block-content div.row div.col-sm-6.col-xs-12.col-lg-6.col-md-6 div.iwp-items div.iwp-item"
        )
      );
      for (let i = 0; i < temp.length; i++) {
        if (temp[i].textContent.includes("Type")) {
          Property_Type = clean(temp[i].textContent.split(":")[1]);
        }
        if (temp[i].textContent.includes("Purpose")) {
          Purpose = clean(temp[i].textContent.split(":")[1]);
        }
        if (temp[i].textContent.includes("Bedroom")) {
          Bedrooms = clean(temp[i].textContent.split(":")[1]);
        }
        if (temp[i].textContent.includes("Bath")) {
          Baths = clean(temp[i].textContent.split(":")[1]);
        }
        if (temp[i].textContent.includes("ID")) {
          Property_ID = clean(temp[i].textContent.split(":")[1]);
        }
        if (temp[i].textContent.includes("Size")) {
          Area_Size = clean(temp[i].textContent.split(":")[1]);
        }
      }
      let description = clean(
        document.querySelector("div.iwp-single-property-description")
          .textContent
      );
      let features = [];
      temp = Array.from(
        document.querySelectorAll(
          "div.iwp-single-property-features div.iwp-property-block-content ul li"
        )
      );
      temp.forEach((e) => {
        features.push(e.textContent);
      });
      all = [];
      temp = Array.from(document.querySelectorAll("div.iwp-flexslider img"));
      temp.forEach((e) => {
        all.push(e.src);
      });
      Images = [...new Set(all)];
      return {
        title: title,
        price: price,
        location: location,
        developer: developer,
        Property_Type: Property_Type,
        Purpose: Purpose,
        Bedrooms: Bedrooms,
        Baths: Baths,
        Property_ID: Property_ID,
        Area_Size: Area_Size,
        description: description,
        features: features,
        Images: Images,
      };
    })
  );

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("rent_Townhouse", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://www.providentestate.com/dubai/townhouse-for-rent.html?paged=${i}`;
  if (i == 1) {
    target = "https://www.providentestate.com/dubai/townhouse-for-rent.html";
  }
  console.log(target);
  await page.goto(target);
  const links = await page.evaluate(() => {
    let link = Array.from(
      document.querySelectorAll(
        "div.iw-property-content.grid-1 div.content-top a"
      )
    );
    let all = [];
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
