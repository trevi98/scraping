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
    path: `${directory}/commercial_rent${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "Property_type", title: "Property_type" },
      { id: "Property_size", title: "Property_size" },
      { id: "Bedrooms", title: "Bedrooms" },
      { id: "Bathrooms", title: "Bathrooms" },
      { id: "Developer", title: "Developer" },
      { id: "price", title: "price" },
      { id: "Down_Payment", title: "Down_Payment" },
      { id: "Monthly_Payment", title: "Monthly_Payment" },
      { id: "Pay_Over", title: "Pay_Over" },
      { id: "Size_range_sqm", title: "Size_range_sqm" },
      { id: "Starting_price", title: "Starting_price" },
      { id: "Completion", title: "Completion" },
      { id: "location", title: "location" },
      { id: "agent", title: "agent" },
      { id: "amenities__list", title: "amenities__list" },
      { id: "description", title: "description" },
      { id: "Reference", title: "Reference" },
      { id: "Trakheesi_Permit", title: "Trakheesi_Permit" },
      { id: "Agent_BRN", title: "Agent_BRN" },
      { id: "Broker_ORN", title: "Broker_ORN" },
      { id: "Ownership", title: "Ownership" },
      { id: "Property_age", title: "Property_age" },
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

let csvErrr = csv_error_handler("commercial_rent");
let csvWriter = csv_handler("commercial_rent", 1);
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
      let temp = Array.from(document.querySelectorAll("ul.property-facts li"));
      let Property_type = "";
      let Property_size = "";
      let Bedrooms = "";
      let Bathrooms = "";
      let Developer = "";
      let Property_age = "";
      temp.forEach((e) => {
        let key = e.querySelector(".property-facts__label").textContent;
        let value = clean(
          e.querySelector(".property-facts__value").textContent
        );
        if (/Property type/i.test(key)) {
          Property_type = value;
        }
        if (/Property size/i.test(key)) {
          Property_size = value;
        }
        if (/Property age/i.test(key)) {
          Property_age = value;
        }
        if (/Bedrooms/i.test(key)) {
          Bedrooms = value;
        }
        if (/Bathrooms/i.test(key)) {
          Bathrooms = value;
        }
        if (/Developer/i.test(key)) {
          Developer = value;
        }
      });
      let price = "";
      try {
        price = clean(
          document.querySelector(
            ".property-page__contact-section  .property-price .property-price__price"
          ).textContent
        );
      } catch (error) {}
      temp = Array.from(
        document.querySelectorAll(".property-payment-plan__item")
      );
      let Down_Payment = "";
      let Monthly_Payment = "";
      let Pay_Over = "";
      temp.forEach((e) => {
        let key = e.querySelector(".property-payment-plan__label").textContent;
        let value = clean(
          e.querySelector(".property-payment-plan__value").textContent
        );
        if (/Down Payment/i.test(key)) {
          Down_Payment = value;
        }
        if (/Monthly Payment/i.test(key)) {
          Monthly_Payment = value;
        }
        if (/Pay Over/i.test(key)) {
          Pay_Over = value;
        }
      });
      temp = Array.from(
        document.querySelectorAll(".property-project-details__list-item")
      );
      let Size_range_sqm = "";
      let Starting_price = "";
      let Completion = "";
      temp.forEach((e) => {
        let key = e.querySelector(
          ".property-project-details__list-item div:not(.property-project-details__list-item-value)"
        ).textContent;
        let value = clean(
          e.querySelector(".property-project-details__list-item-value")
            .textContent
        );
        if (/Size range/i.test(key)) {
          Size_range_sqm = value;
        }
        if (/Starting price/i.test(key)) {
          Starting_price = value;
        }
        if (/Completion/i.test(key)) {
          Completion = value;
        }
        if (!Property_type) {
          if (/Property type/i.test(key)) {
            Property_type = value;
          }
        }
      });
      let location = "";
      try {
        location = clean(
          document.querySelector(".property-location__detail-area").textContent
        );
      } catch (error) {}
      let agent = "";
      try {
        agent = clean(
          document.querySelector(
            ".text.text--size3.link.link--underline.property-agent__name"
          ).textContent
        );
      } catch (error) {}
      temp = Array.from(document.querySelectorAll(".property-amenities__list"));
      let amenities__list = [];
      temp.forEach((e) => {
        try {
          amenities__list.push(clean(e.textContent));
        } catch (error) {}
      });
      let description = "";
      try {
        description = clean(
          document.querySelector(
            ".text-trim.property-description__text-trim.text-trim--enabled"
          ).textContent
        );
      } catch (error) {}

      let Reference = "";
      let Trakheesi_Permit = "";
      let Agent_BRN = "";
      let Broker_ORN = "";
      let Ownership = "";
      temp = Array.from(
        document.querySelectorAll(".property-page__legal-list-item")
      );
      temp.forEach((e) => {
        let key = e.querySelector(
          ".property-page__legal-list-label"
        ).textContent;
        let value = clean(
          e.querySelector(".property-page__legal-list-content").textContent
        );
        if (/Reference/i.test(key)) {
          Reference = value;
        }
        if (/Trakheesi Permit/i.test(key)) {
          Trakheesi_Permit = value;
        }
        if (/Agent BRN/i.test(key)) {
          Agent_BRN = value;
        }

        if (/Broker ORN/i.test(key)) {
          Broker_ORN = value;
        }
        if (/Ownership/i.test(key)) {
          Ownership = value;
        }
      });

      return {
        title: title,
        Property_type: Property_type,
        Property_size: Property_size,
        Property_age: Property_age,
        Bedrooms: Bedrooms,
        Bathrooms: Bathrooms,
        Developer: Developer,
        price: price,
        Down_Payment: Down_Payment,
        Monthly_Payment: Monthly_Payment,
        Pay_Over: Pay_Over,
        Size_range_sqm: Size_range_sqm,
        Starting_price: Starting_price,
        Completion: Completion,
        location: location,
        agent: agent,
        amenities__list: amenities__list,
        description: description,
        Reference: Reference,
        Trakheesi_Permit: Trakheesi_Permit,
        Agent_BRN: Agent_BRN,
        Broker_ORN: Broker_ORN,
        Ownership: Ownership,
        signaturea: Date.now(),
      };
    })
  );
  let images = [];
  const exist = await page.evaluate(() => {
    return (
      document.querySelector(
        ".property-page__gallery-button-area > .button-2.button-floating.button-floating--shadow.property-page__gallery-button"
      ) !== null
    );
  });
  if (exist) {
    let number = await page.evaluate(() => {
      let number = document.querySelector(
        ".property-page__gallery-button-area > .button-2.button-floating.button-floating--shadow.property-page__gallery-button"
      ).textContent;
      return number.match(/(\d+)/)[0];
    });
    await page.click(
      ".property-page__gallery-button-area > .button-2.button-floating.button-floating--shadow.property-page__gallery-button"
    );

    for (let i = 0; i < number + 1; i++) {
      await page.evaluate(() =>
        document.querySelector(".gallery__item").click()
      );
    }
    images = await page.evaluate(() => {
      let temp = Array.from(document.querySelectorAll(".gallery__item img "));
      let imgs = [];
      temp.forEach((e) => {
        imgs.push(e.src);
      });
      return imgs;
    });
  }
  data[0].images = images;
  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("commercial_rent", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://www.propertyfinder.ae/en/commercial-rent/properties-for-rent.html?page=${i}`;
  if (i == 1) {
    target =
      "https://www.propertyfinder.ae/en/commercial-rent/properties-for-rent.html";
  }
  console.log(target);
  await page.goto(target);
  const links = await page.evaluate(() => {
    let all = [];
    let link = Array.from(document.querySelectorAll(".card "));
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
  for (let i = 1; i <= 429; i++) {
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
