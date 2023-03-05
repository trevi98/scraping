const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");
const axios = require("axios");
const { exec } = require("child_process");
function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/lastes_news_spider_haus${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "about", title: "about" },
      { id: "all_description", title: "all_description" },
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

let csvErrr = csv_error_handler("lastes_news_spider_haus");
let csvWriter = csv_handler("lastes_news_spider_haus", 1);
let batch = 0;
let j = 0;
let main_err_record = 0;
let visit_err_record = 0;

async function visit_each(link, page) {
  // await page.setCacheEnabled(false);
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
        title = clean(
          document.querySelector("div.article-head h1").textContent
        );
      } catch (error) {}
      let about = "";
      try {
        about = clean(
          document.querySelector(
            "div.article-head div.introtext.row.js-animate-right div.col-sm-12 p"
          ).textContent
        );
      } catch (error) {}
      let temp = Array.from(
        document.querySelectorAll(
          "div.article-body.remove-border.js-animate-left div.article-entry div.row div.col-sm-6 p"
        )
      );
      let all_description = [];
      temp.forEach((e) => {
        try {
          all_description.push(clean(e.textContent));
        } catch (error) {}
      });

      return {
        title: title,
        about: about,
        all_description: all_description,
      };
    })
  );

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("lastes_news_spider_haus", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://www.hausandhaus.com/latest-news?start=${i}`;
  if (i == 1) {
    target = "https://www.hausandhaus.com/latest-news?start=1";
  }
  console.log(target);
  await page.goto(target);
  const links = await page.evaluate(() => {
    let all = [];
    let link = Array.from(document.querySelectorAll(".card-image a"));
    link.forEach((e) => all.push(e.href));
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
  if (i == 1 || i % 20 == 0 || i == 325) {
    const message = `Done - lastest_news haus ${i} done`;

    const url = "https://profoundproject.com/tele/";

    axios
      .get(url, {
        params: {
          message: message,
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    if (i == 325) {
      exec("pm2 stop main", (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing command: ${error}`);
          return;
        }

        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      });
    }
  }
}

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/usr/bin/google-chrome-stable",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  let i = 1;
  let s = 1;
  for (; i <= 325; i++) {
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
    i = s * 13 - 1;
    s++;
  }
  await browser.close();
}

main();
