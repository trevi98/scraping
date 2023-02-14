const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/offplan_Damac_Properties${batch}.csv`,
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

let csvErrr = csv_error_handler("offplan_Damac_Properties");
let csvWriter = csv_handler("offplan_Damac_Properties", 1);
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

      let title = document.title;
      let temp = Array.from(
        document.querySelectorAll(
          "div.wpb_column.vc_column_container.vc_col-sm-6 div.vc_column-inner div.wpb_wrapper div.wpb_text_column.wpb_content_element div.wpb_wrapper div.table-responsive table#datatable1 tbody td "
        )
      );
      let Down_Payment = "";
      let Location = "";
      let Bedrooms = "";
      let Type = "";
      let Area = "";
      let Completion = "";
      let Starting_Price = "";
      let Community = "";
      for (let i = 0; i < temp.length; i++) {
        if (/Down Payment/i.test(temp[i].textContent)) {
          Down_Payment = temp[i + 1].textContent;
        }
        if (/Location/i.test(temp[i].textContent)) {
          Location = temp[i + 1].textContent;
        }
        if (/Bedrooms/i.test(temp[i].textContent)) {
          Bedrooms = temp[i + 1].textContent;
        }
        if (/Area/i.test(temp[i].textContent)) {
          Area = temp[i + 1].textContent;
        }
        if (/Type/i.test(temp[i].textContent)) {
          Type = temp[i + 1].textContent;
        }
        if (/Completion/i.test(temp[i].textContent)) {
          Completion = temp[i + 1].textContent;
        }
        if (/price/i.test(temp[i].textContent)) {
          Starting_Price = temp[i + 1].textContent;
        }
        if (/Community/i.test(temp[i].textContent)) {
          Community = temp[i + 1].textContent;
        }
      }
      let Investment = [];
      let Exclusive_Features = [];
      let Unit_Sizes = [];
      let Overview = "";
      let Payment_Plan = [];
      let Interiors = "";
      let Location_Map = "";
      let Image_location_map = "";
      let handover = "";
      let floor_plan_images = [];
      let Amenities_description = "";
      let Amenities_List = [];
      let images = [];
      let video = "";
      let temp1, temp2;
      temp = Array.from(document.querySelectorAll("div.wpb_wrapper"));
      temp.forEach((e) => {
        if (e.querySelector("h3") !== null) {
          if (
            /Investment/i.test(e.querySelector("h3").textContent) ||
            /Investment/i.test(e.querySelector("h2").textContent)
          ) {
            temp1 = e.querySelector(
              "div.wpb_text_column.wpb_content_element div.wpb_wrapper ul"
            );
            temp2 = Array.from(temp1.querySelectorAll("li"));
            temp2.forEach((e) => Investment.push(clean(e.textContent)));
          }
          if (
            /Exclusive Features/i.test(e.querySelector("h3").textContent) ||
            /Exclusive Features/i.test(e.querySelector("h2").textContent)
          ) {
            temp1 = e.querySelector(
              "div.wpb_text_column.wpb_content_element div.wpb_wrapper ul"
            );
            temp2 = Array.from(temp1.querySelectorAll("li"));
            temp2.forEach((e) => Exclusive_Features.push(clean(e.textContent)));
          }
          if (
            /Unit Sizes/i.test(e.querySelector("h3").textContent) ||
            /Unit Sizes/i.test(e.querySelector("h3").textContent)
          ) {
            temp1 = e.querySelector(
              "div.wpb_text_column.wpb_content_element div.wpb_wrapper"
            );
            temp2 = Array.from(temp1.querySelectorAll("p"));
            temp2.forEach((e) => Unit_Sizes.push(clean(e.textContent)));
          }
          if (
            /Overview/i.test(e.querySelector("h3").textContent) ||
            /Overview/i.test(e.querySelector("h3").textContent)
          ) {
            Overview = clean(
              e.querySelector(
                "div.wpb_text_column.wpb_content_element div.wpb_wrapper"
              ).textContent
            );
          }
          if (
            /Gallery/i.test(e.querySelector("h3").textContent) ||
            /Gallery/i.test(e.querySelector("h3").textContent)
          ) {
            temp1 = Array.from(
              e.querySelectorAll(
                "div.vc_grid-container-wrapper.vc_clearfix img"
              )
            );
            temp1.forEach((e) => images.push(e.src));
          }
          if (
            /video/i.test(e.querySelector("h3").textContent) ||
            /video/i.test(e.querySelector("h3").textContent)
          ) {
            try {
              video = e.querySelector(
                "div.fluid-width-video-wrapper iframe"
              ).src;
            } catch (error) {}
          }
          if (
            /Payment Plan/i.test(e.querySelector("h3").textContent) ||
            /Payment Plan/i.test(e.querySelector("h3").textContent)
          ) {
            if (
              e.querySelector(
                "div.wpb_text_column.wpb_content_element div.wpb_wrapper ul"
              ) !== null
            ) {
              temp1 = e.querySelector(
                "div.wpb_text_column.wpb_content_element div.wpb_wrapper ul"
              );
              temp2 = Array.from(temp1.querySelectorAll("li"));
              temp2.forEach((e) => Payment_Plan.push(clean(e.textContent)));
              temp = Array.from(
                e.querySelectorAll(
                  "div.wpb_text_column.wpb_content_element div.wpb_wrapper ul li"
                )
              );
              temp.forEach((e) => {
                if (/Handover/i.test(e.textContent)) {
                  handover = e.textContent.replaceAll("Handover:", "").trim();
                }
              });
            } else {
              temp = Array.from(document.querySelectorAll("div.payment-plan"));
              temp.forEach((e) => Payment_Plan.push(clean(e.textContent)));
            }
          }
          if (
            /Interiors/i.test(e.querySelector("h3").textContent) ||
            /Interiors/i.test(e.querySelector("h3").textContent)
          ) {
            Interiors = clean(
              e.querySelector(
                "div.wpb_text_column.wpb_content_element div.wpb_wrapper"
              ).textContent
            );
          }
          if (
            /Amenities/i.test(e.querySelector("h3").textContent) ||
            /Amenities/i.test(e.querySelector("h3").textContent)
          ) {
            Amenities_description = clean(
              e.querySelector(
                "div.wpb_text_column.wpb_content_element div.wpb_wrapper"
              ).textContent
            );
          }
          if (
            /Floor/i.test(e.querySelector("h3").textContent) ||
            /Floor/i.test(e.querySelector("h3").textContent)
          ) {
            let images = Array.from(e.querySelectorAll("img"));
            images.forEach((e) => {
              floor_plan_images.push(e.src);
            });
            floor_plan_images = [...new Set(floor_plan_images)];
          }
        }
      });
      Location_Map = "";
      temp = Array.from(
        document.querySelectorAll(
          "div#locationmap div.wpb_column.vc_column_container"
        )
      );
      temp.forEach((e) => {
        Location_Map += clean(e.textContent);
      });
      try {
        Image_location_map = document.querySelector(
          "div#locationmap div.wpb_column.vc_column_container img"
        ).src;
      } catch (error) {
        Image_location_map = "";
      }
      temp = Array.from(
        document.querySelectorAll("div.vc_row.wpb_row.vc_inner.vc_row-fluid")
      );
      let all = [];
      for (let i = 0; i < temp.length; i++) {
        if (
          temp[i].querySelector("h3") !== null &&
          /Amenities/i.test(temp[i].querySelector("h3").textContent)
        ) {
          all = Array.from(temp[i + 1].querySelectorAll("li"));
          break;
        }
      }
      all.forEach((e) => Amenities_List.push(clean(e.textContent)));

      return {
        title: title,
        Down_Payment: Down_Payment,
        Location: Location,
        Bedrooms: Bedrooms,
        Type: Type,
        Area: Area,
        Completion: Completion,
        Starting_Price: Starting_Price,
        Community: Community,
        Investment_Highlights: Investment,
        Exclusive_Features: Exclusive_Features,
        Unit_Sizes: Unit_Sizes,
        Overview: Overview,
        Payment_Plan: Payment_Plan,
        Interiors: Interiors,
        Amenities_description: Amenities_description,
        Amenities_List: Amenities_List,
        handover: handover,
        Location_Map: Location_Map,
        Image_location_map: Image_location_map,
        images: images,
        video: video,
        floor_plan_images: floor_plan_images,
      };
    })
  );

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("offplan_Damac_Properties", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://www.providentestate.com/dubai-offplan/dubai-developer/damac-properties/page/${i}`;
  if (i == 1) {
    target =
      "https://www.providentestate.com/dubai-offplan/dubai-developer/damac-properties";
  }
  console.log(target);
  await page.goto(target);
  const links = await page.evaluate(() => {
    let all = [];
    let link = Array.from(
      document.querySelectorAll(
        "div.iw-isotope-main.isotope div.col-md-4.col-sm-6.col-xs-12.element-item article div.post-item.post_bg"
      )
    );
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
  for (let i = 1; i <= 3; i++) {
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
