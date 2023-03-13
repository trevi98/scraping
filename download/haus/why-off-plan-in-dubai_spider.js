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
    path: `${directory}/why-off-plan-in-dubai_haus${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "description", title: "description" },
      { id: "article", title: "article" },
      { id: "title_choose_haus", title: "title_choose_haus" },
      { id: "list_choose_haus", title: "list_choose_haus" },
      { id: "developers_overview", title: "developers_overview" },
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

let csvErrr = csv_error_handler("area_guiwhy-off-plan-in-dubai_hausdes_haus");
let csvWriter = csv_handler("why-off-plan-in-dubai_haus", 1);
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
    article: link.article,
    title_choose_haus: link.title_choose_haus,
    list_choose_haus: link.list_choose_haus,
    developers_overview: link.developers_overview,
  });

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("why-off-plan-in-dubai_haus", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://www.hausandhaus.com/new-developments/why-off-plan-in-dubai`;
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
      title = clean(document.querySelector("h1.h2").textContent);
    } catch (error) {}

    let description = "";
    try {
      description = clean(
        document.querySelector("div.article-head p").textContent
      );
    } catch (error) {}
    let title_choose_haus = "";
    try {
      title_choose_haus = clean(
        document.querySelector(
          "section.section-off-plan-service.animate-right h2"
        ).textContent
      );
    } catch (error) {}
    let list_choose_haus = [];
    let temp = Array.from(
      document.querySelectorAll(
        "section.section-off-plan-service.animate-right p"
      )
    );
    temp.forEach((e) => {
      try {
        list_choose_haus.push(clean(e.textContent));
      } catch (error) {}
    });
    list_choose_haus = [...new Set(list_choose_haus)];
    temp = Array.from(
      document.querySelectorAll(
        "section.off-plan-article-content.js-animate-left p"
      )
    );
    let article = "";
    temp.forEach((e) => {
      try {
        article += clean(e.textContent);
      } catch (error) {}
    });
    let developers_overview = "";
    try {
      developers_overview = clean(
        document.querySelector(
          "section.section-off-plan-logos.animate-right div.container"
        ).textContent
      );
    } catch (error) {}
    return {
      title: title,
      description: description,
      article: article,
      title_choose_haus: title_choose_haus,
      list_choose_haus: list_choose_haus,
      developers_overview: developers_overview,
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