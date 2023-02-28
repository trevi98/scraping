const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/buy${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "type", title: "type" },
      { id: "agent", title: "agent" },
      { id: "price", title: "price" },
      { id: "area", title: "area" },
      { id: "property_id", title: "property_id" },
      { id: "Bedrooms", title: "Bedrooms" },
      { id: "Bathrooms", title: "Bathrooms" },
      { id: "size", title: "size" },
      { id: "description", title: "description" },
      { id: "amenities", title: "amenities" },
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

let csvErrr = csv_error_handler("buy");
let csvWriter = csv_handler("buy", 1);
let batch = 0;
let j = 0;
let main_err_record = 0;
let visit_err_record = 0;

async function visit_each(link, page) {
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
      function extract_one_text_from_pare_elements_in_one_container__pass_array_of_main_containers(
        elmnts,
        key,
        value_selector
      ) {
        let results = [];
        let result = "";
        try {
          results = elmnts.filter((elmnt) => {
            if (elmnt.textContent.includes(key)) return true;
          });
          result = results[0].querySelector(value_selector).textContent;
        } catch (error) {
          console.error(error);
        }
        return result;
      }

      function create_pares_from_pare_elements_in_one_container_if_thing_exists__pass_array_of_pares_containers(
        elmnts,
        search_key,
        key_selector,
        value_selector
      ) {
        let results = elmnts.filter((elmnt) => {
          if (elmnt.textContent.includes(search_key)) return true;
        });
        let result = [];
        results.forEach((e) => {
          let key = e.querySelector(key_selector).textContent;
          let value = e.querySelector(value_selector).textContent;
          result.push({ key, value });
        });
        return JSON.stringify(result);
      }

      function extract_text_from_pare_elements__section__(
        elmnts,
        search_key,
        value_selector
      ) {
        results = "";
        elmnts.forEach((t) => {
          try {
            if (
              t
                .querySelector(".container .projectHeading")
                .textContent.includes(search_key)
            ) {
              results = clean(t.querySelector(value_selector).innerText);
            }
          } catch (error) {
            console.error(error);
          }
        });
        return results;
      }
      let title = "";
      try {
        title = clean(
          document.querySelector(".property-has.d-none.d-lg-block").textContent
        );
      } catch (error) {}
      let type = "";
      if (/apartment/i.test(title)) type = "Apartment";
      if (/duplex/i.test(title)) type = "duplex";
      if (/full floor/i.test(title)) type = "full floor";
      if (/penthouse/i.test(title)) type = "penthouse";
      let temp;
      temp = Array.from(document.querySelectorAll(".lightboxed--frame img"));
      let images = [];
      temp.forEach((e) => {
        try {
          images.push(e.src);
        } catch (error) {}
      });
      let agent = "";
      try {
        agent = clean(document.querySelector(".u-name").textContent);
      } catch (error) {}
      let price = "";
      try {
        price = clean(document.querySelector(".price").textContent);
      } catch (error) {}
      let area = "";
      try {
        area = clean(document.querySelector(".title-alias a").textContent);
      } catch (error) {}
      let property_id = "";
      try {
        property_id = clean(
          document.querySelector("property-id").textContent.split(":")[1]
        );
      } catch (error) {}
      let Bedrooms = "";
      let Bathrooms = "";
      let size = "";
      try {
        Bedrooms = clean(document.querySelectorAll("")[0].textContent);
      } catch (error) {}
      try {
        Bathrooms = clean(document.querySelectorAll("")[1].textContent);
      } catch (error) {}
      try {
        size = clean(document.querySelectorAll("")[2].textContent);
      } catch (error) {}
      let description = "";
      try {
        description = clean(
          document.querySelector(".property-details .description").textContent
        );
      } catch (error) {}
      amenities = [];
      temp = Array.from(
        document.querySelectorAll(".property-details .s-units .unit-list div")
      );
      temp.forEach((e) => {
        try {
          amenities.push(e.textContent);
        } catch (error) {}
      });

      return {
        title: title,
        type: type,
        agent: agent,
        price: price,
        area: area,
        property_id: property_id,
        Bedrooms: Bedrooms,
        Bathrooms: Bathrooms,
        size: size,
        description: description,
        amenities: amenities,
        images: images,
        signaturea: Date.now(),
      };
    })
  );

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("buy", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target =
    "https://www.hamptons.ae/en/search-results/?purchaseCategory=Sale&propertyType=residential/";
  await page.goto(target);
  //   await page.waitForNavigation()

  for (let j = 1; j <= i; j++) {
    await page.addStyleTag({
      content: ".cmplz-eu.cmplz-optin >div div { display: none !important; }",
    });
    await page.addStyleTag({
      content: "#cmplz-cookiebanner  { display: none !important; }",
    });
    await page.waitForSelector(".properties-wrapper button");
    await page.evaluate(() => {
      document.querySelector(".properties-wrapper button").click();
    });
  }
  const links = await page.evaluate(() => {
    const items = Array.from(
      document.querySelectorAll(
        ".node.section-clear.section .code #OffPlanListing #addListing .offPlanListing  .offPlanListing__item"
      )
    );
    let anchors = [];
    items.forEach((item) => {
      let a = item.querySelector(".offPlanListing__item-titleLink").href;
      let types = Array.from(
        item.querySelectorAll(".offPlanListing__item-type"),
        (type) => type.textContent
      );
      anchors.push({ link: a, types: types });
    });
    let uniqe_links = [...new Set(anchors)];
    return uniqe_links;
  });
  console.log(links.length);

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
            .writeRecords({ link: link.link, error: err })
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
  try {
    await main_loop(page, 35);
  } catch (error) {
    try {
      await main_loop(page, 35);
    } catch (error) {
      console.error(error);
    }
  }

  await browser.close();
}

main();
