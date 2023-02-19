const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/exclusive_off_plan_projects${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "location", title: "location" },
      { id: "images", title: "images" },
      { id: "description", title: "description" },
      { id: "unit_size", title: "unit_size" },
      { id: "amenities", title: "amenities" },
      { id: "Nearby_Places", title: "Nearby_Places" },
      { id: "payment_plan", title: "payment_plan" },
      { id: "project_details", title: "project_details" },
      { id: "price", title: "price" },
      { id: "developer", title: "developer" },
      { id: "area", title: "area" },
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

let csvErrr = csv_error_handler("exclusive_off_plan_projects");
let csvWriter = csv_handler("exclusive_off_plan_projects", 1);
let batch = 0;
let j = 0;
let main_err_record = 0;
let visit_err_record = 0;

async function visit_each(link, page) {
  await page.setDefaultNavigationTimeout(80000);

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
        title = clean(document.querySelector("h1.dpx-headings").textContent);
      } catch (error) {}
      let one = "";
      let location = "";

      let temp = Array.from(
        document.querySelectorAll(".dpx-project-privileged-location-area > p")
      );
      for (let i = 0; i < temp.length - 1; i++) {
        try {
          one = clean(temp[i].textContent);
        } catch (error) {}
        if (one) location += one;
      }

      let images = [];
      temp = Array.from(document.querySelectorAll(".carousel-inner img"));
      temp.forEach((e) => {
        try {
          images.push(e.src);
        } catch (error) {}
      });
      images = [...new Set(images)];

      let unit_size = [];
      let unit_size_all = {};
      temp = Array.from(
        document.querySelectorAll(".dpx-project-unit-sizes- tr ")
      );
      temp.forEach((e) => {
        tr = Array.from(e.querySelectorAll("td"));
        let type = "";
        let size = "";
        let price = "";
        for (let i = 0; i < tr.length; i++) {
          if (i === 0) {
            try {
              type = clean(tr[i].textContent);
            } catch (error) {}
          }
          if (i === 1) {
            try {
              size = clean(tr[i].textContent);
            } catch (error) {}
          }
          if (i === 2) {
            try {
              price = clean(tr[i].textContent);
            } catch (error) {}
          }
        }
        if (!/type/i.test(type)) {
          if (price) unit_size_all[type] = [size, price];
          else {
            unit_size_all[type] = size;
          }
        }
      });
      unit_size.push(JSON.stringify(unit_size_all));

      let amenities = [];
      temp = Array.from(
        document.querySelectorAll(".dpx-project-amenities figcaption")
      );
      temp.forEach((e) => {
        try {
          amenities.push(clean(e.textContent));
        } catch (error) {}
      });
      let description = "";

      temp = Array.from(
        document.querySelectorAll(
          ".dpx-area-white.dpx-content-area.dpx-content-area-padding > p:not(.clearfix)"
        )
      );
      temp.forEach((e) => {
        try {
          one = clean(e.textContent);
        } catch (error) {}
        if (one) {
          description += one;
        }
      });

      let Nearby_Places = [];
      temp = Array.from(
        document.querySelectorAll(".dpx-project-privileged-location-area td")
      );
      temp.forEach((e) => {
        try {
          Nearby_Places.push(clean(e.textContent));
        } catch (error) {}
      });
      let all = {};
      let payment_plan = [];
      temp = Array.from(
        document.querySelectorAll(
          ".dpx-project-payment-section.dpx-area-white.dpx-content-area.dpx-content-area-padding .dpx-project-payment-box"
        )
      );
      temp.forEach((e) => {
        try {
          all[
            clean(e.querySelector(".dpx-project-payment-box-0").textContent)
          ] = [
            clean(e.querySelector(".dpx-project-payment-box-1").textContent),
            clean(e.querySelector(".dpx-project-payment-box-2").textContent),
          ];
        } catch (error) {}
      });
      payment_plan.push(JSON.stringify(all));
      project_details = [];
      temp = Array.from(
        document.querySelectorAll(
          ".dpx-area-white.dpx-content-area.dpx-content-area-padding li"
        )
      );
      let price = "";
      let developer = "";
      let area = "";
      temp.forEach((e) => {
        try {
          project_details.push(clean(e.textContent));
        } catch (error) {}
        if (/aed/i.test(e.textContent)) price = clean(e.textContent);
        if (/Locat/i.test(e.textContent)) area = clean(e.textContent);
        if (/Develop/i.test(e.textContent)) developer = clean(e.textContent);
      });
      return {
        title: title,
        location: location,
        images: images,
        description: description,
        unit_size: unit_size,
        amenities: amenities,
        Nearby_Places: Nearby_Places,
        payment_plan: payment_plan,
        project_details: project_details,
        price: price,
        developer: developer,
        area: area,
      };
    })
  );

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("exclusive_off_plan_projects", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://www.drivenproperties.com/dubai/properties-for-sale/off-plan/exclusive-projects?page=${i}`;
  if (i == 1) {
    target =
      "https://www.drivenproperties.com/dubai/properties-for-sale/off-plan/exclusive-projects";
  }
  console.log(target);
  await page.goto(target);
  const links = await page.evaluate(() => {
    let all = [];
    let link = Array.from(
      document.querySelectorAll(".dpx-projects-area.dpx-projects-area-i a ")
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
