const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/buy_luxury${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "area", title: "area" },
      { id: "price", title: "price" },
      { id: "Bedroom", title: "Bedroom" },
      { id: "Bathroom", title: "Bathroom" },
      { id: "Size", title: "Size" },
      { id: "Reference", title: "Reference" },
      { id: "RERA", title: "RERA" },
      { id: "parking", title: "parking" },
      { id: "info", title: "info" },
      { id: "description", title: "description" },
      { id: "amenities", title: "amenities" },
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

let csvErrr = csv_error_handler("buy_luxury");
let csvWriter = csv_handler("buy_luxury", 1);
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
        title = clean(document.querySelector(".detail--title h1").textContent);
      } catch (error) {}

      let temp;
      let type = "";
      temp = title.split(" ");
      for (let i = 0; i < temp.length; i++) {
        if (/\bin\b/i.test(temp[i])) {
          type = temp[i - 1];
        }
      }
      let area = "";
      try {
        area = clean(
          document.querySelectorAll(".search--detail--accordian nav li")[3]
            .textContent
        );
      } catch (error) {}
      let price = "";

      try {
        price = clean(
          document.querySelector(
            ".search--properties-detail .text-sm-end.text-center .d-flex.align-items-center h3"
          ).textContent
        );
      } catch (error) {}

      temp = Array.from(document.querySelectorAll(".detail-subtitle  span"));
      let Bedroom = "";
      let Bathroom = "";
      let Size = "";
      let Reference = "";
      let RERA = "";
      let parking = "";
      let info = [];
      temp.forEach((e) => {
        try {
          info.push(clean(e.textContent));
        } catch (error) {}
        let key = clean(e.textContent);
        if (/bed/i.test(key)) {
          Bedroom = key;
        }
        if (/bath/i.test(key)) {
          Bathroom = key;
        }
        if (/sq ft/i.test(key)) {
          Size = key;
        }
        if (/parking/i.test(key)) {
          parking = key;
        }
        if (/RERA/i.test(key)) {
          RERA = key;
        }
        if (/Ref/i.test(key)) {
          Reference = key;
        }
      });

      let description = "";

      try {
        description = clean(
          document.querySelector(".gallery--content-para").textContent
        );
      } catch (error) {}

      let amenities = [];

      temp = Array.from(document.querySelectorAll(".row.mb-8 >div"));
      temp.forEach((e) => {
        try {
          amenities.push(clean(e.textContent));
        } catch (error) {}
      });
      let images = [];
      temp = Array.from(document.querySelectorAll(".prop--gallery img"));
      temp.forEach((e) => {
        try {
          images.push(e.src);
        } catch (error) {}
      });
      images = [...new Set(images)];
      return {
        title: title,
        area: area,
        price: price,
        Bedroom: Bedroom,
        Bathroom: Bathroom,
        Size: Size,
        Reference: Reference,
        RERA: RERA,
        parking: parking,
        info: info,
        description: description,
        amenities: amenities,
        images: images,
        signaturea: Date.now(),
      };
    })
  );

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("buy_luxury", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://prime.bhomes.com/en/buy?vacant=all&country=uae&page=${i}`;
  if (i == 1) {
    target = "https://prime.bhomes.com/en/buy?vacant=all&country=uae";
  }
  console.log(target);
  await page.goto(target);
  const links = await page.evaluate(() => {
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
    let all = [];
    let link = Array.from(document.querySelectorAll(".card-img-container a"));
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
  for (let i = 1; i <= 13; i++) {
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
