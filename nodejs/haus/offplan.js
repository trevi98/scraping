const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/offplan_Dubai_Properties${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "Down_Payment", title: "Down_Payment" },
      { id: "Location", title: "Location" },
      { id: "Bedrooms", title: "Bedrooms" },
      { id: "Type", title: "Type" },
      { id: "Area", title: "Area" },
      { id: "Completion", title: "Completion" },
      { id: "Starting_Price", title: "Starting_Price" },
      { id: "Community", title: "Community" },
      { id: "Investment_Highlights", title: "Investment_Highlights" },
      { id: "Exclusive_Features", title: "Exclusive_Features" },
      { id: "Unit_Sizes", title: "Unit_Sizes" },
      { id: "Overview", title: "Overview" },
      { id: "Payment_Plan", title: "Payment_Plan" },
      { id: "Interiors", title: "Interiors" },
      { id: "Amenities_description", title: "Amenities_description" },
      { id: "Amenities_List", title: "Amenities_List" },
      { id: "handover", title: "handover" },
      { id: "Location_Map", title: "Location_Map" },
      { id: "Image_location_map", title: "Image_location_map" },
      { id: "images", title: "images" },
      { id: "video", title: "video" },
      { id: "floor_plan_images", title: "floor_plan_images" },
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

let csvErrr = csv_error_handler("offplan_Dubai_Properties");
let csvWriter = csv_handler("offplan_Dubai_Properties", 1);
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

      let title = document.querySelector(
        "div.intro-content div.titile"
      ).textContent;
      let overview = "";
      try {
        overview = document.querySelector(
          "div.main section.section-developments-details div.section-body section.section-header div.container header p"
        ).innerHTML;
      } catch (error) {
        overview = "";
      }
      let project_title = document.querySelector(".project-title").textContent;
      let brochure = "";
      let check_brochure = Array.from(
        document.querySelectorAll(
          "div.main section.section-developments-details div.section-body section.section-header div.container header div.btn-group a"
        )
      );
      check_brochure.forEach((e) => {
        if (e.textContent.includes("Brochure")) {
          brochure = e.href;
        }
      });
      let floor_plan_link = "";
      let check_floor_plan_link = Array.from(
        document.querySelectorAll(
          "section.btns-tab div.btn-group ul.list-inline.btnulli li a"
        )
      );
      check_floor_plan_link.forEach((e) => {
        if (e.textContent.includes("Floor")) {
          floor_plan_link = e.href;
        }
      });
      let Location = document
        .querySelector(
          "section.details.clearfix div.row.wrapper div.col-xs-12.contents div.item-details div.item-location"
        )
        .textContent.split(":")[1];
      let developer = document
        .querySelector(
          "section.details.clearfix div.row.wrapper div.col-xs-12.contents div.item-details div.item-developer"
        )
        .textContent.split(":")[1];
      let develpment_type = document
        .querySelector(
          "section.details.clearfix div.row.wrapper div.col-xs-12.contents div.item-details div.item-building"
        )
        .textContent.split(":")[1];
      let completion_date = document
        .querySelector(
          "section.details.clearfix div.row.wrapper div.col-xs-12.contents div.item-details div.item-date"
        )
        .textContent.split(":")[1];
      let price = document
        .querySelector(
          "section.details.clearfix div.row.wrapper div.col-xs-12.contents div.item-details div.item-price"
        )
        .textContent.split(":")[1];
      let images = [];
      let temp = Array.from(
        document.querySelectorAll(
          "section.section-developments-details div.section-body div.section-slider div.container div.prop-slider-wrapper.prop-slider div.slider.slider-developments-details img"
        )
      );
      temp.forEach((e) => images.push(e.src));
      images = [...new Set(images)];
      let Payment_Plan = [];
      temp = Array.from(
        document.querySelectorAll("ul.payment-list.list-inline li")
      );

      temp.forEach((e) => {
        Payment_Plan.push(e.textContent);
      });

      return {
        title: title,
        project_title: project_title,
        overview: overview,
        brochure: brochure,
        floor_plan_link: floor_plan_link,
        price: price,
        Location: Location,
        completion_date: completion_date,
        developer: developer,
        develpment_type: develpment_type,
        images: images,
        Payment_Plan: Payment_Plan,
      };
    })
  );

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("offplan_Dubai_Properties", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://www.providentestate.com/dubai-offplan/dubai-developer/dubai-properties/page-${i}`;
  if (i == 1) {
    target =
      "https://www.providentestate.com/dubai-offplan/dubai-developer/dubai-properties";
  }
  console.log(target);
  await page.goto(target);
  const links = await page.evaluate(() => {
    let all = [];
    let link = Array.from(
      document.querySelectorAll(
        "div.card.card-primary.property.results-property div.col-sm-6.col-xs-12.card-content.box.box-2 div.content-wrapper a.btn.btn-black.btn-details.btn-animate"
      )
    );
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
  // let plans_data = {};
  for (let i = 1; i <= 23; i++) {
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
