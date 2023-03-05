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
    path: `${directory}/tallest_buildings${batch}.csv`,
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

let csvErrr = csv_error_handler("tallest_buildings");
let csvWriter = csv_handler("tallest_buildings", 1);
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
    csvWriter = csv_handler("tallest_buildings", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page) {
  let target = `https://famproperties.com/tallest-buildings-in-dubai`;

  console.log(target);
  await page.goto(target);
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
      document.querySelectorAll("#report_table_R12904574894557707127 tbody tr")
    );
    let content_row = [];
    temp.forEach((e) => {
      let Rank = "";
      let Name = "";
      let Status = "";
      let Global_Ranking = "";
      let Middle_East_Ranking = "";
      let Address = "";
      let Building_Function = "";
      let Construction_Start = "";
      let Completion = "";
      let Developer = "";
      let Total_Heght_meter = "";
      let No_of_Apartment = "";
      let No_of_Room = "";
      let No_of_Parking = "";
      try {
        Rank = clean(e.querySelector("td[headers='RANK']").textContent);
      } catch (error) {}
      try {
        Name = clean(e.querySelector("td[headers='NAME']").textContent);
      } catch (error) {}
      try {
        Status = clean(e.querySelector("td[headers='STATUS']").textContent);
      } catch (error) {}
      try {
        Global_Ranking = clean(
          e.querySelector("td[headers='GLOBAL_RANKING']").textContent
        );
      } catch (error) {}
      try {
        Middle_East_Ranking = clean(
          e.querySelector("td[headers='REGION_RANKING']").textContent
        );
      } catch (error) {}
      try {
        Address = clean(e.querySelector("td[headers='ADDRESS']").textContent);
      } catch (error) {}
      try {
        Building_Function = clean(
          e.querySelector("td[headers='BUILDING_FUNCTION']").textContent
        );
      } catch (error) {}
      try {
        Construction_Start = clean(
          e.querySelector("td[headers='CONSTRUCTION_START']").textContent
        );
      } catch (error) {}
      try {
        Completion = clean(
          e.querySelector("td[headers='COMPLETION']").textContent
        );
      } catch (error) {}
      try {
        Developer = clean(
          e.querySelector("td[headers='DEVELOPER']").textContent
        );
      } catch (error) {}
      try {
        Total_Heght_meter = clean(
          e.querySelector("td[headers='TOTAL_HIEGHT']").textContent
        );
      } catch (error) {}
      try {
        No_of_Apartment = clean(
          e.querySelector("td[headers='NO_OF_APARTMENT']").textContent
        );
      } catch (error) {}
      try {
        No_of_Room = clean(
          e.querySelector("td[headers='NO_OF_ROOM']").textContent
        );
      } catch (error) {}
      try {
        No_of_Parking = clean(
          e.querySelector("td[headers='NO_OF_PARKING']").textContent
        );
      } catch (error) {}
      content_row.push({
        Rank,
        Name,
        Status,
        Global_Ranking,
        Middle_East_Ranking,
        Address,
        Building_Function,
        Construction_Start,
        Completion,
        Developer,
        Total_Heght_meter,
        No_of_Apartment,
        No_of_Room,
        No_of_Parking,
      });
    });
    return [...new Set(content_row)];
  });
  console.log(rows);
  console.log(rows.length);

  await visit_each(page, rows);
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
