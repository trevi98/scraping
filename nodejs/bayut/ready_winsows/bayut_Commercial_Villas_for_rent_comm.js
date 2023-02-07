const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");
function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/bayut_Commercial_Villas_for_rent_comm${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "description", title: "description" },
      { id: "bedrooms", title: "bedrooms" },
      { id: "bathrooms", title: "bathrooms" },
      { id: "size", title: "size" },
      { id: "area", title: "area" },
      { id: "type", title: "type" },
      { id: "date", title: "date" },
      { id: "parking", title: "parking" },
      { id: "ownership", title: "ownership" },
      { id: "completion", title: "completion" },
      { id: "developer", title: "developer" },
      { id: "furnishing", title: "furnishing" },
      { id: "built_up_area", title: "built_up_area" },
      { id: "elevators", title: "elevators" },
      { id: "number_of_parking", title: "number_of_parking" },
      { id: "number_of_appartments", title: "number_of_appartments" },
      { id: "balcony_size", title: "balcony_size" },
      { id: "category", title: "category" },
      { id: "number_of_floors", title: "number_of_floors" },
      { id: "amenities", title: "amenities" },
      { id: "totla_building_area", title: "totla_building_area" },
      { id: "imgs", title: "imgs" },
      { id: "plans_2d", title: "plans_2d" },
      { id: "plans_3d", title: "plans_3d" },
      { id: "signaturea", title: "signaturea" },
      { id: "price", title: "price" },
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

let csvErrr = csv_error_handler("bayut_Commercial_Villas_for_rent_comm");
let csvWriter = csv_handler("bayut_Commercial_Villas_for_rent_comm", 1);
let batch = 0;
let j = 0;
let main_err_record = 0;
let visit_err_record = 0;

async function clean(text) {
  try {
    return text
      .replace("\n", "")
      .replace("\r", "")
      .replace("\t", "")
      .replace("  ", "");
  } catch (error) {
    return text;
  }
}

async function visit_each(link, page) {
  await page.goto(link);
  let data = [];
  let data_plans_3d = [];
  let data_plans_2d = [];
  let btns = await page.evaluate(() => {
    let elmnts = Array.from(document.querySelectorAll("span._4b6fd844"));
    let b = [];
    elmnts.forEach((elmnt) => {
      if (elmnt.textContent.includes("3D Image")) {
        elmnt.id = "d3fd";
        b.push("d3fd");
      } else if (elmnt.textContent.includes("2D Image")) {
        elmnt.id = "d2fd";
        b.push("d2fd");
      }
    });
    return b;
  });

  let plans = {
    d3: [],
    d2: [],
  };

  if (btns.length > 0) {
    for (let btn of btns) {
      await page.click(`#${btn}`);
      const element = await page.waitForSelector("._50f15c14 img");
      if (btn == "d3fd") {
        plans.d3.push(
          await page.evaluate(() => {
            return Array.from(
              document.querySelectorAll("._50f15c14 img"),
              (img) =>
                img.src
                  .replace("\n", "")
                  .replace("\r", "")
                  .replace("\t", "")
                  .replace("  ", "")
            );
          })
        );
      } else {
        plans.d2.push(
          await page.evaluate(() => {
            return Array.from(
              document.querySelectorAll("._50f15c14 img"),
              (img) =>
                img.src
                  .replace("\n", "")
                  .replace("\r", "")
                  .replace("\t", "")
                  .replace("  ", "")
            );
          })
        );
      }
    }
  }
  if (plans.d3.length > 0) {
    data_plans_3d.push({ plans_3d: plans.d3[0] });
  }
  if (plans.d2.length > 0) {
    data_plans_2d.push({ plans_2d: plans.d2[0] });
  }

  await page.click("._35b183c9._39b0d6c4");
  const element = await page.waitForSelector("._18c28cd2._277fb980");
  data.push(
    await page.evaluate(async () => {
      function extract_pare(elmnts, key) {
        let pare = [];
        pare = elmnts.filter((elmnt) => {
          try {
            if (elmnt.includes(key)) {
              return true;
            }
          } catch (error) {}
        });
        try {
          pare = pare[0]
            .replace(key, "")
            .replace(" ", "")
            .replace("\n", "")
            .replace("\t", "")
            .replace("\r", "")
            .replace("  ", "");
          return pare;
        } catch (error) {
          return "";
        }
      }
      const images = document.querySelectorAll("._18c28cd2._277fb980 img");
      let imgs = Array.from(images, (img) =>
        img.src
          .replace("\n", "")
          .replace("\r", "")
          .replace("\t", "")
          .replace("  ", "")
      );
      let title = document
        .querySelector("h1.fcca24e0")
        .textContent.replace("\n", "")
        .replace("\r", "")
        .replace("\t", "")
        .replace("  ", "");
      let info = Array.from(
        document.querySelectorAll("div.ba1ca68e._0ee3305d"),
        (elmnt) =>
          elmnt.textContent
            .replace("\n", "")
            .replace("\r", "")
            .replace("\t", "")
            .replace("  ", "")
      );
      let bedrooms = extract_pare(info, "Beds");
      let bathrooms = extract_pare(info, "Baths");
      let size = extract_pare(info, "sqft");
      let area = Array.from(
        document.querySelectorAll("span._327a3afc"),
        (elmnt) => elmnt.textContent
      )[2]
        .replace("\n", "")
        .replace("\r", "")
        .replace("\t", "")
        .replace("  ", "");
      let price = document
        .querySelector("span._105b8a67")
        .textContent.replace("\n", "")
        .replace("\r", "")
        .replace("\t", "")
        .replace("  ", "");
      let date = document
        .querySelector("span._56562304")
        .textContent.replace("\n", "")
        .replace("\r", "")
        .replace("\t", "")
        .replace("  ", "");
      info = Array.from(document.querySelectorAll("._033281ab li"), (elmnt) =>
        elmnt.textContent
          .replace("\n", "")
          .replace("\r", "")
          .replace("\t", "")
          .replace("  ", "")
      );
      let type = extract_pare(info, "Type");
      let completion = extract_pare(info, "Completion");
      let furnishing = extract_pare(info, "Furnishing");
      let ownership = extract_pare(info, "Ownership");
      let built_up_area = extract_pare(info, "Built-up Area");
      let developer = extract_pare(info, "Developer");
      let number_of_floors = extract_pare(info, "Total Floors");
      let number_of_appartments = extract_pare(info, "Number of Apartments");
      let number_of_parking = extract_pare(info, "Total Parking Spaces");
      let parking_availability = extract_pare(info, "Parking Availability");
      let totla_building_area = extract_pare(info, "Total Building Area");
      let elevators = extract_pare(info, "Elevators");
      let balcony_size = extract_pare(info, "Balcony Size");
      let category = extract_pare(info, "Usage");
      let description = document
        .querySelector("._2015cd68.d320ecf0")
        .textContent.replace("\n", "")
        .replace("\r", "")
        .replace("\t", "")
        .replace("  ", "");
      let amenities = Array.from(
        document.querySelectorAll("div._4b64e3bd div._9676c577"),
        (elmnt) =>
          elmnt.textContent
            .replace("\n", "")
            .replace("\r", "")
            .replace("\t", "")
            .replace("  ", "")
      );

      return {
        description: description,
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        size: size,
        area: area,
        date: date,
        type: type,
        parking: parking_availability,
        ownership: ownership,
        compleation: completion,
        developer: developer,
        furnishing: furnishing,
        built_up_area: built_up_area,
        elevators: elevators,
        number_of_parking: number_of_parking,
        number_of_appartments: number_of_appartments,
        balcony_size: balcony_size,
        catrgory: category,
        amenities: amenities,
        title: title,
        number_of_floors: number_of_floors,
        totla_building_area: totla_building_area,
        imgs: imgs,
        price: price,
        signaturea: Date.now(),
      };
    })
  );

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("bayut_Commercial_Villas_for_rent_comm", batch);
  }

  data[0].plans_2d = plans.d2[0];
  data[0].plans_3d = plans.d3[0];
  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://www.bayut.com/to-rent/commercial-villas/uae/page-${i}/?rent_frequency=any`;
  if (i == 1) {
    target =
      "https://www.bayut.com/to-rent/commercial-villas/uae/?rent_frequency=any";
  }
  console.log(target);
  await page.goto(target);
  const links = await page.evaluate(() => {
    const anchors = Array.from(
      document.querySelectorAll("._357a9937 .ef447dde ._4041eb80 ._287661cb"),
      (a) => a.href
    );
    let uniqe_links = [...new Set(anchors)];
    return uniqe_links;
  });

  for (const link of links) {
    try {
      await visit_each(link, page);
    } catch (error) {
      try {
        await visit_each(link, page);
      } catch (err) {
        csvErrr
          .writeRecords({ link: link, error: err })
          .then(() => console.log("error logged"));
        continue;
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
  for (let i = 1; i <= 9; i++) {
    try {
      await main_loop(page, i);
    } catch (error) {
      try {
        await main_loop(page, i);
      } catch (error) {
        csvErrr
          .writeRecords({ link: i, error: error })
          .then(() => console.log("error logged"));
        continue;
      }
    }
  }
  await browser.close();
}

main();
