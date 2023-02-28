const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/blog${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "description", title: "description" },
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

let csvErrr = csv_error_handler("blog");
let csvWriter = csv_handler("blog", 1);
let batch = 0;
let j = 0;
let main_err_record = 0;
let visit_err_record = 0;

async function visit_each(link, page) {
  await page.goto(link);
  let data = [];
  await page.addStyleTag({
    content: ".widgetModal { display: none !important; }",
  });
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
        title = clean(document.title);
      } catch (error) {}
      let description = "";
      try {
        description = clean(
          document.querySelector(".row.margin-bottom-30").textContent
        );
      } catch (error) {}
      return {
        title: title,
        description: description,
      };
    })
  );

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("blog", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://www.uniqueproperties.ae/en/blogs/`;
  console.log(target);
  await page.goto(target);
  let all = [];
  for (let i = 0; i < 15; i++) {
    all.push(
      await page.evaluate(() => {
        let links = [];
        let temp = Array.from(document.querySelectorAll(".btn-u.btn-u-sm"));
        temp.forEach((e) => {
          links.push(e.href);
        });
        return links;
      })
    );
    await page.evaluate(() => {
      let temp = Array.from(
        document.querySelectorAll(".pagination.pagination-v2 li a")
      );
      document
        .querySelectorAll(".pagination.pagination-v2 li a")
        [temp.length - 2].click();
    });
    await page.waitForSelector(".btn-u.btn-u-sm");
    await page.waitForTimeout(3000);
    console.log(all.length);
  }
  let all_links = [];
  all.forEach((e) => {
    e.forEach((s) => {
      all_links.push(s);
    });
  });

  all_links = [...new Set(all_links)];
  console.log(all_links.length);
  for (const link of all_links) {
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
