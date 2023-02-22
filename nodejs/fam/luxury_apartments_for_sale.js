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
    path: `${directory}/luxury_apartments_for_sale${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "price", title: "price" },
      { id: "size", title: "size" },
      { id: "type", title: "type" },
      { id: "parkings", title: "parkings" },
      { id: "Bedrooms", title: "Bedrooms" },
      { id: "Bathrooms", title: "Bathrooms" },
      { id: "per_price", title: "per_price" },
      { id: "view", title: "view" },
      { id: "developer", title: "developer" },
      { id: "about", title: "about" },
      { id: "amenities", title: "amenities" },
      { id: "nearby_schools", title: "nearby_schools" },
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

let csvErrr = csv_error_handler("luxury_apartments_for_sale");
let csvWriter = csv_handler("luxury_apartments_for_sale", 1);
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
        title = clean(
          document.querySelector(".main-title.margin-none").textContent
        );
      } catch (error) {}
      let temp;
      let images = [];
      temp = Array.from(
        document.querySelectorAll(".img-responsive.imgGallery")
      );
      temp.forEach((e) => {
        try {
          images.push(e.getAttribute("data-src"));
        } catch (error) {
          try {
            images.push(e.src);
          } catch (error) {}
        }
      });
      images = [...new Set(images)];
      temp = Array.from(
        document.querySelectorAll(".property-highlights.info-based li h3")
      );

      let size = "";
      let type = "";
      let parkings = "";
      let Bedrooms = "";
      let Bathrooms = "";
      let per_price = "";
      let view = "";
      let developer = "";
      temp.forEach((e) => {
        let key = clean(e.querySelector("span").textContent);
        let value = clean(e.textContent);
        if (/price per/i.test(key)) {
          per_price = value;
        }
        if (/type/i.test(key)) {
          type = value;
        }
        if (/Size/i.test(key)) {
          size = value;
        }
        if (/Bed/i.test(key)) {
          Bedrooms = value;
        }
        if (/bath/i.test(key)) {
          Bathrooms = value;
        }
        if (/developer/i.test(key)) {
          developer = value;
        }
        if (/Parking/i.test(key)) {
          parkings = value;
        }
        if (/View/i.test(key)) {
          view = value;
        }
      });
      let price = "";
      try {
        price = document.querySelector(
          ".padding-top-sm.margin-bottom-sm.u-textLeft.padding-bottom-none b"
        ).textContent;
      } catch (error) {}
      let about = "";
      try {
        about = clean(
          document.querySelector("#R26084776279783372842 .textDesc.u-textLeft")
            .textContent
        );
      } catch (error) {}
      let amenities = [];
      temp = Array.from(document.querySelectorAll("#R26181459830514678456 li"));
      temp.forEach((e) => {
        try {
          amenities.push(clean(e.textContent));
        } catch (error) {}
      });
      let nearby_schools = [];
      temp = Array.from(
        document.querySelectorAll(
          "#R32768140023022543181 .a-CardView-headerBody "
        )
      );
      temp.forEach((e) => {
        try {
          nearby_schools.push(clean(e.querySelector("h3").textContent));
        } catch (error) {}
      });

      return {
        title: title,
        price: price,
        size: size,
        type: type,
        parkings: parkings,
        Bedrooms: Bedrooms,
        Bathrooms: Bathrooms,
        per_price: per_price,
        view: view,
        developer: developer,
        about: about,
        amenities: amenities,
        nearby_schools: nearby_schools,
        images: images,
        signaturea: Date.now(),
      };
    })
  );
  data[0].area = link.area;

  const exist = await page.evaluate(() => {
    return (
      document.querySelector(
        ".t-Button.t-Button--icon.t-Button--iconLeft.info"
      ) !== null
    );
  });
  let images = [];
  if (exist) {
    await page.evaluate(() => {
      document
        .querySelector(".t-Button.t-Button--icon.t-Button--iconLeft.info")
        .click();
    });
    let number = await page.evaluate(() => {
      let num = document.querySelector(
        ".t-Button.t-Button--icon.t-Button--iconLeft.info"
      ).textContent;
      return num.match(/(\d+)/)[0];
    });
    await page.click(".t-Button.t-Button--icon.t-Button--iconLeft.info");
    for (let i = 0; i < number; i++) {
      await page.evaluate(() => document.querySelector("a.next").click());
    }
    images = await page.evaluate(() => {
      let imgs = [];
      let temp = Array.from(document.querySelectorAll(".modal-content img"));
      temp.forEach((e) => {
        try {
          imgs.push(e.src);
        } catch (error) {
          try {
            imgs.push(e.getAttribute("data-src"));
          } catch (error) {}
        }
        return imgs;
      });
    });
    // console.log(images);
    // console.log(images.length);
  } else {
    console.log("no imgs");
  }
  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("luxury_apartments_for_sale", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page) {
  let target = `https://famproperties.com/luxury-apartments-for-sale-dubai`;

  console.log(target);
  await page.goto(target);
  let links = [];
  // Use page.evaluate to interact with the popup and close it
  await page.evaluate(() => {
    const popup = document.querySelector("#marquizPopup");
    const closeButton = popup.querySelector(".fa.fa-times.fa-2x.closeMarquiz");
    closeButton.click();
  });
  await page.evaluate(() => {
    document.querySelectorAll("footer .row")[15].style.display = "none";
    document.querySelector("#marquizPopup").style.display = "none";
  });
  while (true) {
    await page.evaluate(() => {
      document.querySelectorAll("footer .row")[15].style.display = "none";
      document.querySelector("#marquizPopup").style.display = "none";
    });
    await page.waitForSelector(".a-CardView");
    await page.waitForTimeout(3000);
    links.push(
      await page.evaluate(() => {
        let all = [];
        let link = Array.from(document.querySelectorAll(".a-CardView"));
        link.forEach((e) => {
          let a = e.querySelector("a.card-image").href;
          let area = e.querySelector(" h5 .u-color-10-text").textContent;
          all.push({ link: a, area: area });
        });
        let uniqe_links = [...new Set(all)];
        return uniqe_links;
      })
    );
    if (
      await page.evaluate(() => {
        return (
          document
            .querySelector(".a-GV-pageButton.a-GV-pageButton--nav.js-pg-next")
            .getAttribute("disabled") === "disabled"
        );
      })
    ) {
      break;
    }
    await page.click(".a-GV-pageButton.a-GV-pageButton--nav.js-pg-next");
  }
  let all_links = [];
  links.forEach((e) => {
    e.forEach((s) => all_links.push(s.link));
  });
  let all_area = [];
  links.forEach((e) => {
    e.forEach((s) => all_area.push(s.area));
  });

  all_links = [...new Set(all_links)];
  // all_area = [...new Set(all_area)];
  console.log(all_links.length);
  console.log(all_area.length);
  for (const link of all_links) {
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
      await main_loop(page);
    } catch (error) {
      try {
        await main_loop(page);
      } catch (error) {
        try {
          await main_loop(page);
        } catch (error) {}
        csvErrr
          .writeRecords({ link: i, error: error })
          .then(() => console.log("error logged main"));
        continue;
        console.error(error);
      }
    }
  }
  await browser.close();
}

main();
