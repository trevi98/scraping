const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/damac_360_vitrual_tours${batch}.csv`,
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

let csvErrr = csv_error_handler("damac_360_vitrual_tours");
let csvWriter = csv_handler("damac_360_vitrual_tours", 1);
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
    csvWriter = csv_handler("damac_360_vitrual_tours", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://offplandxb.ae/damac-360-vitrual-tours/`;

  console.log(target);
  await page.goto(target);
  const links = await page.evaluate(() => {
    let all = [];
    let cards = Array.from(
      document.querySelectorAll(
        ".elementor-column.elementor-col-33.elementor-inner-column.elementor-element.pum-trigger "
      )
    );
    cards.forEach((e) => {
      let title = e.querySelector("h3").textContent;
      e.click();
      setTimeout(() => {}, 5000);
      let temp = Array.from(
        document.querySelectorAll(
          ".bottom-controls .collapsible-list-items .mp-nova-btn.mp-nova-btn-tertiary.mp-nova-btn-overlay.mp-nova-btn-icon"
        )
      );
      document
        .querySelectorAll(
          ".bottom-controls .collapsible-list-items .mp-nova-btn.mp-nova-btn-tertiary.mp-nova-btn-overlay.mp-nova-btn-icon"
        )
        [temp.length - 3].click();
      let link = document.querySelector("dialog input").value;
      all.push({ title: title, link: link });
    });
    let uniqe_links = [...new Set(all)];
    return uniqe_links;
  });
  console.log(links);
  console.log(links.length);

  //   await visit_each(links, page);
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
