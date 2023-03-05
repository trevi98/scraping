const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");
const { on } = require("events");
const axios = require("axios");
const { exec } = require("child_process");
function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/ultra_luxury_projects${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "price", title: "price" },
      { id: "Lifestyle", title: "Lifestyle" },
      { id: "type", title: "type" },
      { id: "area", title: "area" },
      { id: "title_type", title: "title_type" },
      { id: "Completion_data", title: "Completion_data" },
      { id: "developer", title: "developer" },
      { id: "payment_plan", title: "payment_plan" },
      { id: "overview", title: "overview" },
      { id: "overview_img", title: "overview_img" },
      { id: "amenities", title: "amenities" },
      { id: "buildings", title: "buildings" },
      { id: "properties", title: "properties" },
      { id: "Nearby_places", title: "Nearby_places" },
      { id: "Nearby_schools", title: "Nearby_schools" },
      { id: "cover_img", title: "cover_img" },
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

let csvErrr = csv_error_handler("ultra_luxury_projects");
let csvWriter = csv_handler("ultra_luxury_projects", 1);
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
      let price = "";
      try {
        price = clean(
          document.querySelector(
            ".sub-heading.padding-top-lg.padding-bottom-lg.u-textLeft.padding-left-md"
          ).textContent
        );
        price = price.replace(price.match(/starting price/i)[0], "");
      } catch (error) {}
      let Lifestyle = "";
      let type = "";
      let title_type = "";
      let Completion_data = "";
      let developer = "";
      temp = Array.from(
        document.querySelectorAll(
          ".property-highlights.project.info-based li .highlight-option"
        )
      );
      temp.forEach((e) => {
        let key = clean(e.querySelector("span").textContent);
        let value = clean(e.textContent);
        if (/Developer/i.test(key)) {
          developer = value;
          developer = developer.replace(key, "");
        }
        if (/Lifestyle/i.test(key)) {
          Lifestyle = value;
          Lifestyle = Lifestyle.replace(key, "");
        }
        if (/Completion date/i.test(key)) {
          Completion_data = value;
          Completion_data = Completion_data.replace(key, "");
        }
        if (/Title type/i.test(key)) {
          title_type = value;
          title_type = title_type.replace(key, "");
        }
        if (/Type/i.test(key) && !/Title type/i.test(key)) {
          type = value;
          type = type.replace(key, "");
        }
      });
      let payment_plan = [];
      let payment_plan_all = {};
      temp = Array.from(
        document.querySelectorAll(
          "#report_24261508315928286013_catch li .t-Card-title"
        )
      );
      temp.forEach((e) => {
        try {
          payment_plan_all[clean(e.querySelector("h3").textContent)] = clean(
            e.querySelector("h4").textContent
          );
        } catch (error) {}
      });
      payment_plan.push(JSON.stringify(payment_plan_all));
      let amenities = [];
      temp = Array.from(
        document.querySelectorAll(
          "#R22528583529857287712_Cards .a-CardView-items.a-CardView-items--grid4col li"
        )
      );
      temp.forEach((e) => {
        try {
          amenities.push(clean(e.textContent));
        } catch (error) {}
      });
      let overview = "";
      try {
        overview = clean(document.querySelector("#overview").textContent);
      } catch (error) {}
      let overview_img = "";
      try {
        overview_img = document.querySelector("#overview img").src;
      } catch (error) {}

      let buildings = [];
      temp = Array.from(document.querySelectorAll("#building-types_Cards li"));
      temp.forEach((e) => {
        try {
          buildings.push(clean(e.textContent));
        } catch (error) {}
      });
      let properties = [];
      temp = Array.from(
        document.querySelectorAll("#listings  .t-Report-report tbody tr")
      );
      temp.forEach((e) => {
        try {
          properties.push({
            title: clean(
              e.querySelector(
                "#listings  .t-Report-report tbody tr td[headers='TITLE'] "
              ).textContent
            ),
            type: clean(
              e.querySelector(
                "#listings  .t-Report-report tbody tr td[headers='PROPERTY'] p"
              ).textContent
            ),
            beds_baths: clean(
              e.querySelector(
                "#listings  .t-Report-report tbody tr td[headers='PROPERTY'] span"
              ).textContent
            ),
            price: clean(
              e.querySelector(
                "#listings  .t-Report-report tbody tr td[headers='PRICE'] span"
              ).textContent
            ),
            size: clean(
              e.querySelector(
                "#listings  .t-Report-report tbody tr td[headers='PRICE'] p"
              ).textContent
            ),
          });
        } catch (error) {}
      });
      let Nearby_places = [];
      temp = Array.from(
        document.querySelectorAll("#R28303583548336170062_Cards li")
      );
      temp.forEach((e) => {
        try {
          Nearby_places.push(clean(e, textContent));
        } catch (error) {}
      });
      return {
        title: title,
        price: price,
        Lifestyle: Lifestyle,
        type: type,
        title_type: title_type,
        Completion_data: Completion_data,
        developer: developer,
        payment_plan: payment_plan,
        overview: overview,
        overview_img: overview_img,
        amenities: amenities,
        buildings: buildings,
        properties: properties,
        Nearby_places: Nearby_places,
        signaturea: Date.now(),
      };
    })
  );
  data[0].area = link.area;

  const backgroundImage = await page.evaluate(
    (el) => window.getComputedStyle(el).backgroundImage,
    await page.$(".main-banner.lozad")
  );
  data[0].cover_img = backgroundImage.slice(5, -2);

  const exist = await page.evaluate(() => {
    return (
      document.querySelector(
        ".a-GV-pageButton.a-GV-pageButton--nav.js-pg-next"
      ) !== null
    );
  });

  let s = [];
  if (exist) {
    await page.addStyleTag({
      content: "#marquizPopup { display: none !important; }",
    });
    await page.evaluate(() => {
      document.querySelectorAll("footer .row")[15].style.display = "none";
      document.querySelector("#marquizPopup").style.display = "none";
    });
    await page.click(".a-GV-pageButton.a-GV-pageButton--nav.js-pg-next");
    await page.waitForTimeout(500);
    s.push(
      JSON.stringify(
        await page.evaluate(() => {
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
          let temp = Array.from(
            document.querySelectorAll(
              "#R29114923532291890799_Cards .a-CardView-header"
            )
          );
          let ss = [];
          let title = "";
          let Curriculum = "";
          let Rating = "";
          temp.forEach((e) => {
            try {
              title = clean(e.querySelector("h3").textContent);
            } catch (error) {}
            try {
              Curriculum = e
                .querySelector("h4")
                .textContent.replace(
                  e.querySelector(" h4 span.u-color-4-text.padding-right-sm")
                    .textContent,
                  ""
                );
              Curriculum = clean(Curriculum);
            } catch (error) {}
            try {
              Rating = e
                .querySelectorAll("h4")[1]
                .textContent.replace(
                  e.querySelectorAll(
                    " h4 span.u-color-4-text.padding-right-sm"
                  )[1].textContent,
                  ""
                );
              Rating = clean(Rating);
            } catch (error) {}
            ss.push({ title, Curriculum, Rating });
          });
          return ss;
        })
      )
    );
    while (true) {
      if (
        await page.evaluate(() => {
          return (
            document
              .querySelector(".a-GV-pageButton.a-GV-pageButton--nav.js-pg-next")
              .getAttribute("disabled") !== null
          );
        })
      ) {
        break;
      }
      await page.evaluate(() => {
        document.querySelectorAll("footer .row")[15].style.display = "none";
        document.querySelector("#marquizPopup").style.display = "none";
      });
      await page.click(".a-GV-pageButton.a-GV-pageButton--nav.js-pg-next");
      await page.waitForTimeout(2000);

      s.push(
        JSON.stringify(
          await page.evaluate(() => {
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
            let temp = Array.from(
              document.querySelectorAll(
                "#R29114923532291890799_Cards .a-CardView-header"
              )
            );
            let ss = [];
            let title = "";
            let Curriculum = "";
            let Rating = "";
            temp.forEach((e) => {
              try {
                title = clean(e.querySelector("h3").textContent);
              } catch (error) {}
              try {
                Curriculum = e
                  .querySelector("h4")
                  .textContent.replace(
                    e.querySelector(" h4 span.u-color-4-text.padding-right-sm")
                      .textContent,
                    ""
                  );
                Curriculum = clean(Curriculum);
              } catch (error) {}
              try {
                Rating = e
                  .querySelectorAll("h4")[1]
                  .textContent.replace(
                    e.querySelectorAll(
                      " h4 span.u-color-4-text.padding-right-sm"
                    )[1].textContent,
                    ""
                  );
                Rating = clean(Rating);
              } catch (error) {}
              ss.push({ title, Curriculum, Rating });
            });
            return ss;
          })
        )
      );
    }
  } else {
    console.log("no");
  }
  data[0].Nearby_schools = s;

  const images = await page.evaluate(() => {
    return document.querySelector("#R23240284213309688160") !== null;
  });
  let all = [];
  if (images) {
    let len = await page.evaluate(() => {
      let le = Array.from(
        document.querySelectorAll(
          "#R23240284213309688160 .swiper-pagination.swiper-pagination-clickable.swiper-pagination-bullets.swiper-pagination-bullets-dynamic span"
        )
      );
      return le;
    });
    for (let i = 0; i < len.length; i++) {
      await page.click(
        "#R23240284213309688160 .fa.fa-chevron-circle-right.fa-3x"
      );
      await page.waitForTimeout(500);
    }
    await page.waitForTimeout(1000);
    all = await page.evaluate(() => {
      let images = [];
      let temp = Array.from(
        document.querySelectorAll("#R23240284213309688160 .swiper-slide img")
      );
      temp.forEach((e) => {
        try {
          images.push(e.src);
        } catch (error) {}
      });
      return images;
    });
    // console.log(all);
  } else {
    console.log("no");
  }
  data[0].images = [...new Set(all)];

  //   data[0]
  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("ultra_luxury_projects", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page) {
  let target = `https://famproperties.com/ultra-luxury-projects-dubai`;

  console.log(target);
  await page.goto(target);
  let links = [];
  // Use page.evaluate to interact with the popup and close it
  await page.evaluate(() => {
    const popup = document.querySelector("#marquizPopup");
    const closeButton = popup.querySelector(".fa.fa-times.fa-2x.closeMarquiz");
    closeButton.click();
  });
  while (true) {
    await page.evaluate(() => {
      document.querySelectorAll("footer .row")[15].style.display = "none";
      document.querySelector("#marquizPopup").style.display = "none";
    });
    await page.addStyleTag({
      content: "#marquizPopup { display: none !important; }",
    });
    await page.waitForSelector("#project_cards");
    await page.waitForTimeout(8000);
    links.push(
      await page.evaluate(() => {
        let all = [];
        let link = Array.from(
          document.querySelectorAll("#project_cards .t-Cards-item")
        );
        link.forEach((e) => {
          let a = e.querySelector("a").href;
          let area = e.querySelector(".fa.fa-map-pin-circle +a").textContent;
          all.push({ link: a, area: area });
        });
        let uniqe_links = [...new Set(all)];
        return uniqe_links;
      })
    );
    if (
      await page.evaluate(() => {
        return (
          document.querySelector(
            ".pagination .t-Button.t-Button--small.t-Button--noUI.t-Report-paginationLink.t-Report-paginationLink--next"
          ) !== null
        );
      })
    ) {
      await page.waitForSelector(
        ".pagination .t-Button.t-Button--small.t-Button--noUI.t-Report-paginationLink.t-Report-paginationLink--next"
      );
      await page.click(
        ".pagination .t-Button.t-Button--small.t-Button--noUI.t-Report-paginationLink.t-Report-paginationLink--next"
      );
    } else {
      break;
    }
  }
  let all = [];
  links.forEach((e) => {
    e.forEach((s) => all.push(s));
  });
  let all_links = [...new Set(all)];
  console.log(all_links.length);
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
    if (
      all_links.indexOf(link) === 0 ||
      all_links.indexOf(link) % 20 === 0 ||
      all_links.indexOf(link) === all_links.length - 1
    ) {
      const message = `Data -  Fam ultra-luxury_project ${
        all_links.indexOf(link) + 1
      } done`;

      const url = "https://profoundproject.com/tele/";

      axios
        .get(url, {
          params: {
            message: message,
          },
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
      if (all_links.indexOf(link) === all_links.length - 1) {
        exec("pm2 stop main", (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing command: ${error}`);
            return;
          }

          console.log(`stdout: ${stdout}`);
          console.error(`stderr: ${stderr}`);
        });
      }
    }
  }
}

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/usr/bin/google-chrome-stable",
    args: ["--no-sandbox"],
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
