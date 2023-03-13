const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");
const axios = require("axios");
const { exec } = require("child_process");
function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/offplan_binaya${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "Property_Type", title: "Property_Type" },
      { id: "Payment_Plan", title: "Payment_Plan" },
      { id: "Developer", title: "Developer" },
      { id: "Unit_Type", title: "Unit_Type" },
      { id: "Size", title: "Size" },
      { id: "Area", title: "Area" },
      { id: "Starting_Price", title: "Starting_Price" },
      { id: "Title_type", title: "Title_type" },
      { id: "Downpayment", title: "Downpayment" },
      { id: "Completion_date", title: "Completion_date" },
      { id: "about", title: "about" },
      { id: "Amenities_description", title: "Amenities_description" },
      { id: "Amenities_list", title: "Amenities_list" },
      { id: "attractions", title: "attractions" },
      { id: "type_size", title: "type_size" },
      { id: "Payment_Plan_list", title: "Payment_Plan_list" },
      { id: "video", title: "video" },
      { id: "floor_plans", title: "floor_plans" },
      { id: "location_map", title: "location_map" },
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

let csvErrr = csv_error_handler("offplan_binaya");
let csvWriter = csv_handler("offplan_binaya", 1);
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
      let temp = Array.from(
        document.querySelectorAll("div#property-address-wrap ul li")
      );
      let Property_Type = "";
      let Payment_Plan = "";
      let Developer = "";
      let Unit_Type = "";
      let Size = "";
      let Area = "";
      let Starting_Price = "";
      let Title_type = "";
      let Downpayment = "";
      let Completion_date = "";
      for (let i = 0; i < temp.length; i++) {
        let temp1 = clean(temp[i].querySelector("strong").textContent);
        if (/Property Type/i.test(temp1)) {
          Property_Type = clean(temp[i].querySelector("span").textContent);
        }
        if (/Payment Plan/i.test(temp1)) {
          Payment_Plan = clean(temp[i].querySelector("span").textContent);
        }
        if (/Developer/i.test(temp1)) {
          Developer = clean(temp[i].querySelector("span").textContent);
        }
        if (/Unit Type/i.test(temp1)) {
          Unit_Type = clean(temp[i].querySelector("span").textContent);
        }
        if (/Size/i.test(temp1)) {
          Size = clean(temp[i].querySelector("span").textContent);
        }
        if (/Area/i.test(temp1)) {
          Area = clean(temp[i].querySelector("span").textContent);
        }
        if (/Price/i.test(temp1)) {
          Starting_Price = clean(temp[i].querySelector("span").textContent);
        }
        if (/Title type/i.test(temp1)) {
          Title_type = clean(temp[i].querySelector("span").textContent);
        }
        if (/Downpayment/i.test(temp1)) {
          Downpayment = clean(temp[i].querySelector("span").textContent);
        }
        if (/Completion date/i.test(temp1)) {
          Completion_date = clean(temp[i].querySelector("span").textContent);
        }
      }
      let about = "";
      let Amenities_description = "";
      let Amenities_list = [];
      try {
        about = clean(
          document.querySelectorAll(
            ".wpb_text_column.wpb_content_element .wpb_wrapper"
          )[2].textContent
        );
      } catch (error) {}
      temp = Array.from(
        document.querySelectorAll(
          ".vc_row.wpb_row.vc_inner.vc_row-fluid.lists li"
        )
      );
      temp.forEach((e) => {
        try {
          Amenities_list.push(clean(e.textContent));
        } catch (error) {}
      });
      temp = document.querySelectorAll(
        "div.wpb_column.vc_column_container.vc_col-sm-3 div.wpb_single_image.wpb_content_element.vc_align_center + div.wpb_text_column.wpb_content_element strong"
      );
      let attractions = [];
      temp.forEach((e) => {
        try {
          attractions.push(clean(e.textContent));
        } catch (error) {}
      });
      if (
        document.querySelector(
          ".wpb_text_column.wpb_content_element + .wpb_row.vc_inner.vc_row-fluid.lists"
        ) !== null ||
        /amenities/i.test(
          document.querySelectorAll(
            ".wpb_text_column.wpb_content_element .wpb_wrapper"
          )[3].textContent
        )
      ) {
        try {
          Amenities_description = clean(
            document.querySelectorAll(
              ".wpb_text_column.wpb_content_element .wpb_wrapper"
            )[3].textContent
          );
        } catch (error) {}
      }
      let video = "";
      try {
        video = clean(
          document
            .querySelector("div.rll-youtube-player")
            .getAttribute("data-src")
        );
      } catch (error) {}
      temp = Array.from(
        document.querySelectorAll(
          "div.wpb_text_column.wpb_content_element.bedroom div.wpb_wrapper"
        )
      );
      let type_size = [];
      temp.forEach((e) => {
        try {
          type_size.push(clean(e.textContent));
        } catch (error) {}
      });
      let Payment_Plan_list = [];
      temp = Array.from(document.querySelectorAll(".paymentplan"));
      temp.forEach((e) => {
        try {
          Payment_Plan_list.push(clean(e.textContent));
        } catch (error) {}
      });
      // temp = document.querySelectorAll(".vc_row.wpb_row.vc_row-fluid")[4];
      // let all = Array.from(temp.querySelectorAll(">*"));
      // let s = [];
      // all.forEach((e) => s.push());
      temp = Array.from(document.querySelectorAll(".wpb_wrapper"));
      let floor_plans = {};
      let all_floor_plans = [];
      let s = 0;
      for (let i = 0; i < temp.length; i++) {
        if (
          temp[i].querySelector(".wpb_heading.wpb_singleimage_heading") !== null
        ) {
          s++;
          if (s > 1) {
            try {
              floor_plans[clean(temp[i].textContent)] =
                temp[i].querySelector("figure a").href;
            } catch (error) {}
          }
        }
      }
      all_floor_plans.push(JSON.stringify(floor_plans));
      let location_map = "";
      temp = Array.from(
        document.querySelectorAll(
          ".wpb_single_image.wpb_content_element.vc_align_center a"
        )
      );
      temp.forEach((e) => {
        if (/locationmap/i.test(e.href)) {
          location_map = clean(e.href);
        }
      });
      if (!location_map) {
        temp = document.querySelectorAll(".mega_wrap img");
        temp.forEach((e) => {
          try {
            location_map = e.getAttribute("data-src");
          } catch (error) {}
        });
      }
      return {
        title: title,
        Property_Type: Property_Type,
        Payment_Plan: Payment_Plan,
        Developer: Developer,
        Unit_Type: Unit_Type,
        Size: Size,
        Area: Area,
        Starting_Price: Starting_Price,
        Title_type: Title_type,
        Downpayment: Downpayment,
        Completion_date: Completion_date,
        about: about,
        Amenities_description: Amenities_description,
        Amenities_list: Amenities_list,
        attractions: attractions,
        type_size: type_size,
        Payment_Plan_list: Payment_Plan_list,
        video: video,
        floor_plans: all_floor_plans,
        location_map: location_map,
        signaturea: Date.now(),
      };
    })
  );
  const exist = await page.evaluate(() => {
    return (
      document.querySelector(".vc_grid-container-wrapper.vc_clearfix") !== null
    );
  });
  let images;
  if (exist) {
    await page.keyboard.down("End");
    await page.waitForTimeout(1000);
    await page.keyboard.down("Home");
    await page.waitForTimeout(5000);

    images = await page.evaluate(() => {
      let imgs = [];
      temp = Array.from(
        document.querySelectorAll(
          ".vc_gitem-link.prettyphoto.vc-zone-link.vc-prettyphoto-link"
        )
      );
      temp.forEach((e) => {
        try {
          imgs.push(e.href);
        } catch (error) {}
      });
      return imgs;
    });
    data[0].images = images;
    console.log(images);
    console.log(images.length);
  } else {
    console.log("no imgs");
  }
  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("offplan_binaya", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://www.binayah.com/off-plan-properties-dubai/`;
  if (i == 1) {
    target = "https://www.binayah.com/off-plan-properties-dubai/";
  }
  console.log(target);
  await page.goto(target);
  const links = await page.evaluate(() => {
    let all = [];
    let link = Array.from(
      document.querySelectorAll(".listing-featured-thumb ")
    );
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

    // if (
    //   links.indexOf(link) === 0 ||
    //   (links.indexOf(link) + 1) % 20 == 0 ||
    //   links.indexOf(link) === links.length - 1
    // ) {
    //   const message = `Done - offplan_binaya  ${links.indexOf(link) + 1} done`;

    //   const url = "https://profoundproject.com/tele/";

    //   axios
    //     .get(url, {
    //       params: {
    //         message: message,
    //       },
    //     })
    //     .then((response) => {
    //       console.log(response.data);
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
    //   if (links.indexOf(link) === links.length - 1) {
    //     exec("pm2 stop main_binayah", (error, stdout, stderr) => {
    //       if (error) {
    //         console.error(`Error executing command: ${error}`);
    //         return;
    //       }

    //       console.log(`stdout: ${stdout}`);
    //       console.error(`stderr: ${stderr}`);
    //     });
    //   }
    // }
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
