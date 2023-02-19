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
    path: `${directory}/area${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "price", title: "price" },
      { id: "info", title: "info" },
      { id: "handover", title: "handover" },
      { id: "overview_title", title: "overview_title" },
      { id: "overview", title: "overview" },
      { id: "about", title: "about" },
      { id: "cover_img", title: "cover_img" },
      { id: "nearby_place", title: "nearby_place" },
      { id: "all_images", title: "all_images" },
      { id: "images_sup", title: "images_sup" },
      { id: "signaturea", title: "signaturea" },
      { id: "all_content", title: "all_content" },
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

let csvErrr = csv_error_handler("area");
let csvWriter = csv_handler("area", 1);
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
        title = clean(document.querySelector("title").textContent);
      } catch (error) {}
      let price_payment = [];
      let temp = document.querySelectorAll(
        "#header-menu-desktop ~ div.node.section-zero.section div.zero-layer-axis.lg-left.lg-bottom strong"
      );
      try {
        temp.forEach((e) => price_payment.push(e.textContent));
      } catch (error) {}
      let price = "";
      price_payment.forEach((e) => {
        if (/AED/i.test(e)) {
          price = e;
        }
      });
      price_payment = price_payment.filter((e) => {
        return e !== price;
      });
      let info = [];
      price_payment.forEach((e) => {
        if (/price/i.test(e)) {
          let p = e;
          info = price_payment.filter((e) => {
            return e !== p;
          });
        }
      });
      let handover = [];
      try {
        temp = Array.from(
          document.querySelectorAll(
            "#header-menu-desktop ~ div.node.section-zero.section div.zero-layer-axis.lg-center.lg-bottom strong"
          )
        );
        temp.forEach((e) => {
          handover.push(e.textContent);
        });
      } catch (error) {}
      let temp1 = "";
      try {
        temp1 = document.querySelector(
          "#header-menu-desktop ~ div.node.section-zero.section div.zero-layer-axis.lg-left.lg-top strong"
        ).textContent;
      } catch (error) {}
      let temp2 = "";
      try {
        temp2 = document.querySelector(
          "#header-menu-desktop ~ div.node.section-zero.section div.zero-layer-axis.lg-left.lg-middle strong"
        ).textContent;
      } catch (error) {
        try {
          temp2 = Array.from(
            document.querySelectorAll(
              "#header-menu-desktop ~ div.node.section-zero.section div.zero-layer-axis.lg-left.lg-top strong"
            )
          )[1].textContent;
        } catch (error) {}
      }
      let overview_title = "";
      try {
        overview_title = temp1 + " " + temp2;
      } catch (error) {}
      let overview = "";
      try {
        overview = clean(
          document.querySelector(
            "#header-menu-desktop ~ div.node.section-zero.section div.zero-layer-axis.lg-left.lg-middle p"
          ).textContent
        );
      } catch (error) {}
      let about = "";
      temp = Array.from(
        document.querySelectorAll(
          "div.node.widget-text.cr-text.widget.xs-hidden.links-on-black-text p"
        )
      );
      try {
        for (let i = 0; i < temp.length; i++) {
          if (temp[i].textContent) {
            about = temp[i].textContent;
            break;
          }
        }
      } catch (error) {}
      let nearby_place = [];
      temp = Array.from(
        document.querySelectorAll(
          ".node.section-clear.section div.node.widget-grid.widget.xs-hidden div.grid.valign-middle.paddings-40px.xs-wrap div.gridwrap div.col div.cont div.node.widget-element.widget div.cont .node p "
        )
      );
      let one = "";
      try {
        temp.forEach((e) => {
          try {
            one = e.textContent;
          } catch (error) {}
          if (one) nearby_place.push(clean(one));
        });
      } catch (error) {}

      let images = Array.from(
        document.querySelectorAll(".gallery1-image.fancybox")
      );
      let all_images = [];
      images.forEach((e) => {
        all_images.push(e.href);
      });
      all_images = [...new Set(all_images)];
      let images_sup = [];
      let temp_img = document.querySelector(
        ".node.widget-image.widget.xs-hidden  .bgnormal img"
      );
      try {
        images_sup.push(temp_img.src);
      } catch (error) {}

      let cover_img = "";
      try {
        cover_img = document.querySelector(".node.layer.layer-image a img").src;
      } catch (error) {}
      temp = Array.from(
        document.querySelectorAll(
          ".node.section-clear.section.font-text-opensanslight.font-header-opensanslight"
        )
      );
      let all = {};
      let t = "";
      let d = "";
      temp.forEach((e) => {
        if (e.querySelector("h2")) {
          if (/how/i.test(e.querySelector("h2").textContent)) {
            t = e.querySelector("h2").textContent;
            d = e.querySelector(
              ".node.section-clear.section.font-text-opensanslight.font-header-opensanslight .node.widget-text.cr-text.widget.xs-hidden p"
            ).textContent;
            all[t] = d;
          }
        }
      });
      temp = Array.from(
        document.querySelectorAll(
          ".node.widget-text.cr-text.widget:not(.lg-hidden)"
        )
      );
      let tit2 = "";
      let tit3 = "";
      for (let i = 0; i < temp.length; i++) {
        if (temp[i].querySelector("h2")) {
          try {
            tit2 = temp[i].querySelector("h2").textContent;
          } catch (error) {}
          if (/Invest/i.test(tit2)) {
            t = tit2;
            d = temp[i + 1].textContent;
            all[t] = d;
          }
          if (/Meraas Nikki Beach/i.test(tit2)) {
            t = tit2;
            d = temp[i + 1].textContent;
            all[t] = d;
          }
          if (/Attractions/i.test(tit2)) {
            t = tit2;
            d = temp[i + 1].textContent;
            all[t] = d;
          }
          if (/Real Estate/i.test(tit2)) {
            t = tit2;
            d = temp[i + 1].textContent;
            all[t] = d;
          }
          if (/Transport/i.test(tit2)) {
            t = tit2;
            d = temp[i + 1].textContent;
            all[t] = d;
          }
          if (/Off-Plan Projects/i.test(tit2)) {
            t = tit2;
            d = temp[i + 1].textContent;
            all[t] = d;
          }
          if (/Best Properties/i.test(tit2)) {
            t = tit2;
            d = temp[i + 1].textContent;
            all[t] = d;
          }
          if (/Location/i.test(tit2)) {
            t = tit2;
            d = temp[i + 1].textContent;
            all[t] = d;
          }
          if (/Economic/i.test(tit2)) {
            t = tit2;
            d = temp[i + 1].textContent;
            all[t] = d;
          }
          if (/Transactions/i.test(tit2)) {
            t = tit2;
            d = temp[i + 1].textContent;
            all[t] = d;
          }
          if (/About/i.test(tit2)) {
            t = tit2;
            d = temp[i + 1].textContent;
            all[t] = d;
          }
          if (/Sightseeing/i.test(tit2)) {
            t = tit2;
            d = temp[i + 1].textContent;
            all[t] = d;
          }
          if (/Interesting Objects/i.test(tit2)) {
            t = tit2;
            d = temp[i + 1].textContent;
            all[t] = d;
          }
        }
        // -----------h3---------
        if (temp[i].querySelector("h3")) {
          try {
            tit3 = temp[i].querySelector("h3").textContent;
          } catch (error) {}
          if (/Attractions/i.test(tit3)) {
            t = tit3;
            d = temp[i + 1].textContent;
            all[t] = d;
          }
          if (/Interesting Objects/i.test(tit3)) {
            t = tit3;
            d = temp[i + 1].textContent;
            all[t] = d;
          }
          if (/Investors/i.test(tit3)) {
            t = tit3;
            d = temp[i + 1].textContent;
            all[t] = d;
          }
          if (/Sightseeing/i.test(tit3)) {
            t = tit3;
            d = temp[i + 1].textContent;
            all[t] = d;
          }
          if (/Real Estate/i.test(tit3)) {
            t = tit3;
            d = temp[i + 1].textContent;
            all[t] = d;
          }
          if (/Transactions/i.test(tit3)) {
            t = tit3;
            d = temp[i + 1].textContent;
            all[t] = d;
          }
          if (/Investment/i.test(tit3)) {
            t = tit3;
            d = temp[i + 1].textContent;
            all[t] = d;
          }
          if (/Economic/i.test(tit3)) {
            t = tit3;
            d = temp[i + 1].textContent;
            all[t] = d;
          }
          if (/About/i.test(tit3)) {
            t = tit3;
            d = temp[i + 1].textContent;
            all[t] = d;
          }
          if (/Best Projects/i.test(tit3)) {
            t = tit3;
            d = temp[i + 1].textContent;
            all[t] = d;
          }
          if (/Transport/i.test(tit3)) {
            t = tit3;
            d = temp[i + 1].textContent;
            all[t] = d;
          }
          if (/ROI/i.test(tit3)) {
            t = tit3;
            d = temp[i + 1].textContent;
            all[t] = d;
          }
          if (/Best Property /i.test(tit3)) {
            t = tit3;
            d = temp[i + 1].textContent;
            all[t] = d;
          }
          if (/Landmarks/i.test(tit3)) {
            t = tit3;
            d = temp[i + 1].textContent;
            let s = i + 2;
            while (s < temp.length) {
              if (
                !(temp[s].querySelector("h2") || temp[s].querySelector("h3"))
              ) {
                try {
                  d += temp[s].textContent;
                  s++;
                } catch (error) {}
              } else {
                break;
              }
            }
            all[t] = d;
            i = s - 1;
          }
        }
      }

      return {
        title: title,
        price: price,
        info: info,
        handover: handover,
        overview_title: overview_title,
        overview: overview,
        about: about,
        nearby_place: nearby_place,
        cover_img: cover_img,
        all_images: all_images,
        images_sup: images_sup,
        signaturea: Date.now(),
        all_content: all,
      };
    })
  );
  console.log(backgroundImage);

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("area", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://opr.ae/areas/page/${i}`;
  if (i == 1) {
    target = "https://opr.ae/areas";
  }
  console.log(target);
  await page.goto(target);
  const links = await page.evaluate(() => {
    let all = [];
    let link = Array.from(document.querySelectorAll(".s-elements-cellwrapper"));
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
