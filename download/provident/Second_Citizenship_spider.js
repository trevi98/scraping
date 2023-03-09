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
    path: `${directory}/Second_Citizenship_spider_prov${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "description", title: "description" },
      {
        id: "Why_Plan_B_Advisory_Services",
        title: "Why_Plan_B_Advisory_Services",
      },
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

let csvErrr = csv_error_handler("Second_Citizenship_spider_prov");
let csvWriter = csv_handler("Second_Citizenship_spider_prov", 1);
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
    Why_Plan_B_Advisory_Services: link.Why_Plan_B_Advisory_Services,
  });

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("Second_Citizenship_spider_prov", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://www.providentestate.com/second-citizenship.html`;
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
        document.querySelector("h1.vc_custom_heading.citizenship-head")
          .textContent
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
      document.querySelectorAll(
        ".bcontent.wpb_column.vc_column_container.vc_col-sm-12.vc_hidden-lg.vc_hidden-md .wpb_text_column.wpb_content_element ul li "
      )
    );
    let Why_Plan_B_Advisory_Services = [];
    Why_Plan_B_Advisory_Services.push(
      clean(document.querySelectorAll("h4.vc_custom_heading")[0].textContent)
    );
    Why_Plan_B_Advisory_Services.push(
      clean(document.querySelectorAll("h4.vc_custom_heading")[1].textContent)
    );
    temp.forEach((e) => {
      try {
        Why_Plan_B_Advisory_Services.push(clean(e.textContent));
      } catch (error) {}
    });

    return {
      title: title,
      description: description,
      Why_Plan_B_Advisory_Services: Why_Plan_B_Advisory_Services,
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
