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
    path: `${directory}/luxury_apartments_for_rent_driven${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "type", title: "type" },
      { id: "location", title: "location" },
      { id: "images", title: "images" },
      { id: "developer", title: "developer" },
      { id: "price", title: "price" },
      { id: "Bedrooms", title: "Bedrooms" },
      { id: "Bathrooms", title: "Bathrooms" },
      { id: "Area", title: "Area" },
      { id: "reference", title: "reference" },
      { id: "property_overview", title: "property_overview" },
      { id: "description", title: "description" },
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

let csvErrr = csv_error_handler("luxury_apartments_for_rent_driven");
let csvWriter = csv_handler("luxury_apartments_for_rent_driven", 1);
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
        signaturea: Date.now(),
      };
    })
  );

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("luxury_apartments_for_rent_driven", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://www.drivenproperties.com/dubai/luxury-apartments-for-rent?page=${i}`;
  if (i == 1) {
    target =
      "https://www.drivenproperties.com/dubai/luxury-apartments-for-rent";
  }
  console.log(target);
  await page.goto(target);
  const links = await page.evaluate(() => {
    let all = [];
    let link = Array.from(
      document.querySelectorAll(".dpx-listing-cart-heading.mt-1 ")
    );
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
  if (i == 1 || i % 20 == 0 || i == 3) {
    const message = `Done - luxury_apartments_for_rent_driven driv ${i} done`;

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
    if (i == 3) {
      exec("pm2 stop main_driv", (error, stdout, stderr) => {
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
  for (let i = 1; i <= 3; i++) {
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
