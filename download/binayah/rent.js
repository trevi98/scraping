const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");
const axios = require("axios");
const { exec } = require("child_process");
function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/rent_binayah${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "type", title: "type" },
      { id: "description", title: "description" },
      { id: "location", title: "location" },
      { id: "sub_location", title: "sub_location" },
      { id: "city", title: "city" },
      { id: "country", title: "country" },
      { id: "Property_ID", title: "Property_ID" },
      { id: "Price", title: "Price" },
      { id: "Land_Area", title: "Land_Area" },
      { id: "Bedrooms", title: "Bedrooms" },
      { id: "Bathrooms", title: "Bathrooms" },
      { id: "Garage", title: "Garage" },
      { id: "Property_Type", title: "Property_Type" },
      { id: "Property_Status", title: "Property_Status" },
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

let csvErrr = csv_error_handler("rent_binayah");
let csvWriter = csv_handler("rent_binayah", 1);
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

      let title = "";
      try {
        title = clean(document.title);
      } catch (error) {}
      let type = "";
      try {
        type = clean(
          document.querySelectorAll(".breadcrumb-item")[1].textContent
        );
      } catch (error) {}
      let description = "";
      try {
        description = clean(
          document.querySelector(
            "div.property-description-wrap.property-section-wrap div.block-wrap div.block-content-wrap"
          ).textContent
        );
      } catch (error) {}
      let location = "";
      let sub_location = "";
      let city = "";
      let country = "";
      try {
        location = clean(
          document.querySelector("#property-address-wrap .detail-area span")
            .textContent
        );
      } catch (error) {}
      try {
        city = clean(
          document.querySelector("#property-address-wrap .detail-city span")
            .textContent
        );
      } catch (error) {}
      try {
        country = clean(
          document.querySelector("#property-address-wrap .detail-country span")
            .textContent
        );
      } catch (error) {}
      try {
        sub_location = clean(
          document.querySelector("#property-address-wrap .detail-country span")
            .textContent
        );
      } catch (error) {}
      let temp = Array.from(
        document.querySelectorAll("#property-detail-wrap li")
      );
      let Property_ID = "";
      let Price = "";
      let Land_Area = "";
      let Bedrooms = "";
      let Bathrooms = "";
      let Garage = "";
      let Property_Type = "";
      let Property_Status = "";

      temp.forEach((e) => {
        let key = e.querySelector("strong").textContent;
        let value = clean(e.querySelector("span").textContent);
        if (/Property ID/i.test(key)) {
          Property_ID = value;
        }
        if (/Price/i.test(key)) {
          Price = value;
        }
        if (/Land Area/i.test(key)) {
          Land_Area = value;
        }
        if (/Bedrooms/i.test(key)) {
          Bedrooms = value;
        }
        if (/Bathrooms/i.test(key)) {
          Bathrooms = value;
        }
        if (/Garage/i.test(key)) {
          Garage = value;
        }
        if (/Property Type/i.test(key)) {
          Property_Type = value;
        }
        if (/Property Status/i.test(key)) {
          Property_Status = value;
        }
      });

      return {
        title: title,
        type: type,
        description: description,
        location: location,
        sub_location: sub_location,
        city: city,
        country: country,
        Property_ID: Property_ID,
        Price: Price,
        Land_Area: Land_Area,
        Bedrooms: Bedrooms,
        Bathrooms: Bathrooms,
        Garage: Garage,
        Property_Type: Property_Type,
        Property_Status: Property_Status,
      };
    })
  );

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("rent_binayah", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://www.binayah.com/dubai-properties-for-rent/page/${i}/`;
  if (i == 1) {
    target = "https://www.binayah.com/dubai-properties-for-rent";
  }
  console.log(target);
  await page.goto(target);
  const links = await page.evaluate(() => {
    let all = [];
    let link = Array.from(document.querySelectorAll(".listing-thumb "));
    link.forEach((e) => {
      let a = e.querySelector("a").href;
      all.push(a);
    });
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
  if (i == 1 || i % 20 == 0 || i == 8) {
    const message = `Done - rent binayah ${i} done`;

    const url = "https://profoundproject.com/tele/";

    axios
      .get(url, {
        params: {
          message: message,
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    if (i == 8) {
      exec("pm2 stop main_binayah", (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing command: ${error}`);
          return;
        }

        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      });
    }
  }
}

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/usr/bin/google-chrome-stable",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  // let plans_data = {};
  for (let i = 1; i <= 8; i++) {
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
