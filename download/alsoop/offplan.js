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
    path: `${directory}/offplan_alsop${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "description", title: "description" },
      { id: "price", title: "price" },
      { id: "developer", title: "developer" },
      { id: "handover", title: "handover" },
      { id: "places_in_proximity", title: "places_in_proximity" },
      { id: "payment_plan", title: "payment_plan" },
      { id: "images", title: "images" },
      { id: "brochure", title: "brochure" },
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

let csvErrr = csv_error_handler("offplan_alsop");
let csvWriter = csv_handler("offplan_alsop", 1);
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
        title = document.title;
      } catch (error) {}
      let temp;
      let description = "";
      try {
        description = clean(
          document.querySelector(".read_more.content").textContent
        );
      } catch (error) {}
      temp = Array.from(
        document.querySelectorAll("#description .last_content div")
      );
      let price = "";
      let developer = "";
      let handover = "";
      temp.forEach((e) => {
        let key = clean(e.querySelector("span").textContent);
        let value = clean(e.querySelector("p").textContent);
        if (/price/i.test(key)) price = value;
        if (/developer/i.test(key)) developer = value;
        if (/handover/i.test(key)) handover = value;
      });
      let all_places_in_proximity = {};
      let places_in_proximity = [];
      temp = Array.from(
        document.querySelectorAll(".places_in_proximity .place_item")
      );
      temp.forEach((e) => {
        try {
          all_places_in_proximity[
            clean(e.querySelector(".place_name").textContent)
          ] = clean(document.querySelector(".distance").textContent);
        } catch (error) {}
      });
      places_in_proximity.push(JSON.stringify(all_places_in_proximity));
      let payment_plan = [];
      let all_payment_plan = {};
      temp = Array.from(
        document.querySelectorAll("#payment .detail_items .item")
      );
      temp.forEach((e) => {
        all_payment_plan[
          clean(
            e
              .querySelectorAll("div")[0]
              .textContent.replace(e.querySelector("span").textContent, "")
          )
        ] = clean(e.querySelectorAll("div")[1].textContent);
      });
      payment_plan.push(JSON.stringify(all_payment_plan));
      let brochure = "";
      try {
        brochure = document.querySelector(".brochure").parentElement.href;
      } catch (error) {}

      return {
        title: title,
        description: description,
        price: price,
        developer: developer,
        handover: handover,
        places_in_proximity: places_in_proximity,
        payment_plan: payment_plan,
        brochure: brochure,
        signaturea: Date.now(),
      };
    })
  );
  const exist_imgs = await page.evaluate(() => {
    return (
      document.querySelector(
        "#description .properties_image_slider .slick-list"
      ) !== null
    );
  });
  let images = [];
  if (exist_imgs) {
    while (true) {
      if (
        await page.evaluate(() => {
          return document
            .querySelector(
              "#description .properties_image_slider .slick-arrow.slick-next"
            )
            .classList.contains("slick-disabled");
        })
      ) {
        break;
      } else {
        await page.click(
          "#description .properties_image_slider .slick-arrow.slick-next"
        );
      }
    }
    images = await page.evaluate(() => {
      let temp = Array.from(
        document.querySelectorAll(
          "#description .properties_image_slider .slick-list img"
        )
      );
      let imgs = [];
      temp.forEach((e) => {
        try {
          imgs.push(e.src);
        } catch (error) {}
      });
      return [...new Set(imgs)];
    });
    // console.log(images);
    // console.log(images.length);
  } else {
    console.log("no imgs");
  }
  data[0].images = images;

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("offplan_alsop", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://www.allsoppandallsopp.com/dubai/buyers/off-plan?page=${i}`;
  if (i == 1) {
    target = "https://www.allsoppandallsopp.com/dubai/buyers/off-plan";
  }
  console.log(target);
  await page.goto(target);
  const links = await page.evaluate(() => {
    let all = [];
    let link = Array.from(document.querySelectorAll(".new_dev_card "));
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
  if (i == 1 || i % 20 == 0 || i == 1) {
    const message = `Done - offplan_alsop_alsop  ${i} done`;

    const url = "https://profoundproject.com/tele/";

    axios
      .get(url, {
        params: {
          message: message,
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    if (i == 1) {
      exec("pm2 stop main_alsop", (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing command: ${error}`);
          return;
        }

        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      });
    }
  }
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
