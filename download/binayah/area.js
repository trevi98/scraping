const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");
const axios = require("axios");
const { exec } = require("child_process");
function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/area_offplan${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "description", title: "description" },
      { id: "cover_image", title: "cover_image" },
      { id: "amenities", title: "amenities" },
      { id: "Nearby_Attractions", title: "Nearby_Attractions" },
      { id: "Neighborhoods", title: "Neighborhoods" },
      { id: "map_plan", title: "map_plan" },
      { id: "images", title: "images" },
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

let csvErrr = csv_error_handler("area_offplan");
let csvWriter = csv_handler("area_offplan", 1);
let batch = 0;
let j = 0;
let main_err_record = 0;
let visit_err_record = 0;

async function visit_each(link, page, cover_image) {
  // await page.setCacheEnabled(false);
  await page.goto(link);
  let data = [];
  data.push(
    await page.evaluate(async () => {
      //   await page.waitForTimeout(1000);

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
      let description = "";
      try {
        description = clean(
          document.querySelector(
            "div.wpb_text_column.wpb_content_element div.wpb_wrapper"
          ).textContent
        );
      } catch (error) {
        try {
          description = clean(
            document.querySelectorAll("div.elementor-widget-container")[3]
              .textContent
          );
        } catch (error) {}
      }
      let amenities = [];
      let temp;
      temp = Array.from(document.querySelectorAll(".vc_info_list_outer"));
      if (temp.length === 0)
        temp = Array.from(
          document.querySelectorAll(
            ".elementor-widget-image + .elementor-element.elementor-widget.elementor-widget-text-editor"
          )
        );
      temp.forEach((e) => {
        try {
          amenities.push(clean(e.textContent));
        } catch (error) {}
      });
      let Nearby_Attractions = {};
      let Nearby_Attractions_list = [];
      temp = Array.from(document.querySelectorAll(".mega-info-footer"));
      temp.forEach((e) => {
        try {
          Nearby_Attractions[e.querySelector("h3").textContent] =
            e.querySelector("p").textContent;
        } catch (error) {}
      });
      Nearby_Attractions_list.push(JSON.stringify(Nearby_Attractions));
      let Neighborhoods_list = [];
      let Neighborhoods = {};
      temp = Array.from(
        document.querySelectorAll(
          ".elementor-section.elementor-inner-section.elementor-element.elementor-hidden-mobile.elementor-section-boxed.elementor-section-height-default.elementor-section-height-default p"
        )
      );
      let j = 0;
      for (; j < temp.length; ) {
        try {
          Neighborhoods[temp[j].textContent] = temp[j + 1].textContent;
        } catch (error) {}
        j += 2;
      }
      Neighborhoods_list.push(JSON.stringify(Neighborhoods));
      let map_plan = "";
      try {
        map_plan = document.querySelector("div.mega_wrap img").src;
      } catch (error) {}
      return {
        title: title,
        description: description,
        amenities: amenities,
        Nearby_Attractions: Nearby_Attractions_list,
        Neighborhoods: Neighborhoods_list,
        map_plan: map_plan,
      };
    })
  );
  data[0].cover_image = cover_image;
  // try {
  //   await page.waitForSelector(".vc_gitem-zone-img");
  // } catch (error) {
  //   await page.waitForSelector(
  //     ".elementor-element.elementor-widget.elementor-widget-gallery a"
  //   );
  // }

  const exist = await page.evaluate(() => {
    return (
      document.querySelector(
        ".elementor-element.elementor-widget.elementor-widget-gallery"
      ) !== null
    );
  });
  let images;
  await page.keyboard.down("End");
  await page.waitForTimeout(5000);
  if (exist) {
    await page.click(
      ".elementor-element.elementor-widget.elementor-widget-gallery"
    );
    images = await page.evaluate(() => {
      let temp = Array.from(
        document.querySelectorAll(
          ".elementor-element.elementor-widget.elementor-widget-gallery a"
        )
      );
      let all = [];
      temp.forEach((e) => all.push(e.href));
      return all;
    });
  } else {
    if (
      await page.evaluate(() => {
        return (
          document.querySelector(
            ".vc_grid-container.vc_clearfix.wpb_content_element.vc_media_grid a"
          ) !== null
        );
      })
    ) {
      await page.click(
        ".vc_grid-container.vc_clearfix.wpb_content_element.vc_media_grid a"
      );
    }
    images = await page.evaluate(() => {
      let temp = Array.from(
        document.querySelectorAll(
          ".vc_grid-container.vc_clearfix.wpb_content_element.vc_media_grid a"
        )
      );
      let all = [];
      temp.forEach((e) => all.push(e.href));
      return all;
    });
  }
  data[0].images = images;

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("area_offplan", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = "https://www.binayah.com/dubai-communities/";
  console.log(target);
  await page.goto(target);
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight / 2);
  });
  await page.waitForTimeout(6000);
  await page.keyboard.down("End");
  await page.waitForTimeout(6000);
  await page.keyboard.down("Home");
  await page.waitForTimeout(6000);
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight / 2);
  });

  const links = await page.evaluate(() => {
    let all = [];
    let link = Array.from(document.querySelectorAll(".listing-thumb"));
    link.forEach((e) => {
      let a = e.querySelector("a").href;
      let cover_image = e.querySelector(
        "a .img-fluid.wp-post-image.lazyloaded"
      ).src;
      all.push({ link: a, cover_image: cover_image });
    });
    let uniqe_links = [...new Set(all)];
    return uniqe_links;
  });
  console.log(links);
  console.log(links.length);
  for (const link of links) {
    try {
      await visit_each(link.link, page, link.cover_image);
    } catch (error) {
      try {
        await visit_each(link.link, page, link.cover_image);
      } catch (err) {
        try {
          await visit_each(link.link, page, link.cover_image);
        } catch (error) {
          console.error(error);
          csvErrr
            .writeRecords({ link: link.link, error: err })
            .then(() => console.log("error logged main loop"));
          continue;
        }
      }
    }
    if (
      links.indexOf(link) === 0 ||
      (links.indexOf(link) + 1) % 20 == 0 ||
      links.indexOf(link) === links.length - 1
    ) {
      const message = `Done - area_offplan  ${links.indexOf(link) + 1} done`;

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
      if (links.indexOf(link) === links.length - 1) {
        exec("pm2 stop main_binayah", (error, stdout, stderr) => {
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
