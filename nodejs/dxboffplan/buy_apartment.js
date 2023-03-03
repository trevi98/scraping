const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/buy_apartment${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "developer", title: "developer" },
      { id: "price", title: "price" },
      { id: "area", title: "area" },
      { id: "Bedrooms", title: "Bedrooms" },
      { id: "type", title: "type" },
      { id: "propery_info", title: "propery_info" },
      { id: "description", title: "description" },
      { id: "Payment_Plan", title: "Payment_Plan" },
      { id: "handover", title: "handover" },
      { id: "video", title: "video" },
      { id: "amenities", title: "amenities" },
      { id: "location", title: "location" },
      { id: "nearby_places", title: "nearby_places" },
      { id: "images", title: "images" },
      { id: "link", title: "link" },
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

let csvErrr = csv_error_handler("buy_apartment");
let csvWriter = csv_handler("buy_apartment", 1);
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
      let title = "";
      try {
        title = clean(document.title);
      } catch (error) {}
      let price = "";
      try {
        price = clean(document.querySelector(".price").textContent);
      } catch (error) {}
      let temp;
      temp = Array.from(document.querySelectorAll(".project-overview p"));
      let overview = "";
      temp.forEach((e) => {
        try {
          overview += clean(e.textContent);
        } catch (error) {}
      });
      let size = "";
      let Bedrooms = "";
      let developer = "";
      let handover = "";
      let views = "";
      let price_per = "";
      let type = "";
      let area = "";
      let developer_project = "";
      temp = Array.from(document.querySelectorAll(".single-project-meta tr"));
      temp.forEach((e) => {
        let key = "";
        let value = "";
        try {
          key = clean(e.querySelector("th").textContent);
        } catch (error) {}
        try {
          value = clean(e.querySelector("td").textContent);
        } catch (error) {}
        if (/Area from/i.test(key)) {
          size = value;
        }
        if (/bed/i.test(key)) {
          Bedrooms = value;
        }
        if (/developer/i.test(key)) {
          developer = value;
        }
        if (/completion/i.test(key)) {
          handover = value;
        }
        if (/view/i.test(key)) {
          views = value;
        }
        if (/Price Per/i.test(key)) {
          price_per = value;
        }
        if (/Type/i.test(key)) {
          type = value;
        }
        if (/Location/i.test(key)) {
          area = value;
        }
        if (/Developer Projects/i.test(key)) {
          developer_project = value;
        }
      });
      return {
        title: title,
        price: price,
        Bedrooms: Bedrooms,
        propery_info: propery_info,
        description: description,
        Payment_Plan: Payment_Plan,
        handover: handover,
        video: video,
        amenities: amenities,
        location: location,
        nearby_places: nearby_places,
        images: images,
        signaturea: Date.now(),
      };
    })
  );
  data[0].area = link.area;
  data[0].type = link.type;
  data[0].developer = link.developer;
  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("buy_apartment", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://dxboffplan.com/new/apartments-for-sale-dubai/page/${i}/`;
  if (i == 1) {
    target = "https://dxboffplan.com/new/apartments-for-sale-dubai";
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
    let link = Array.from(document.querySelectorAll(".col-md-6 .card> a"));
    link.forEach((e) => {
      let a = "";
      a = e.href;
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
  for (let i = 1; i <= 33; i++) {
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
