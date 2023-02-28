const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/area${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "about", title: "about" },
      { id: "cover_image", title: "cover_image" },
      { id: "signaturea", title: "signaturea" },
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

let csvErrr = csv_error_handler("area");
let csvWriter = csv_handler("area", 1);
let batch = 0;
let j = 0;
let main_err_record = 0;
let visit_err_record = 0;

async function visit_each(link, page) {
  await page.goto(link);
  let data = [];
  // await page.waitForSelector(".widgetModal .widgetModal-inner");
  // await page.evaluate(() => {
  //   document
  //     .querySelector(
  //       ".widgetModal .widgetModal-inner .widgetModal-close.js-closeModal"
  //     )
  //     .click();
  // });
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
        title = clean(
          document.querySelector(
            "h1.fs-30.lh-1.mb-3.text-heading.font-weight-600"
          ).textContent
        );
      } catch (error) {}
      let about = "";
      let cover_image = "";
      let temp = Array.from(document.querySelectorAll(".more p"));
      temp.forEach((e) => {
        try {
          about += clean(e.textContent);
        } catch (error) {}
      });
      try {
        cover_image = document.querySelector(
          ".pb-0.pt-8.property-list-pg div.mb-8 img"
        ).src;
      } catch (error) {}

      return {
        title: title,
        about: about,
        cover_image: cover_image,
        signaturea: Date.now(),
      };
    })
  );

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("area", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://dandbdubai.com/dubai-communities`;
  console.log(target);
  await page.goto(target);
  await page.addStyleTag({
    content: ".widgetModal { display: none !important; }",
  });
  let all = [];
  for (let i = 0; i < 6; i++) {
    all.push(
      await page.evaluate(() => {
        let links = [];
        let temp = Array.from(
          document.querySelectorAll(
            ".pb-10.pt-8.property-list-pg .hover-change-image a"
          )
        );
        temp.forEach((e) => {
          links.push(e.href);
        });
        return links;
      })
    );
    await page.evaluate(() => {
      let temp = Array.from(document.querySelectorAll(".page_numeric2"));
      document.querySelectorAll(".page_numeric2")[temp.length - 2].click();
    });
    await page.waitForSelector(".hover-change-image");
    await page.waitForTimeout(3000);
  }
  let all_links = [];
  all.forEach((e) => {
    e.forEach((s) => {
      all_links.push(s);
    });
  });

  all_links = [...new Set(all_links)];
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
