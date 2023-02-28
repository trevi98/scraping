const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/rent${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "type", title: "type" },
      { id: "area", title: "area" },
      { id: "price", title: "price" },
      { id: "Bedroom", title: "Bedroom" },
      { id: "Bathroom", title: "Bathroom" },
      { id: "Size", title: "Size" },
      { id: "Reference", title: "Reference" },
      { id: "RERA", title: "RERA" },
      { id: "parking", title: "parking" },
      { id: "info", title: "info" },
      { id: "title_description", title: "title_description" },
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

let csvErrr = csv_error_handler("rent");
let csvWriter = csv_handler("rent", 1);
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
        title = clean(document.querySelector(".container h1").textContent);
      } catch (error) {
        try {
          title = clean(
            document.querySelector(".detail--title h1").textContent
          );
        } catch (error) {}
      }
      let type = "";
      let temp;
      temp = title.split(" ");
      for (let i = 0; i < temp.length; i++) {
        if (/in/i.test(temp[i])) {
          type = temp[i - 1];
        }
      }
      let area = "";
      try {
        area = clean(
          document.querySelectorAll(".breadcrumb-wrapper.grey-breadcrumb li")[3]
            .textContent
        );
      } catch (error) {}
      let price = "";
      try {
        price =
          clean(
            document
              .querySelector(".price-wrapper h6 ")
              .textContent.replace(
                document.querySelector(".price-wrapper h6 #currencyDropdown")
                  .textContent,
                ""
              )
          ) + " AED";
      } catch (error) {
        try {
          price = clean(
            document.querySelector(
              ".search--properties-detail .text-sm-end.text-center .d-flex.align-items-center h3"
            ).textContent
          );
        } catch (error) {}
      }
      temp = document.querySelector(".search-results ul ");
      try {
        temp = Array.from(temp.querySelectorAll("li"));
      } catch (error) {
        temp = Array.from(document.querySelectorAll(".detail-subtitle  span"));
      }
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
      let title_description = "";
      try {
        title_description = clean(
          document.querySelector(".description-section  h5").textContent
        );
      } catch (error) {}
      let description = "";
      try {
        description = clean(
          document.querySelector(".description-section  #descriptionContainer")
            .textContent
        );
      } catch (error) {
        try {
          description = clean(
            document.querySelector(".gallery--content-para").textContent
          );
        } catch (error) {}
      }
      let amenities = [];
      temp = Array.from(document.querySelectorAll(".amenities-wrapper li"));
      if (temp.length == 0)
        temp = Array.from(document.querySelectorAll(".row.mb-8 >div"));
      temp.forEach((e) => {
        try {
          amenities.push(clean(e.textContent));
        } catch (error) {}
      });
      let images = [];
      temp = Array.from(
        document.querySelectorAll(".galler-image.image-holder img")
      );
      if (temp.length == 0)
        temp = Array.from(document.querySelectorAll(".prop--gallery img"));
      temp.forEach((e) => {
        try {
          images.push(e.src);
        } catch (error) {}
      });
      images = [...new Set(images)];
      return {
        title: title,
        type: type,
        area: area,
        price: price,
        Bedroom: Bedroom,
        Bathroom: Bathroom,
        Size: Size,
        Reference: Reference,
        RERA: RERA,
        parking: parking,
        info: info,
        title_description: title_description,
        description: description,
        amenities: amenities,
        images: images,
        signaturea: Date.now(),
      };
    })
  );

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("rent", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://www.bhomes.com/en/rent?locations=uae_dubai&page=${i}`;
  if (i == 1) {
    target = "https://www.bhomes.com/en/rent?locations=uae_dubai";
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
    let link = Array.from(document.querySelectorAll(".card-wrapper.h-full a "));
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
  for (let i = 1; i <= 83; i++) {
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
