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
    path: `${directory}/area_guides_haus${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "about", title: "about" },
      { id: "description", title: "description" },
      { id: "images", title: "images" },
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

let csvErrr = csv_error_handler("area_guides_haus");
let csvWriter = csv_handler("area_guides_haus", 1);
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
      title = clean(document.querySelector("div.intro-content h1").textContent);
      let about = "";
      try {
        about = clean(
          document.querySelector(
            "div.article-head div.introtext.row.js-animate-right div.col-sm-12 p"
          ).textContent
        );
      } catch (error) {}
      let temp = Array.from(
        document.querySelectorAll(".article-entry div.col-sm-6 p")
      );
      let description = [];
      temp.forEach((e) => {
        let one = "";
        try {
          one = clean(e.textContent);
        } catch (error) {}
        if (one) description.push(one);
      });

      let images = [];
      temp = Array.from(
        document.querySelectorAll(".article-entry div.col-sm-6 img")
      );
      temp.forEach((e) => {
        try {
          images.push(e.src);
        } catch (error) {}
      });

      return {
        title: title,
        about: about,
        description: description,
        images: images,
        signaturea: Date.now(),
      };
    })
  );

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("area_guides_haus", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://www.hausandhaus.com/living-in-dubai/area-guides?start=${i}`;
  if (i == 1) {
    target = "https://www.hausandhaus.com/living-in-dubai/area-guides?start=1";
  }
  console.log(target);
  await page.goto(target);
  const links = await page.evaluate(() => {
    let all = [];
    let link = Array.from(
      document.querySelectorAll(
        "div.category-items div.container div.card-wrapper.infinite-item div.areaguide-item.card.card-secondary-alt.col-xs-12.col-md-6.js-animate-bottom div.card-image.image-hover-zoom a"
      )
    );
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
  if (i == 1 || i % 20 == 0 || i == 20) {
    const message = `Done - area haus ${i} done`;

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
    if (i == 20) {
      exec("pm2 stop main1", (error, stdout, stderr) => {
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
  // let plans_data = {};
  let i = 1;
  let s = 1;
  for (; i <= 20; i++) {
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
    i = s * 10 - 1;
    s++;
  }
  await browser.close();
}

main();
