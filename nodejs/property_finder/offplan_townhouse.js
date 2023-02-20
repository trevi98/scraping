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
    path: `${directory}/offplan_townhouse${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "images", title: "images" },
      { id: "developer", title: "developer" },
      { id: "Completion", title: "Completion" },
      { id: "price", title: "price" },
      { id: "per_Price", title: "per_Price" },
      { id: "Status", title: "Status" },
      { id: "Bedrooms", title: "Bedrooms" },
      { id: "Total_units", title: "Total_units" },
      { id: "handover", title: "handover" },
      { id: "location", title: "location" },
      { id: "description", title: "description" },
      { id: "amenities", title: "amenities" },
      { id: "payment_plan", title: "payment_plan" },
      { id: "floor_plan", title: "floor_plan" },
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

let csvErrr = csv_error_handler("offplan_townhouse");
let csvWriter = csv_handler("offplan_townhouse", 1);
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
        title = clean(document.title.split("|")[0]);
      } catch (error) {
        title = clean(document.title);
      }
      let images = [];
      let temp = Array.from(document.querySelectorAll("._1rJE5wS3 img"));
      temp.forEach((e) => {
        try {
          images.push(e.src);
        } catch (error) {}
      });
      let development = "";
      try {
        development = clean(document.querySelector("._1KmX3mFx").textContent);
      } catch (error) {}
      let Completion = "";
      try {
        Completion = clean(
          document.querySelectorAll("._2n1p1Fk3 li")[1].textContent
        );
      } catch (error) {}
      let price = "";
      try {
        price = clean(document.querySelector("._2zZtS67d").textContent);
      } catch (error) {}
      temp = Array.from(document.querySelectorAll("._1-jqWgJk"));
      let per_Price = "";
      let Status = "";
      let handover = "";
      let Total_units = "";
      let Bedrooms = "";
      let key = "";
      let valeu = "";
      temp.forEach((e) => {
        try {
          key = e.querySelector("._1EKHXI5l").textContent;
        } catch (error) {}
        try {
          valeu = clean(e.querySelector("._1-htALWL").textContent);
        } catch (error) {}
        if (!price && /price from/i.test(key)) {
          price = valeu;
        }
        if (/price per/i.test(key)) {
          per_Price = valeu;
        }
        if (/Delivery Date/i.test(key)) {
          handover = valeu;
        }
        if (/Status/i.test(key)) {
          Status = valeu;
        }
        if (/Total units/i.test(key)) {
          Total_units = valeu;
        }
        if (/Bedrooms/i.test(key)) {
          Bedrooms = valeu;
        }
      });
      let location = "";
      try {
        location = clean(document.querySelector("._3XeJbDEl").textContent);
      } catch (error) {}
      let description = "";
      try {
        description = clean(document.querySelector("._3RInl69y").textContent);
      } catch (error) {}
      let amenities = [];
      temp = Array.from(document.querySelectorAll(".tFA-5K61"));
      temp.forEach((e) => {
        try {
          amenities.push(clean(e.textContent));
        } catch (error) {}
      });
      let payment_plan = [];
      temp = Array.from(document.querySelectorAll("._1Eg1bPle"));
      temp.forEach((e) => {
        try {
          payment_plan.push(clean(e.textContent));
        } catch (error) {}
      });
      return {
        title: title,
        images: images,
        developer: development,
        Completion: Completion,
        price: price,
        per_Price: per_Price,
        Status: Status,
        Bedrooms: Bedrooms,
        Total_units: Total_units,
        handover: handover,
        location: location,
        description: description,
        amenities: amenities,
        payment_plan: payment_plan,
        signaturea: Date.now(),
      };
    })
  );
  const exists = await page.evaluate(() => {
    return document.querySelector(".hKLeOaZw") !== null;
  });
  let floor_plan = [];
  if (exists) {
    await page.click(".hKLeOaZw");
    let number = await page.evaluate(() => {
      let number = document.querySelector("._1NQKGfgH").textContent;
      return number.match(/(\d+)/)[0];
    });
    let one = "";
    for (let i = 0; i < number - 1; i++) {
      await page.click("._2QSr25U5._3FXKQtgy .Gyj5GDoE._1aq7zO-I");
      await page.waitForTimeout(600);

      one = await page.evaluate(() => {
        if (
          document.querySelector("._1Hu9Ll0m") !== null &&
          /floorplan/i.test(document.querySelector("._1Hu9Ll0m").src)
        ) {
          let title = "";
          try {
            title = document.querySelector("._1F-XLCtc").textContent;
          } catch (error) {}
          let temp = Array.from(
            document.querySelectorAll(
              "._3lqkaot7.SuVNGgcu._1KmjrEtq p:not(._1F-XLCtc)"
            )
          );
          let all_content = {};
          let i = 0;
          for (; i < temp.length; ) {
            try {
              all_content[temp[i].textContent] = temp[i + 1].textContent;
            } catch (error) {}
            i += 2;
          }
          let img = "";
          try {
            img = document.querySelector("._1Hu9Ll0m").src;
          } catch (error) {}
          return {
            title: title,
            all_content: all_content,
            img: img,
          };
        }
      });
      if (one) floor_plan.push(JSON.stringify(one));
    }
  } else {
    console.log("no");
  }
  data[0].floor_plan = floor_plan;

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("offplan_townhouse", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://www.propertyfinder.ae/en/new-projects?page=${i}&property_type[]=8&sort=-featured`;

  console.log(target);
  await page.goto(target);
  const links = await page.evaluate(() => {
    let all = [];
    let link = Array.from(document.querySelectorAll("a._3CeWVKEE"));
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
  // let plans_data = {};
  for (let i = 1; i <= 20; i++) {
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
