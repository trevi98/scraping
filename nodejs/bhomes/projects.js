const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/projects${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "price", title: "price" },
      { id: "Available_Units", title: "Available_Units" },
      { id: "handover", title: "handover" },
      { id: "type", title: "type" },
      { id: "info", title: "info" },
      { id: "about", title: "about" },
      { id: "description", title: "description" },
      { id: "amenities", title: "amenities" },
      {
        id: "proprty_typy_with_floor_plan",
        title: "proprty_typy_with_floor_plan",
      },
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

let csvErrr = csv_error_handler("projects");
let csvWriter = csv_handler("projects", 1);
let batch = 0;
let j = 0;
let main_err_record = 0;
let visit_err_record = 0;

async function visit_each(link, page) {
  // await page.setCacheEnabled(false);
  await page.goto(link.link);
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
      temp = Array.from(document.querySelectorAll(".grid.space-y-4> div"));
      let Available_Units = "";
      let price = "";
      let handover = "";
      temp.forEach((e) => {
        let key = clean(e.querySelector("span").textContent);
        let value = clean(e.querySelector("div div").textContent);
        if (/price/i.test(key)) {
          price = value;
        }
        if (/Available Units/i.test(key)) {
          Available_Units = value;
        }
        if (/handover/i.test(key)) {
          handover = value;
        }
      });
      temp = Array.from(
        document.querySelectorAll(".ck-content.keypoints >div")
      );
      let info = [];
      temp.forEach((e) => {
        try {
          info.push(clean(e.textContent));
        } catch (error) {}
      });
      let about = "";
      try {
        about = clean(
          document.querySelector("#descriptionContainer.mt-4").textContent
        );
      } catch (error) {}
      let description = "";
      try {
        description = clean(
          document.querySelectorAll(".description-section >div")[2].textContent
        );
      } catch (error) {}
      let amenities = [];
      temp = Array.from(document.querySelectorAll(".amenities-wrapper li"));
      temp.forEach((e) => {
        try {
          amenities.push(clean(e.textContent));
        } catch (error) {}
      });
      let proprty_typy_with_floor_plan = [];

      temp = Array.from(document.querySelectorAll(".accordion "));
      temp.forEach((e) => {
        let type = "";
        let link = "";
        let price = "";
        try {
          type = clean(e.querySelector("p").textContent);
        } catch (error) {}
        try {
          link = e.querySelector("a").href;
        } catch (error) {}
        try {
          link = e.querySelector(" div  >span").href;
        } catch (error) {}
        proprty_typy_with_floor_plan.push(
          JSON.stringify({ type: type, link: link, price: price })
        );
      });
      let payment_plan = [];
      temp = Array.from(
        document.querySelectorAll(
          ".availaibility-wrapper.job-vacancies.pt-10 li"
        )
      );
      temp.forEach((e) => {
        try {
          payment_plan.push(clean(e.textContent));
        } catch (se) {}
      });
      let images = [];
      temp = Array.from(
        document.querySelectorAll(".galler-image.image-holder img")
      );
      temp.forEach((e) => {
        try {
          images.push(e.src);
        } catch (error) {}
      });
      images = [...new Set(images)];
      let brochure = "";
      try {
        brochure = document.querySelector("#floormap iframe").src;
      } catch (error) {}
      return {
        title: title,
        price: price,
        Available_Units: Available_Units,
        handover: handover,
        info: info,
        about: about,
        description: description,
        amenities: amenities,
        proprty_typy_with_floor_plan: proprty_typy_with_floor_plan,
        payment_plan: payment_plan,
        images: images,
        brochure: brochure,
        signaturea: Date.now(),
      };
    })
  );
  data[0].type = link.type;
  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("projects", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://www.bhomes.com/en/off-plan?page=${i}`;
  if (i == 1) {
    target = "https://www.bhomes.com/en/off-plan";
  }
  console.log(target);
  await page.goto(target);
  const links = await page.evaluate(() => {
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
    let all = [];
    let link = Array.from(document.querySelectorAll(".avatar-box.relative  "));
    link.forEach((e) => {
      let type = "";
      let temp = Array.from(
        e.querySelectorAll(".avatar-box.relative .image-wrapper-avatar >div")
      );
      temp.forEach((e) => {
        if (!/aed/i.test(e.textContent)) {
          type = clean(e.textContent);
          type = type.split(" ");
          type = type[type.length - 1];
        }
      });
      let a = e.href;
      all.push({ link: a, type: type });
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
  for (let i = 1; i <= 7; i++) {
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
