const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");
const axios = require("axios");
const { exec } = require("child_process");
const { arrayBuffer, json } = require("stream/consumers");
function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/Prism_Conveyance_spider${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "description", title: "description" },
      {
        id: "services",
        title: "services",
      },
      { id: "brochure", title: "brochure" },
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

let csvErrr = csv_error_handler("area_guiPrism_Conveyance_spiderdes_haus");
let csvWriter = csv_handler("Prism_Conveyance_spider", 1);
let batch = 0;
let j = 0;
let main_err_record = 0;
let visit_err_record = 0;

async function visit_each(link, page) {
  // await page.setCacheEnabled(false);
  let data = [];
  data.push({
    title: link.title,
    description: link.description,
    services: link.services,
    brochure: link.brochure,
  });

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("Prism_Conveyance_spider", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://www.providentestate.com/conveyance.html`;
  console.log(target);
  await page.goto(target);
  const content = await page.evaluate(() => {
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
        document.querySelector("h1.vc_custom_heading.prism-head").textContent
      );
    } catch (error) {}

    let description = "";
    try {
      description = clean(
        document.querySelector("p.vc_custom_heading").textContent
      );
      description += clean(
        document.querySelector("h4.vc_custom_heading").textContent
      );
    } catch (error) {}
    let temp = Array.from(
      document.querySelectorAll(".wpb_text_column.wpb_content_element ")
    );
    let temp1 = Array.from(
      document.querySelectorAll("h2.vc_custom_heading.font-bold")
    );
    let services = [];
    let services_ = {};
    for (let i = 0; i < temp1.length; i++) {
      services_[clean(temp1[i].textContent)] = clean(temp[i].textContent);
    }
    services.push(JSON.stringify(services_));
    let brochure = document.querySelector(
      "a.vc_general.vc_btn3.vc_btn3-size-lg.vc_btn3-shape-round.vc_btn3-style-custom.vc_btn3-icon-left"
    ).href;
    return {
      title: title,
      description: description,
      services: services,
      brochure: brochure,
    };
  });
  console.log(content);
  await visit_each(content, page);
}

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/usr/bin/google-chrome-stable",
    args: ["--no-sandbox"],
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
