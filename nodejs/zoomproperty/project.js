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
    path: `${directory}/project${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "starting_price", title: "starting_price" },
      { id: "type", title: "type" },
      { id: "area", title: "area" },
      { id: "Broker_ORN", title: "Broker_ORN" },
      { id: "Reference", title: "Reference" },
      { id: "Trakheesi_Permit", title: "Trakheesi_Permit" },
      { id: "Developer", title: "Developer" },
      { id: "info", title: "info" },
      { id: "status", title: "status" },
      { id: "completion", title: "completion" },
      { id: "Permit_Number", title: "Permit_Number" },
      { id: "features", title: "features" },
      { id: "payment_plan", title: "payment_plan" },
      { id: "description", title: "description" },
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

let csvErrr = csv_error_handler("project");
let csvWriter = csv_handler("project", 1);
let batch = 0;
let j = 0;
let main_err_record = 0;
let visit_err_record = 0;

async function visit_each(link, page) {
  // await page.setCacheEnabled(false);
  await page.goto(link.link);
  let data = [];
  await page.waitForSelector(".dtmainslider img");
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
        title = clean(
          document.querySelector(".contentInforinner h1").textContent
        );
      } catch (error) {}
      let temp;
      temp = Array.from(document.querySelectorAll(".dtmainslider img"));
      let images = [];
      temp.forEach((e) => {
        try {
          images.push(e.src);
        } catch (error) {}
      });
      images = [...new Set(images)];
      let starting_price = "";
      try {
        starting_price = clean(
          document.querySelector(".bhkInof h2 ").textContent
        );
      } catch (error) {}
      temp = Array.from(document.querySelectorAll(".SS-resign +.Pro-info li"));
      let Reference = "";
      let Trakheesi_Permit = "";
      let Developer = "";
      let Broker_ORN = "";
      let info = [];
      temp.forEach((e) => {
        try {
          info.push(clean(e.textContent));
        } catch (error) {}
        let key = clean(e.textContent);
        if (/Ref/i.test(key)) {
          Reference = clean(key.split(":")[1]);
        }
        if (/Broker ORN/i.test(key)) {
          Broker_ORN = clean(key.split(":")[1]);
        }
        if (/Developer/i.test(key)) {
          Developer = clean(key.split(":")[1]);
        }
        if (/Trakheesi Permit/i.test(key)) {
          Trakheesi_Permit = clean(key.split(":")[1]);
        }
      });

      let features = [];
      temp = Array.from(document.querySelectorAll(".Pro-info.mt-3.mb-3 li"));
      temp.forEach((e) => {
        try {
          features.push(clean(e.textContent));
        } catch (error) {}
      });
      let description = "";
      try {
        description = clean(
          document.querySelector(".dp-property-desc-content").textContent
        );
      } catch (error) {}
      temp = Array.from(
        document.querySelectorAll(".contentInfor .contentInforinner.p-0 li")
      );
      let status = "";
      let completion = "";
      let Permit_Number = "";
      temp.forEach((e) => {
        let key = clean(e.textContent);
        if (/status/i.test(key)) {
          status = key.split(":")[1];
        }
        if (/completion/i.test(key)) {
          completion = key.split(":")[1];
        }
        if (/Permit Number/i.test(key)) {
          Permit_Number = key.split(":")[1];
        }
      });
      let payment_plan = [];
      let all_payment_plan = {};
      temp = Array.from(document.querySelectorAll(".Pplan li "));
      temp.forEach((e) => {
        try {
          all_payment_plan[clean(e.querySelector("h5").textContent)] = clean(
            e.textContent.replace(e.querySelector("h5").textContent, "")
          );
        } catch (error) {}
      });
      payment_plan.push(JSON.stringify(all_payment_plan));
      let brochure = "";
      try {
        brochure = document.querySelector(".vo-brochureInner .gloBtnP").href;
      } catch (error) {}
      return {
        title: title,
        starting_price: starting_price,
        Broker_ORN: Broker_ORN,
        Reference: Reference,
        Trakheesi_Permit: Trakheesi_Permit,
        Developer: Developer,
        info: info,
        status: status,
        completion: completion,
        Permit_Number: Permit_Number,
        features: features,
        payment_plan: payment_plan,
        description: description,
        images: images,
        brochure: brochure,
        signaturea: Date.now(),
      };
    })
  );
  data[0].type = link.type;
  data[0].area = link.area;

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("project", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://www.zoomproperty.com/en/projects/uae?area_city%5B%5D=City%20-%20Dubai&completion_id&agency_id&keyword&ob&page=${i}`;

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
    let link = Array.from(
      document.querySelectorAll(".WrapProjectPgCS.fullanchorcs")
    );
    link.forEach((e) => {
      let a = e.querySelector(".WrapListAnchor").href;
      let type = clean(
        e.querySelector(".ProViewSimilarInnerInfo span").textContent
      );
      let area = clean(
        e.querySelector(".ProViewSimilarInnerInfo h4").textContent
      );
      all.push({ link: a, type: type, area: area });
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
