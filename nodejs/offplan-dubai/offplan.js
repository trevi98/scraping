const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/offplan_Dubai_Properties${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "developer", title: "developer" },
      { id: "price", title: "price" },
      { id: "area", title: "area" },
      { id: "Bedrooms", title: "Bedrooms" },
      { id: "type", title: "type" },
      { id: "propery_info", title: "propery_info" },
      { id: "description", title: "description" },
      { id: "Payment_Plan", title: "Payment_Plan" },
      { id: "handover", title: "handover" },
      { id: "video", title: "video" },
      { id: "amenities", title: "amenities" },
      { id: "location", title: "location" },
      { id: "nearby_places", title: "nearby_places" },
      { id: "images", title: "images" },
      { id: "link", title: "link" },
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

let csvErrr = csv_error_handler("offplan_Dubai_Properties");
let csvWriter = csv_handler("offplan_Dubai_Properties", 1);
let batch = 0;
let j = 0;
let main_err_record = 0;
let visit_err_record = 0;

async function visit_each(link, page) {
  // await page.setCacheEnabled(false);
  await page.goto(link.link);
  console.log(link);
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
      let temp = Array.from(
        document.querySelectorAll(
          ".g-cols.vc_row.type_default.valign_top .wpb_text_column + .g-cols.type_default.valign_top tr"
        )
      );
      let price = "";
      let Bedrooms = "";
      temp.forEach((e) => {
        let key = clean(e.querySelector("td[align='left']").textContent);
        let value = clean(e.querySelector("td[align='right']").textContent);
        if (/price/i.test(key)) {
          price = value;
        }
        if (/bed/i.test(key)) {
          Bedrooms = value;
        }
      });
      let propery_info = [];
      temp = Array.from(
        document.querySelectorAll(
          ".g-cols.vc_row.type_default.valign_top .g-cols.wpb_row.type_default.valign_top.vc_inner.justxt .nolist li"
        )
      );
      temp.forEach((e) => {
        try {
          propery_info.push(clean(e.textContent));
        } catch (error) {}
      });
      let description = "";
      try {
        description = clean(
          document.querySelector(
            ".g-cols.vc_row.type_default.valign_top .g-cols.wpb_row.type_default.valign_top.vc_inner.justxt .default-font"
          ).textContent
        );
      } catch (error) {}
      temp = Array.from(
        document.querySelectorAll("section#paymentplan tr:not(.pline)")
      );
      let Payment_Plan = [];
      let handover = "";
      temp.forEach((e) => {
        try {
          Payment_Plan.push(clean(e.textContent));
        } catch (error) {}
        if (/handover/i.test(e.textContent)) {
          handover = clean(e.textContent.split(":")[1]);
        }
      });
      let images = [];
      temp = Array.from(document.querySelectorAll(".w-gallery-item-img img"));
      temp.forEach((e) => {
        try {
          images.push(clean(e.src));
        } catch (error) {}
      });
      let video = "";
      try {
        video = clean(
          document.querySelector(".w-video.ratio_16x9.align_center iframe").src
        );
      } catch (error) {}
      let amenities = [];
      let location = "";
      let nearby_places = [];
      temp = Array.from(document.querySelectorAll(".wpb_wrapper"));
      temp.forEach((e) => {
        let key = e.querySelector(
          " .w-separator.type_default.size_medium.thick_1.style_dotted.color_primary.align_center.with_content"
        );
        if (key !== null) {
          if (/Amenities/i.test(key.textContent)) {
            let list = Array.from(e.querySelectorAll("li"));
            list.forEach((e) => {
              try {
                amenities.push(clean(e.textContent));
              } catch (error) {}
            });
          }
          if (/location/i.test(key.textContent)) {
            let places = Array.from(e.querySelectorAll("li"));
            places.forEach((e) => {
              try {
                nearby_places.push(clean(e.textContent));
              } catch (error) {}
            });
            let all = Array.from(e.querySelectorAll("p"));
            all.forEach((e) => {
              try {
                location += clean(e.textContent);
              } catch (error) {}
            });
          }
        }
      });
      temp = Array.from(
        document.querySelectorAll(
          ".vc_col-sm-9 .vc_column-inner> .wpb_wrapper >*"
        )
      );
      for (let i = 0; i < temp.length; i++) {
        if (temp[i] !== null) {
          let key = temp[i].textContent;
          if (Payment_Plan.length === 0) {
            if (/payment/i.test(key)) {
              let s = [];
              try {
                s = Array.from(temp[i + 1].querySelectorAll("li,h6"));
              } catch (error) {}
              s.forEach((e) => {
                try {
                  Payment_Plan.push(clean(e.textContent));
                } catch (error) {}
              });
              if (s.length == 0) {
                try {
                  s = Array.from(temp[i].querySelectorAll("li,h6"));
                } catch (error) {}
                s.forEach((e) => {
                  try {
                    Payment_Plan.push(clean(e.textContent));
                  } catch (error) {}
                });
              }
              if (s.length == 0) {
                try {
                  s = Array.from(temp[i + 2].querySelectorAll("li,h6"));
                } catch (error) {}
                s.forEach((e) => {
                  try {
                    Payment_Plan.push(clean(e.textContent));
                  } catch (error) {}
                });
              }
            }
          }
          if (amenities.length === 0) {
            if (/Amenities/i.test(key)) {
              let s = [];
              try {
                s = Array.from(temp[i + 1].querySelectorAll("li,h6"));
              } catch (error) {}
              s.forEach((e) => {
                try {
                  amenities.push(clean(e.textContent));
                } catch (error) {}
              });
              if (s.length == 0) {
                try {
                  s = Array.from(temp[i].querySelectorAll("li,h6"));
                } catch (error) {}
                s.forEach((e) => {
                  try {
                    amenities.push(clean(e.textContent));
                  } catch (error) {}
                });
              }
              if (s.length == 0) {
                try {
                  s = Array.from(temp[i + 2].querySelectorAll("li,h6"));
                } catch (error) {}
                s.forEach((e) => {
                  try {
                    amenities.push(clean(e.textContent));
                  } catch (error) {}
                });
              }
            }
          }
          if (!price) {
            if (/Price/i.test(key)) {
              if (/aed/i.test(key)) {
                price = key;
              } else {
                price = clean(temp[i + 1].textContent);
              }
            }
          }
        }
      }
      if (!description) {
        try {
          description = clean(
            document.querySelector(".l-section-h.i-cf p").textContent
          );
        } catch (error) {}
      }
      return {
        title: title,
        price: price,
        Bedrooms: Bedrooms,
        propery_info: propery_info,
        description: description,
        Payment_Plan: Payment_Plan,
        handover: handover,
        video: video,
        amenities: amenities,
        location: location,
        nearby_places: nearby_places,
        images: images,
        signaturea: Date.now(),
      };
    })
  );
  data[0].area = link.area;
  data[0].type = link.type;
  data[0].developer = link.developer;
  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("offplan_Dubai_Properties", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://www.offplan-dubai.com/offplan-projects-in-dubai/page/${i}/`;
  if (i == 1) {
    target = "https://www.offplan-dubai.com/offplan-projects-in-dubai";
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
    let link = Array.from(document.querySelectorAll(".w-grid-list article "));
    link.forEach((e) => {
      let developer = "";
      let area = "";
      let type = "";
      try {
        developer = clean(
          e.querySelector(" .w-hwrapper.usg_hwrapper_1 .usg_post_taxonomy_5")
            .textContent
        );
      } catch (error) {}
      try {
        area = clean(
          e.querySelector(" .w-hwrapper.usg_hwrapper_1 .usg_post_taxonomy_1")
            .textContent
        );
      } catch (error) {}
      try {
        type = clean(
          e
            .querySelector(".w-hwrapper.usg_hwrapper_3")
            .textContent.split(":")[1]
        );
      } catch (error) {}
      let a = "";
      a = e.querySelector(".w-btn.usg_btn_1").href;
      all.push({ link: a, type: type, area: area, developer: developer });
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
  for (let i = 1; i <= 21; i++) {
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
