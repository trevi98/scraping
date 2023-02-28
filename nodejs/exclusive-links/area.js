const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");
const { type } = require("os");

function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/area${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "overview", title: "overview" },
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

let csvErrr = csv_error_handler("area");
let csvWriter = csv_handler("area", 1);
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
      let description = [];
      let temp = Array.from(
        document.querySelectorAll(".gap-40.gap-md-48.vstack section")
      );
      temp.forEach((e) => {
        try {
          description.push(clean(e.textContent));
        } catch (error) {}
      });
      let overview = "";
      try {
        overview = clean(
          document.querySelector(".image-banner__text.d-block").textContent
        );
      } catch (error) {}
      return {
        title: title,
        overview: overview,
        description: description,
        signaturea: Date.now(),
      };
    })
  );
  await page.click(".btn.btn-secondary");
  for (let i = 0; i < 46; i++) {
    await page.click(
      ".fslightbox-container.fslightbox-full-dimension.fslightbox-fade-in-strong .fslightbox-slide-btn-next-container"
    );

    await page.waitForTimeout(500);
  }
  await page.waitForTimeout(10000);
  let imgs = await page.evaluate(() => {
    let temp = Array.from(document.querySelectorAll(".fslightbox-source img"));
    let images = [];
    temp.forEach((e) => {
      try {
        images.push(e.src);
      } catch (error) {}
    });
    return images;
  });
  imgs = [...new Set(imgs)];
  data[0].images = imgs;
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
  try {
    await visit_each(
      "https://www.exclusive-links.com/buy-property-in-uae/uae-area-guides/difc-area-guide",
      page
    );
  } catch (error) {
    try {
      await visit_each(
        "https://www.exclusive-links.com/buy-property-in-uae/uae-area-guides/difc-area-guide",
        page
      );
    } catch (err) {
      try {
        await visit_each(
          "https://www.exclusive-links.com/buy-property-in-uae/uae-area-guides/difc-area-guide",
          page
        );
      } catch (error) {
        console.error(error);
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
