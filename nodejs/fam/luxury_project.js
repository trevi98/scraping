const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");
const { on } = require("events");

function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/luxury_apartments_for_sale${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "price", title: "price" },
      { id: "Lifestyle", title: "Lifestyle" },
      { id: "type", title: "type" },
      { id: "title_type", title: "title_type" },
      { id: "Completion_data", title: "Completion_data" },
      { id: "developer", title: "developer" },
      { id: "payment_plan", title: "payment_plan" },
      { id: "images", title: "images" },
      { id: "overview", title: "overview" },
      { id: "overview_img", title: "overview_img" },
      { id: "amenities", title: "amenities" },
      { id: "nearby_schools", title: "nearby_schools" },
      { id: "buildings", title: "buildings" },
      { id: "properties", title: "properties" },
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

let csvErrr = csv_error_handler("luxury_apartments_for_sale");
let csvWriter = csv_handler("luxury_apartments_for_sale", 1);
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
      let temp;
      let price = "";
      try {
        price = clean(
          document.querySelector(
            ".sub-heading.padding-top-lg.padding-bottom-lg.u-textLeft.padding-left-md"
          ).textContent
        );
        price = price.replace(price.match(/starting price/i)[0], "");
      } catch (error) {}
      let Lifestyle = "";
      let type = "";
      let title_type = "";
      let Completion_data = "";
      let developer = "";
      temp = Array.from(
        document.querySelectorAll(
          ".property-highlights.project.info-based li .highlight-option"
        )
      );
      temp.forEach((e) => {
        let key = clean(e.querySelector("span").textContent);
        let value = clean(e.textContent);
        if (/Developer/i.test(key)) {
          developer = value;
          developer = developer.replace(key, "");
        }
        if (/Lifestyle/i.test(key)) {
          Lifestyle = value;
          Lifestyle = Lifestyle.replace(key, "");
        }
        if (/Completion date/i.test(key)) {
          Completion_data = value;
          Completion_data = Completion_data.replace(key, "");
        }
        if (/Title type/i.test(key)) {
          title_type = value;
          title_type = title_type.replace(key, "");
        }
        if (/Type/i.test(key) && !/Title type/i.test(key)) {
          type = value;
          type = type.replace(key, "");
        }
      });
      let payment_plan = [];
      let payment_plan_all = {};
      temp = Array.from(
        document.querySelectorAll(
          "#report_24261508315928286013_catch li .t-Card-title"
        )
      );
      temp.forEach((e) => {
        try {
          payment_plan_all[clean(e.querySelector("h3").textContent)] = clean(
            e.querySelector("h4").textContent
          );
        } catch (error) {}
      });
      payment_plan.push(JSON.stringify(payment_plan_all));
      let images = [];
      temp = Array.from(
        document.querySelectorAll(".swiper-lazy.swiper-lazy-loaded")
      );
      temp.forEach((e) => {
        try {
          images.push(e.src);
        } catch (error) {}
      });
      images = [...new Set(images)];
      let amenities = [];
      temp = Array.from(
        document.querySelectorAll(
          "#R22528583529857287712_Cards .a-CardView-items.a-CardView-items--grid4col li"
        )
      );
      temp.forEach((e) => {
        try {
          amenities.push(clean(e.textContent));
        } catch (error) {}
      });
      let overview = "";
      try {
        overview = clean(document.querySelector("#overview").textContent);
      } catch (error) {}
      let overview_img = "";
      try {
        overview_img = document.querySelector("#overview img").src;
      } catch (error) {}
      let nearby_schools = [];
      temp = Array.from(
        document.querySelectorAll(
          "#R29114923532291890799_Cards .a-CardView-header"
        )
      );
      temp.forEach((e) => {
        try {
          nearby_schools.push(clean(e.querySelector("h3").textContent));
        } catch (error) {}
      });
      let buildings = [];
      temp = Array.from(document.querySelectorAll("#building-types_Cards li"));
      temp.forEach((e) => {
        try {
          buildings.push(clean(e.textContent));
        } catch (error) {}
      });
      let properties = [];
      temp = Array.from(
        document.querySelectorAll("#listings  .t-Report-report tbody tr")
      );
      temp.forEach((e) => {
        try {
          properties.push({
            title: clean(
              e.querySelector(
                "#listings  .t-Report-report tbody tr td[headers='TITLE'] "
              ).textContent
            ),
            type: clean(
              e.querySelector(
                "#listings  .t-Report-report tbody tr td[headers='PROPERTY'] p"
              ).textContent
            ),
            beds_baths: clean(
              e.querySelector(
                "#listings  .t-Report-report tbody tr td[headers='PROPERTY'] span"
              ).textContent
            ),
            price: clean(
              e.querySelector(
                "#listings  .t-Report-report tbody tr td[headers='PRICE'] span"
              ).textContent
            ),
            size: clean(
              e.querySelector(
                "#listings  .t-Report-report tbody tr td[headers='PRICE'] p"
              ).textContent
            ),
          });
        } catch (error) {}
      });
      return {
        title: title,
        price: price,
        Lifestyle: Lifestyle,
        type: type,
        title_type: title_type,
        Completion_data: Completion_data,
        developer: developer,
        payment_plan: payment_plan,
        images: images,
        overview: overview,
        overview_img: overview_img,
        amenities: amenities,
        nearby_schools: nearby_schools,
        buildings: buildings,
        properties: properties,
      };
    })
  );

  const backgroundImage = await page.evaluate(
    (el) => window.getComputedStyle(el).backgroundImage,
    await page.$(".main-banner.lozad")
  );
  console.log(backgroundImage.slice(5, -2));

  const exist = await page.evaluate(() => {
    return (
      document.querySelector(
        ".a-GV-pageButton.a-GV-pageButton--nav.js-pg-next"
      ) !== null
    );
  });

  let s = [];
  if (exist) {
    await page.click(".a-GV-pageButton.a-GV-pageButton--nav.js-pg-next");
    await page.waitForTimeout(500);
    s.push(
      await page.evaluate(() => {
        let temp = Array.from(
          document.querySelectorAll(
            "#R29114923532291890799_Cards .a-CardView-header"
          )
        );
        let s = [];
        temp.forEach((e) => {
          try {
            s.push(e.querySelector("h3").textContent);
          } catch (error) {}
        });
        return s;
      })
    );
    while (true) {
      // await page.click("#marquizPopup .fa.fa-times.fa-2x.closeMarquiz");
      if (
        await page.evaluate(() => {
          return (
            document
              .querySelector(".a-GV-pageButton.a-GV-pageButton--nav.js-pg-next")
              .getAttribute("disabled") !== null
          );
        })
      ) {
        break;
      }
      await page.click(".a-GV-pageButton.a-GV-pageButton--nav.js-pg-next");
      await page.waitForTimeout(2000);

      s.push(
        await page.evaluate(() => {
          let temp = Array.from(
            document.querySelectorAll(
              "#R29114923532291890799_Cards .a-CardView-header"
            )
          );
          let s = [];
          temp.forEach((e) => {
            try {
              s.push(e.querySelector("h3").textContent);
            } catch (error) {}
          });
          return s;
        })
      );
    }
  } else {
    console.log("no");
  }

  //   data[0]
  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("luxury_apartments_for_sale", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://famproperties.com/luxury-apartments-for-sale-dubai`;

  console.log(target);
  await page.goto(target);
  const links = await page.evaluate(() => {
    let all = [];
    let link = Array.from(document.querySelectorAll(".card "));
    link.forEach((e) => {
      let a = e.querySelector("a").href;
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
  // let plans_data = {};
  for (let i = 1; i <= 4000; i++) {
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
