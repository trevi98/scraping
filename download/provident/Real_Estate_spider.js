const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");
const axios = require("axios");
const { exec } = require("child_process");
const { arrayBuffer, json } = require("stream/consumers");
function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/Real_Estate_spider_prov${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "all", title: "all" },
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

let csvErrr = csv_error_handler("Real_Estate_spider_prov");
let csvWriter = csv_handler("Real_Estate_spider_prov", 1);
let batch = 0;
let j = 0;
let main_err_record = 0;
let visit_err_record = 0;

async function visit_each(link, page) {
  // await page.setCacheEnabled(false);
  let data = [];
  data.push({
    title: link.title,
    all: link.all,
  });

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("Real_Estate_spider_prov", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://www.providentestate.com/partial-ownership-real-estate.html`;
  console.log(target);
  await page.goto(target);
  const content = await page.evaluate(() => {
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
    let all = [];
    let all_ = {};
    all_[clean(document.querySelector(".title.title1.orange").textContent)] =
      clean(document.querySelector(".blue.baner-p").textContent);
    all_[clean(document.querySelector(".title.blue").textContent)] = clean(
      document.querySelectorAll(".blue.baner-p")[1].textContent
    );
    all_[
      clean(document.querySelector("h2.vc_custom_heading.pad").textContent)
    ] = clean(
      document.querySelectorAll(
        ".wpb_text_column.wpb_content_element.txtDes.baner-text p"
      )[4].textContent
    );
    let temp = Array.from(
      document.querySelectorAll(
        ".wpb_single_image.wpb_content_element.vc_align_center + h4.vc_custom_heading"
      )
    );
    let des = [];

    temp.forEach((e) => {
      try {
        des.push(clean(e.textContent));
      } catch (error) {}
    });
    all_[
      clean(document.querySelectorAll("h2.vc_custom_heading")[1].textContent)
    ] = des;
    temp = document.querySelector(
      ".wpb_text_column.wpb_content_element.txtDes.baner-text .wpb_wrapper ul"
    );
    let temp1 = Array.from((d = temp.querySelectorAll("span")));
    let des1 = [];
    temp1.forEach((e) => {
      try {
        des1.push(clean(e.textContent));
      } catch (error) {}
    });
    all_[
      clean(document.querySelectorAll("h2.vc_custom_heading")[2].textContent)
    ] = des1;
    temp = Array.from(
      document.querySelectorAll(
        ".vc_hidden-sm.vc_hidden-xs .vc_column-inner  h3.vc_custom_heading.process_text"
      )
    );
    des = [];
    temp.forEach((e) => {
      try {
        des.push(clean(e.textContent));
      } catch (error) {}
    });
    all_[
      clean(document.querySelectorAll("h2.vc_custom_heading")[3].textContent)
    ] = des;
    all_[
      clean(document.querySelectorAll("h2.vc_custom_heading")[5].textContent)
    ] = clean(document.querySelectorAll("h2.vc_custom_heading")[6].textContent);
    all.push(JSON.stringify(all_));
    // let description = "";
    // try {
    //   description = clean(
    //     document.querySelector("p.vc_custom_heading").textContent
    //   );
    //   description += clean(
    //     document.querySelector("h4.vc_custom_heading").textContent
    //   );
    // } catch (error) {}
    // let temp = Array.from(
    //   document.querySelectorAll(".wpb_text_column.wpb_content_element ")
    // );
    // let temp1 = Array.from(
    //   document.querySelectorAll("h2.vc_custom_heading.font-bold")
    // );
    // let services = [];
    // let services_ = {};
    // for (let i = 0; i < temp1.length; i++) {
    //   services_[clean(temp1[i].textContent)] = clean(temp[i].textContent);
    // }
    // services.push(JSON.stringify(services_));
    // let brochure = document.querySelector(
    //   "a.vc_general.vc_btn3.vc_btn3-size-lg.vc_btn3-shape-round.vc_btn3-style-custom.vc_btn3-icon-left"
    // ).href;
    return {
      title: title,
      all: all,
    };
  });
  console.log(content);
  await visit_each(content, page);
}

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/usr/bin/google-chrome-stable",
    args: ["--no-sandbox"],
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
