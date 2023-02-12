const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/offplan_emaar_properties${batch}.csv`,
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

let csvErrr = csv_error_handler("offplan_emaar_properties");
let csvWriter = csv_handler("offplan_emaar_properties", 1);
let batch = 0;
let j = 0;
let main_err_record = 0;
let visit_err_record = 0;

async function visit_each(link, page) {
  // await page.setCacheEnabled(false);
  await page.goto(link);
  // await page.waitForNavigation();

  // await page.click('._35b183c9._39b0d6c4');
  // const element = await page.waitForSelector('._18c28cd2._277fb980');
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
        if (temp[i].textContent.includes("Down Payment")) {
          Down_Payment = temp[i + 1].textContent;
        }
        if (temp[i].textContent.includes("Location")) {
          Location = temp[i + 1].textContent;
        }
        if (temp[i].textContent.includes("Bedrooms")) {
          Bedrooms = temp[i + 1].textContent;
        }
        if (temp[i].textContent.includes("Area")) {
          Area = temp[i + 1].textContent;
        }
        if (temp[i].textContent.includes("Type")) {
          Type = temp[i + 1].textContent;
        }
        if (temp[i].textContent.includes("Completion")) {
          Completion = temp[i + 1].textContent;
        }
        if (temp[i].textContent.includes("Price")) {
          Starting_Price = temp[i + 1].textContent;
        }
        if (temp[i].textContent.includes("Community")) {
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
          if (e.querySelector("h3").textContent.includes("Investment")) {
            temp1 = e.querySelector(
              "div.wpb_text_column.wpb_content_element div.wpb_wrapper ul"
            );
            temp2 = Array.from(temp1.querySelectorAll("li"));
            temp2.forEach((e) => Investment.push(e.textContent));
          }
          if (
            e.querySelector("h3").textContent.includes("Exclusive Features")
          ) {
            temp1 = e.querySelector(
              "div.wpb_text_column.wpb_content_element div.wpb_wrapper ul"
            );
            temp2 = Array.from(temp1.querySelectorAll("li"));
            temp2.forEach((e) => Exclusive_Features.push(e.textContent));
          }
          if (e.querySelector("h3").textContent.includes("Unit Sizes")) {
            temp1 = e.querySelector(
              "div.wpb_text_column.wpb_content_element div.wpb_wrapper"
            );
            temp2 = Array.from(temp1.querySelectorAll("p"));
            temp2.forEach((e) => Unit_Sizes.push(e.textContent));
          }
          if (e.querySelector("h3").textContent.includes("Overview")) {
            Overview = clean(
              e.querySelector(
                "div.wpb_text_column.wpb_content_element div.wpb_wrapper"
              ).textContent
            );
          }
          if (e.querySelector("h3").textContent.includes("Gallery")) {
            temp1 = Array.from(
              e.querySelectorAll(
                "div.vc_grid-container-wrapper.vc_clearfix img"
              )
            );
            temp1.forEach((e) => images.push(e.src));
          }
          if (e.querySelector("h3").textContent.includes("Video")) {
            try {
              video = e.querySelector(
                "div.fluid-width-video-wrapper iframe"
              ).src;
            } catch (error) {
              video = "";
            }
          }
          if (e.querySelector("h3").textContent.includes("Payment Plan")) {
            if (
              e.querySelector(
                "div.wpb_text_column.wpb_content_element div.wpb_wrapper ul"
              ) !== null
            ) {
              temp1 = e.querySelector(
                "div.wpb_text_column.wpb_content_element div.wpb_wrapper ul"
              );
              temp2 = Array.from(temp1.querySelectorAll("li"));
              temp2.forEach((e) => Payment_Plan.push(e.textContent));
              let temp = Array.from(
                e.querySelectorAll(
                  "div.wpb_text_column.wpb_content_element div.wpb_wrapper ul li"
                )
              );
              temp.forEach((e) => {
                if (e.textContent.includes("Handover")) {
                  handover = e.textContent.replaceAll("Handover:", "").trim();
                }
              });
            } else {
              temp = Array.from(document.querySelectorAll("div.payment-plan"));
              temp.forEach((e) => Payment_Plan.push(e.textContent));
            }
          }
          if (e.querySelector("h3").textContent.includes("Interiors")) {
            Interiors = clean(
              e.querySelector(
                "div.wpb_text_column.wpb_content_element div.wpb_wrapper"
              ).textContent
            );
          }
          if (e.querySelector("h3").textContent.includes("Amenities")) {
            try {
              Amenities_description = clean(
                e.querySelector(
                  "div.wpb_text_column.wpb_content_element div.wpb_wrapper"
                ).textContent
              );
            } catch (error) {
              Amenities_description = "";
            }
          }
          if (e.querySelector("h3").textContent.includes("Floor")) {
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
        try {
          Location_Map += e.textContent;
        } catch (error) {
          Location_Map = "";
        }
      });
      Location_Map = clean(Location_Map);
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
          temp[i].querySelector("h3").textContent.includes("Amenities")
        ) {
          all = Array.from(temp[i + 1].querySelectorAll("li"));
          break;
        }
      }
      all.forEach((e) => Amenities_List.push(e.textContent));

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
    csvWriter = csv_handler("offplan_emaar_properties", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://www.providentestate.com/dubai-offplan/dubai-developer/emaar-properties/page/${i}`;
  if (i == 1) {
    target =
      "https://www.providentestate.com/dubai-offplan/dubai-developer/emaar-properties";
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
  for (let i = 1; i <= 5; i++) {
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
