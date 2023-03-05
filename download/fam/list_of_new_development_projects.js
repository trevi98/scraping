const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");
const { on } = require("events");
const axios = require("axios");
const { exec } = require("child_process");
function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/list_of_new_development_projects${batch}.csv`,
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

let csvErrr = csv_error_handler("list_of_new_development_projects");
let csvWriter = csv_handler("list_of_new_development_projects", 1);
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
    csvWriter = csv_handler("list_of_new_development_projects", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page) {
  let target = `https://famproperties.com/list-of-new-development-projects-in-dubai`;

  console.log(target);
  await page.goto(target);
  let all_rows = [];
  let i = 0;
  while (i < 2) {
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
        document.querySelectorAll(".t-Report-tableWrap tbody")
      );
      let content_row = [];
      for (let i = 2; i < temp.length; i++) {
        let Building = "";
        let Area = "";
        let Real_Estate_Developer = "";
        let Property_type = "";
        let Location_map = "";
        let Completion_percent = "";
        let Handover = "";
        try {
          Building = clean(
            temp[i].querySelector("tr td[headers='BUILDING']").textContent
          );
        } catch (error) {}
        try {
          Area = clean(
            temp[i].querySelector("tr td[headers='AREA']").textContent
          );
        } catch (error) {}
        try {
          Real_Estate_Developer = clean(
            temp[i].querySelector("tr td[headers='DEVELOPER']").textContent
          );
        } catch (error) {}
        try {
          Property_type = clean(
            temp[i].querySelector("tr td[headers='PROPERTY_TYPE']").textContent
          );
        } catch (error) {}
        try {
          Location_map = clean(
            temp[i].querySelector("tr td[headers='LOCATION_MAP']").textContent
          );
        } catch (error) {}
        try {
          Completion_percent = clean(
            temp[i].querySelector("tr td[headers='COMPLETION_PERCENT']")
              .textContent
          );
        } catch (error) {}
        try {
          Handover = clean(
            temp[i].querySelector("tr td[headers='HAND_OVER']").textContent
          );
        } catch (error) {}
        content_row.push({
          Building,
          Area,
          Real_Estate_Developer,
          Property_type,
          Location_map,
          Completion_percent,
          Handover,
        });
      }
      return content_row;
    });
    all_rows.push(rows);

    await page.click(".t-Report-paginationLink");
    i++;

    await page.waitForTimeout(4000);
  }
  let all = [];
  all_rows.forEach((e) => {
    e.forEach((s) => {
      all.push(s);
    });
  });
  console.log(all);
  console.log(all.length);
  console.log([...new Set(all)].length);
  await visit_each(page, [...new Set(all)]);
  exec("pm2 stop main", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error}`);
      return;
    }

    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
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
