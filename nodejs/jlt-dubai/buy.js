const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/buy${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "price", title: "price" },
      { id: "size", title: "size" },
      { id: "Bedrooms", title: "Bedrooms" },
      { id: "Bathrooms", title: "Bathrooms" },
      { id: "views", title: "views" },
      { id: "Unit_Status", title: "Unit_Status" },
      { id: "type", title: "type" },
      { id: "Reference_No", title: "Reference_No" },
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

let csvErrr = csv_error_handler("buy");
let csvWriter = csv_handler("buy", 1);
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
        title = clean(document.title);
      } catch (error) {}
      let price = "";
      try {
        price = clean(document.querySelector(".price+h2").textContent);
      } catch (error) {}
      let images = [];
      let temp = Array.from(document.querySelectorAll(".img_gal img"));
      temp.forEach((e) => {
        try {
          images.push(clean(e.src));
        } catch (error) {}
      });
      images = [...new Set(images)];
      let size = "";
      let Bedrooms = "";
      let Bathrooms = "";
      let views = "";
      let Unit_Status = "";
      let type = "";
      let Reference_No = "";
      temp = Array.from(document.querySelectorAll(".newsticker.listProDet li"));
      temp.forEach((e) => {
        let key = "";
        let value = "";
        try {
          key = clean(e.querySelector("label").textContent);
        } catch (error) {}
        try {
          value = clean(e.querySelector(".labelDet").textContent);
        } catch (error) {}
        if (/Size/i.test(key)) {
          size = value;
        }
        if (/bed/i.test(key)) {
          Bedrooms = value;
        }
        if (/bath/i.test(key)) {
          Bathrooms = value;
        }
        if (/Unit Status/i.test(key)) {
          Unit_Status = value;
        }
        if (/view/i.test(key)) {
          views = value;
        }
        if (/Reference No/i.test(key)) {
          Reference_No = value;
        }
        if (/Property Type/i.test(key)) {
          type = value;
        }
        if (/Location/i.test(key)) {
          area = value;
        }
        if (/Developer Projects/i.test(key)) {
          developer_project = value;
        }
      });
      let description = "";
      try {
        description = clean(
          document.querySelector("#contentz1 .detailtext article").textContent
        );
      } catch (error) {}
      let amenities = [];
      temp = Array.from(document.querySelectorAll("#contentz2 li"));
      temp.forEach((e) => {
        try {
          amenities.push(clean(e.textContent));
        } catch (error) {}
      });
      return {
        title: title,
        price: price,
        size: size,
        Bedrooms: Bedrooms,
        Bathrooms: Bathrooms,
        views: views,
        Unit_Status: Unit_Status,
        type: type,
        Reference_No: Reference_No,
        description: description,
        amenities: amenities,
        images: images,
        signaturea: Date.now(),
      };
    })
  );

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("buy", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://www.jlt-dubai.com/jumeirah-lake-towers-property-for-sale.html`;
  console.log(target);
  await page.goto(target);
  const links = await page.evaluate(() => {
    let all = [];
    let link = Array.from(document.querySelectorAll(".viewdetail a"));
    link.forEach((e) => {
      all.push(e.href);
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
