const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");
const { on } = require("events");

function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/investment_analysis${batch}.csv`,
    header: [{ id: "rows", title: "rows" }],
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

let csvErrr = csv_error_handler("investment_analysis");
let csvWriter = csv_handler("investment_analysis", 1);
let batch = 0;
let j = 0;
let main_err_record = 0;
let visit_err_record = 0;

async function visit_each(page, rows) {
  // await page.setCacheEnabled(false);
  let data = [];
  data.push({
    rows: JSON.stringify(rows),
  });
  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("investment_analysis", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page) {
  let target = `https://famproperties.com/dubai-real-estate-investment-analysis`;

  console.log(target);
  await page.goto(target);
  let all_rows = [];
  while (true) {
    await page.evaluate(() => {
      document.querySelectorAll("footer .row")[15].style.display = "none";
    });
    await page.evaluate(() => {
      document.querySelector("#marquizPopup").style.display = "none";
    });
    let rows = await page.evaluate(() => {
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
      let temp = Array.from(
        document.querySelectorAll("#paymentplan_timeline li")
      );
      let content_row = [];
      temp.forEach((e) => {
        let title = "";
        let Money_Value = "";
        let Income_Generating = "";
        let Capital_Appreciation = "";
        let Overall = "";
        try {
          title = clean(e.querySelector(".t-Timeline-username a").textContent);
        } catch (error) {}
        try {
          Money_Value = clean(
            e.querySelectorAll(".col.col-3.u-textCenter .percent")[0]
              .textContent
          );
        } catch (error) {}
        try {
          Income_Generating = clean(
            e.querySelectorAll(".col.col-3.u-textCenter .percent")[1]
              .textContent
          );
        } catch (error) {}
        try {
          Capital_Appreciation = clean(
            e.querySelectorAll(".col.col-3.u-textCenter .percent")[2]
              .textContent
          );
        } catch (error) {}
        try {
          Overall = clean(
            e.querySelectorAll(".col.col-3.u-textCenter .percent")[3]
              .textContent
          );
        } catch (error) {}
        content_row.push({
          title,
          Money_Value,
          Capital_Appreciation,
          Income_Generating,
          Overall,
        });
      });
      return content_row;
    });
    all_rows.push(rows);
    if (
      await page.evaluate(() => {
        return (
          document.querySelector(
            ".t-Button.t-Button--small.t-Button--noUI.t-Report-paginationLink.t-Report-paginationLink--next"
          ) !== null
        );
      })
    ) {
      await page.click(
        ".t-Button.t-Button--small.t-Button--noUI.t-Report-paginationLink.t-Report-paginationLink--next"
      );
    } else {
      break;
    }
    await page.waitForTimeout(4000);
  }
  let all = [];
  all_rows.forEach((e) => {
    e.forEach((s) => {
      all.push(s);
    });
  });

  await visit_each(page, [...new Set(all)]);
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
      await main_loop(page);
    } catch (error) {
      try {
        await main_loop(page);
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
