const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/sale_hotels${batch}.csv`,
    header: [{ id: "content", title: "content" }],
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

let csvErrr = csv_error_handler("sale_hotels");
let csvWriter = csv_handler("sale_hotels", 1);
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

      images = [];
      let temp = Array.from(
        document.querySelectorAll(
          "div.vc_row.wpb_row.vc_inner.vc_row-fluid.bcontent div.wpb_column.vc_column_container.vc_col-sm-4 img"
        )
      );
      temp.forEach((e) => images.push(e.src));
      images = [...new Set(images)];
      let titles = [];
      temp = Array.from(
        document.querySelectorAll(
          "div.vc_row.wpb_row.vc_inner.vc_row-fluid.bcontent div.wpb_column.vc_column_container.vc_col-sm-4 h4"
        )
      );
      temp.forEach((e) => titles.push(e.textContent));
      let starts = [];
      temp = Array.from(
        document.querySelectorAll(
          "div.vc_row.wpb_row.vc_inner.vc_row-fluid.bcontent div.wpb_column.vc_column_container.vc_col-sm-4 p"
        )
      );
      temp.forEach((e) =>
        starts.push(`${e.textContent.split("Hotel")[0]}Hotel`)
      );
      let prices = [];
      temp = Array.from(
        document.querySelectorAll(
          "div.vc_row.wpb_row.vc_inner.vc_row-fluid.bcontent div.wpb_column.vc_column_container.vc_col-sm-4 p"
        )
      );
      temp.forEach((e) => prices.push(clean(e.textContent.split("Hotel")[1])));
      let content = [];
      for (let i = 0; i < images.length; i++) {
        let cover_img = images[i];
        let title = titles[i];
        let price = prices[i];
        let strart = starts[i];
        content.push(JSON.stringify({ title, cover_img, price, strart }));
      }
      return {
        content: content,
      };
    })
  );

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("sale_hotels", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  try {
    await visit_each(
      "https://www.providentestate.com/buy-hotels-in-dubai.html",
      page
    );
  } catch (error) {
    try {
      await visit_each(
        "https://www.providentestate.com/buy-hotels-in-dubai.html",
        page
      );
    } catch (err) {
      try {
        await visit_each(
          "https://www.providentestate.com/buy-hotels-in-dubai.html",
          page
        );
      } catch (error) {
        console.error(error);
        csvErrr
          .writeRecords({ link: link, error: err })
          .then(() => console.log("error logged main loop"));
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
