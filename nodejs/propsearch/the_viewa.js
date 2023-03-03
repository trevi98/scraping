const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/the_viewa${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "area", title: "area" },
      { id: "overview", title: "overview" },
      { id: "guide", title: "guide" },
      { id: "Commute_times_by_car", title: "Commute_times_by_car" },
      { id: "Airport_proximity", title: "Airport_proximity" },
      { id: "Road_access", title: "Road_access" },
      { id: "amenities", title: "amenities" },
      { id: "LOCAL_SHOPS_AND_OUTLETS", title: "LOCAL_SHOPS_AND_OUTLETS" },
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

let csvErrr = csv_error_handler("the_viewa");
let csvWriter = csv_handler("the_viewa", 1);
let batch = 0;
let j = 0;
let main_err_record = 0;
let visit_err_record = 0;

async function visit_each(link, page) {
  // await page.setCacheEnabled(false);
  await page.goto(link);
  console.log(link);
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
      let title = "The Views";

      let area = "";
      try {
        area = clean(
          document.querySelectorAll(
            "#section-overview +.ps-indent .mb-8.ps-prose a"
          )[0].textContent
        );
      } catch (error) {}
      let overview = "";
      try {
        overview = clean(
          document.querySelectorAll(
            "#section-overview +.ps-indent .mb-8.ps-prose"
          )[1].textContent
        );
      } catch (error) {}
      let guide = "";
      try {
        guide = clean(
          document.querySelector(
            "#section-overview +.ps-indent .my-4 ~.ps-prose"
          ).textContent
        );
      } catch (error) {}
      let images = [];
      let temp = Array.from(document.querySelectorAll("img.h-full"));
      temp.forEach((e) => {
        try {
          images.push(clean(e.src));
        } catch (error) {}
      });
      let Commute_times_by_car = clean(
        document.querySelector(
          "#section-transport-access+.ps-crosshead +.ps-indent p"
        ).textContent
      );
      let Airport_proximity = clean(
        document.querySelectorAll(
          "#section-transport-access+.ps-crosshead +.ps-indent p"
        )[1].textContent
      );
      let Road_access = "";
      temp = Array.from(
        document.querySelectorAll(
          "#section-transport-access+.ps-crosshead +.ps-indent p"
        )
      );
      for (let i = 2; i < temp.length; i++) {
        Road_access += clean(temp[i].textContent);
      }
      let amenities = clean(
        document.querySelector("#section-amenities + .ps-indent+.ps-indent")
          .textContent
      );
      let LOCAL_SHOPS_AND_OUTLETS = clean(
        document.querySelectorAll(".ps-indent")[9].textContent
      );

      return {
        title: title,
        area: area,
        overview: overview,
        guide: guide,
        images: images,
        Commute_times_by_car: Commute_times_by_car,
        Airport_proximity: Airport_proximity,
        Road_access: Road_access,
        amenities: amenities,
        LOCAL_SHOPS_AND_OUTLETS: LOCAL_SHOPS_AND_OUTLETS,
        signaturea: Date.now(),
      };
    })
  );
  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("the_viewa", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let link = `https://propsearch.ae/dubai/the-views`;

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
