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
      let description = [];
      let temp = Array.from(document.querySelectorAll(".inner-content>*"));
      temp.forEach((e) => {
        if (!/img/i.test(e.textContent)) {
        }
        try {
          description.push(clean(e.textContent));
        } catch (error) {}
      });

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
  let target = `https://off-planproperties.ae/category/blog-real-estate/`;

  console.log(target);
  await page.goto(target);
  const links = await page.evaluate(() => {
    let all = [];
    let link = Array.from(document.querySelectorAll(".marT30.marB0 .btn "));
    link.forEach((e) => {
      let a = e.href;
      all.push(a);
    });
    let uniqe_links = [...new Set(all)];
    return uniqe_links;
  });

  for (const link of links) {
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