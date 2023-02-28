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
    path: `${directory}/rent${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "type", title: "type" },
      { id: "area", title: "area" },
      { id: "price", title: "price" },
      { id: "Broker_ORN", title: "Broker_ORN" },
      { id: "Bedroom", title: "Bedroom" },
      { id: "Bathroom", title: "Bathroom" },
      { id: "Property_size", title: "Property_size" },
      { id: "Reference", title: "Reference" },
      { id: "Agent_BRN", title: "Agent_BRN" },
      { id: "Trakheesi_Permit", title: "Trakheesi_Permit" },
      { id: "Developer", title: "Developer" },
      { id: "info", title: "info" },
      { id: "agent", title: "agent" },
      { id: "amenities", title: "amenities" },
      { id: "description", title: "description" },
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

let csvErrr = csv_error_handler("rent");
let csvWriter = csv_handler("rent", 1);
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
        title = clean(document.querySelector(".P-Detail h1").textContent);
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
      let price = "";
      try {
        price = clean(document.querySelector(".Price ").textContent);
      } catch (error) {}
      temp = Array.from(
        document.querySelectorAll(".AgentWrap  + .Pro-info li")
      );
      let Bedroom = "";
      let Bathroom = "";
      let Property_size = "";
      let Reference = "";
      let Agent_BRN = "";
      let Trakheesi_Permit = "";
      let Developer = "";
      let Broker_ORN = "";
      let info = [];
      temp.forEach((e) => {
        try {
          info.push(clean(e.textContent));
        } catch (error) {}
        let key = clean(e.textContent);
        if (/bed/i.test(key)) {
          Bedroom = clean(key.replace(key.match(/bed\w+/i)[0], ""));
        }
        if (/bath/i.test(key)) {
          Bathroom = clean(key.replace(key.match(/bath\w+/i)[0], ""));
        }
        if (/Property size/i.test(key)) {
          Property_size = clean(
            key.replace(key.match(/Property size:/i)[0], "")
          );
        }

        if (/Ref/i.test(key)) {
          Reference = clean(key.replace(key.match(/Reference:/i)[0], ""));
        }
        if (/Broker ORN/i.test(key)) {
          Broker_ORN = clean(key.replace(key.match(/Broker ORN:/i)[0], ""));
        }
        if (/Developer/i.test(key)) {
          Developer = clean(key.replace(key.match(/Developer:/i)[0], ""));
        }
        if (/Agent BRN/i.test(key)) {
          Agent_BRN = clean(key.replace(key.match(/Agent BRN:/i)[0], ""));
        }
        if (/Trakheesi Permit/i.test(key)) {
          Trakheesi_Permit = clean(
            key.replace(key.match(/Trakheesi Permit:/i)[0], "")
          );
        }
      });
      let agent = "";
      try {
        agent = clean(
          document.querySelector(".AgentWrap .agentname").textContent
        );
      } catch (error) {}
      let amenities = [];
      temp = Array.from(document.querySelectorAll(".Pro-info.mt-3 li"));
      temp.forEach((e) => {
        try {
          amenities.push(clean(e.textContent));
        } catch (error) {}
      });
      let description = "";
      try {
        description = clean(
          document.querySelector(".dp-property-desc-content").textContent
        );
      } catch (error) {}
      return {
        title: title,
        price: price,
        Broker_ORN: Broker_ORN,
        Bedroom: Bedroom,
        Bathroom: Bathroom,
        Property_size: Property_size,
        Reference: Reference,
        Agent_BRN: Agent_BRN,
        Trakheesi_Permit: Trakheesi_Permit,
        Developer: Developer,
        info: info,
        agent: agent,
        amenities: amenities,
        description: description,
        images: images,
        signaturea: Date.now(),
      };
    })
  );
  data[0].type = link.type;
  data[0].area = link.area;

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("rent", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://www.zoomproperty.com/en/search?ob&c=2&l%5B%5D=City%20-%20Dubai&pl&t&bdr&btr&pf&pt&cs&af&at&am&kw&prop_type=residential&fs&rp=yearly&page=${i}`;

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
      document.querySelectorAll(
        ".ProViewSimilarInnerInfo .row .col-sm-9 .row.m-0 >section"
      )
    );
    link.forEach((e) => {
      let a = e.querySelector(".WrapListAnchor").href;
      let type = clean(
        e.querySelectorAll(
          ".ProViewSimilarInnerInfo .row .col-sm-9 .row.m-0 >section .ProViewSimilarInnerInfo > span"
        )[1].textContent
      );
      let area = clean(e.querySelector(".bathlistingcs >span").textContent);
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
  for (let i = 1; i <= 406; i++) {
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
