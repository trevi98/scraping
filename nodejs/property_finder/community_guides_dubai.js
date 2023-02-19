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
    path: `${directory}/community_guides_dubai${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "description", title: "description" },
      { id: "cover_image", title: "cover_image" },
      { id: "qeustions", title: "qeustions" },
      { id: "answers", title: "answers" },
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

let csvErrr = csv_error_handler("community_guides_dubai");
let csvWriter = csv_handler("community_guides_dubai", 1);
let batch = 0;
let j = 0;
let main_err_record = 0;
let visit_err_record = 0;

async function visit_each(link, page, cover) {
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
        title = clean(document.title.split("|")[0]);
      } catch (error) {
        title = clean(document.title);
      }
      let description = "";
      try {
        description = document.querySelector(
          "div.community-guide__description-content p"
        ).textContent;
      } catch (error) {}
      let qeustions = [];
      let answers = [];
      temp = Array.from(
        document.querySelectorAll("div.accordion .accordion__title")
      );
      temp.forEach((e) => {
        try {
          qeustions.push(clean(e.textContent));
        } catch (error) {}
      });
      temp = Array.from(
        document.querySelectorAll("div.accordion .accordion__content")
      );
      temp.forEach((e) => {
        try {
          answers.push(clean(e.textContent));
        } catch (error) {}
      });

      return {
        title: title,
        description: description,
        qeustions: qeustions,
        answers: answers,
        signaturea: Date.now(),
      };
    })
  );
  data[0].cover_image = cover;

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("community_guides_dubai", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://www.propertyfinder.ae/en/community-guides/dubai`;
  console.log(target);
  await page.goto(target);
  await page.waitForSelector(
    ".card-community__image.progressive-image--loaded"
  );
  const links = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll(".card-community"));
    let anchors = [];
    items.forEach((item) => {
      let a = item.href;
      let cover_image = item.querySelector(
        ".card-community__image.progressive-image--loaded"
      ).src;

      anchors.push({ link: a, cover_image: cover_image });
    });
    let uniqe_links = [...new Set(anchors)];
    return uniqe_links;
  });
  // console.log(links.link);
  for (const link of links) {
    console.log(link.link);
  }

  for (const link of links) {
    try {
      await visit_each(link.link, page, link.cover_image);
    } catch (error) {
      try {
        await visit_each(link.link, page, link.cover_image);
      } catch (err) {
        try {
          await visit_each(link.link, page, link.cover_image);
        } catch (error) {
          console.error(error);
          csvErrr
            .writeRecords({ link: link.link, error: err })
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
