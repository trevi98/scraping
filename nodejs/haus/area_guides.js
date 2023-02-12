const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/area_guides_haus${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "about", title: "about" },
      { id: "all", title: "all" },
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

      let title = clean(
        document.querySelector("div.intro-content h1").textContent
      );
      let about = clean(
        document.querySelector(
          "div.article-head div.introtext.row.js-animate-right div.col-sm-12 p"
        ).textContent
      );
      let temp = Array.from(
        document.querySelectorAll("div.article-entry div.row div.col-sm-6 > *")
      );
      let all_title = [];
      let all_description = [];
      for (let i = 0; i < temp.length; i++) {
        if (
          temp[i].innerHTML.startsWith("<strong") ||
          temp[i].innerHTML.startsWith("<b>")
        ) {
          all_title.push(temp[i].textContent);
          let results = "";
          let s = i + 1;
          while (s < temp.length) {
            if (
              temp[s].innerHTML.startsWith("<strong") ||
              temp[s].innerHTML.startsWith("<b>")
            )
              break;
            else {
              results += temp[s].textContent;
              s += 1;
              continue;
            }
          }
          i = s - 1;
          all_description.push(clean(results));
        } else {
          continue;
        }
      }
      all = {};
      for (let i = 0; i < all_description.length; i++) {
        all[all_title[i]] = all_description[i];
      }

      return {
        title: title,
        about: about,
        all: all,
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
