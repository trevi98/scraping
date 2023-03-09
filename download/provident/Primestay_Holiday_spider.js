const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");
const axios = require("axios");
const { exec } = require("child_process");
const { arrayBuffer } = require("stream/consumers");
function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/Primestay_Holiday_spider_prov${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "description", title: "description" },
      {
        id: "In_just_5_steps_you_can_start_earning_great_returns_with_short_term_rentals_of_your_property_investment",
        title:
          "In_just_5_steps_you_can_start_earning_great_returns_with_short_term_rentals_of_your_property_investment",
      },
      { id: "in_holiday", title: "in_holiday" },
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

let csvErrr = csv_error_handler(
  "area_guiPrimestay_Holiday_spider_provdes_haus"
);
let csvWriter = csv_handler("Primestay_Holiday_spider_prov", 1);
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
    In_just_5_steps_you_can_start_earning_great_returns_with_short_term_rentals_of_your_property_investment:
      link.In_just_5_steps_you_can_start_earning_great_returns_with_short_term_rentals_of_your_property_investment,
    in_holiday: link.in_holiday,
  });

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("Primestay_Holiday_spider_prov", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://www.providentestate.com/primestay-holiday-homes.html`;
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
        document.querySelector("h1.vc_custom_heading.primestay-head")
          .textContent
      );
    } catch (error) {}

    let description = "";
    try {
      description = clean(
        document.querySelector("p.vc_custom_heading").textContent
      );
    } catch (error) {}
    let In_just_5_steps_you_can_start_earning_great_returns_with_short_term_rentals_of_your_property_investment =
      [];
    let temp = Array.from(
      document.querySelectorAll(
        ".vc_row.wpb_row.vc_inner.vc_row-fluid.bcontent .vc_column-inner  .wpb_text_column.wpb_content_element  .wpb_wrapper ul li"
      )
    );
    temp.forEach((e) => {
      try {
        In_just_5_steps_you_can_start_earning_great_returns_with_short_term_rentals_of_your_property_investment.push(
          clean(e.textContent)
        );
      } catch (error) {}
    });
    temp = document.querySelectorAll(
      ".vc_row.wpb_row.vc_row-fluid.vc_row-o-content-middle.vc_row-flex"
    )[4];
    let temp1 = Array.from(temp.querySelectorAll("li"));
    let in_holiday = [];
    temp1.forEach((e) => {
      try {
        in_holiday.push(clean(e.textContent));
      } catch (error) {}
    });
    return {
      title: title,
      description: description,
      In_just_5_steps_you_can_start_earning_great_returns_with_short_term_rentals_of_your_property_investment:
        In_just_5_steps_you_can_start_earning_great_returns_with_short_term_rentals_of_your_property_investment,
      in_holiday: in_holiday,
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
