const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/damac_360_vitrual_tours_meeras${batch}.csv`,
    header: [{ id: "all", title: "all" }],
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

let csvErrr = csv_error_handler("damac_360_vitrual_tours_meeras");
let csvWriter = csv_handler("damac_360_vitrual_tours_meeras", 1);
let batch = 0;
let j = 0;
let main_err_record = 0;
let visit_err_record = 0;

async function visit_each(all, page) {
  let data = [];
  data.push({ all: all });

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("damac_360_vitrual_tours_meeras", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://offplandxb.ae/meeras/`;

  console.log(target);
  await page.goto(target);
  let all = [];
  const elements = await page.$$(
    ".elementor-column.elementor-col-33.elementor-inner-column.elementor-element.pum-trigger"
  );
  for (let i = 0; i < elements.length; i++) {
    await elements[i].click();
    await page.waitForTimeout(5000);
    let link = await page.evaluate(() => {
      return document.querySelector(
        ".pum[aria-hidden='false'] .pum-content p iframe"
      ).src;
    });
    await page.click(".pum[aria-hidden='false'] .pum-close.popmake-close");
    all.push(link);
    await page.waitForTimeout(2000);
  }
  let titles = await page.evaluate(() => {
    let titles = [];
    let temp = Array.from(
      document.querySelectorAll(
        ".elementor-column.elementor-col-33.elementor-inner-column.elementor-element.pum-trigger"
      )
    );
    temp.forEach((e) => {
      try {
        titles.push(e.querySelector("h3").textContent);
      } catch (error) {}
    });
    return titles;
  });
  // all = [...new Set(all)];
  let content = [];
  for (let i = 0; i < all.length; i++) {
    content.push(JSON.stringify({ link: all[i], title: titles[i] }));
  }
  await visit_each(content, page);
}

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--enable-automation"],
  });
  const page = await browser.newPage();
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
