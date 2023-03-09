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
    path: `${directory}/Premier_Finance_spider_prov${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "description", title: "description" },
      { id: "services", title: "services" },
      //   { id: "article", title: "article" },
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

let csvErrr = csv_error_handler("area_guiPremier_Finance_spider_provdes_haus");
let csvWriter = csv_handler("Premier_Finance_spider_prov", 1);
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
    // article: link.article,
  });

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("Premier_Finance_spider_prov", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://www.providentestate.com/premier-finance.html`;
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
        document.querySelector("h1.vc_custom_heading.premier-head").textContent
      );
    } catch (error) {}

    let description = "";
    try {
      description = clean(
        document.querySelector("p.vc_custom_heading ").textContent
      );
      description += clean(
        document.querySelector(
          ".headingTxt.jstTxt.wpb_column.vc_column_container.vc_col-sm-12.vc_hidden-sm.vc_hidden-xs p"
        ).textContent
      );
    } catch (error) {}
    let services = [];
    let temp = Array.from(
      document.querySelectorAll(
        ".wpb_text_column.wpb_content_element .wpb_wrapper ul li span"
      )
    );
    temp.forEach((e) => {
      try {
        services.push(clean(e.textContent));
      } catch (error) {}
    });
    // let temp = Array.from(
    //   document.querySelectorAll(
    //     "div.article-body.remove-border.js-animate-left div.article-entry div.row div.col-sm-6 p"
    //   )
    // );
    // let article = "";
    // temp.forEach((e) => {
    //   try {
    //     article += clean(e.textContent);
    //   } catch (error) {}
    // });
    return {
      title: title,
      description: description,
      services: services,
      //   article: article,
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
