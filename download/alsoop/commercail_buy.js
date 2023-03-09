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
    path: `${directory}/buy_commercail_alsop${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "price", title: "price" },
      { id: "Bedrooms", title: "Bedrooms" },
      { id: "Bathrooms", title: "Bathrooms" },
      { id: "size", title: "size" },
      { id: "description", title: "description" },
      { id: "agent", title: "agent" },
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

let csvErrr = csv_error_handler("buy_commercail_alsop");
let csvWriter = csv_handler("buy_commercail_alsop", 1);
let batch = 0;
let j = 0;
let main_err_record = 0;
let visit_err_record = 0;

async function visit_each(link, page) {
  // await page.setCacheEnabled(false);
  await page.goto(link);
  let data = [];
  //   await page.waitForSelector(".gallery_content .regular.slider.center img");
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
        title = document.title;
      } catch (error) {}
      let description = "";
      try {
        description = clean(
          document.querySelector(".tower_description").textContent
        );
      } catch (error) {}
      let agent = "";
      let price = "";
      let Bedrooms = "";
      let Bathrooms = "";
      let size = "";
      try {
        price = clean(
          document.querySelector(".tower_detail .price").textContent
        );
      } catch (error) {}
      try {
        Bedrooms = clean(
          document.querySelectorAll(".tower_detail .about_tour div")[0]
            .textContent
        );
      } catch (error) {}
      try {
        size = clean(
          document.querySelectorAll(".tower_detail .about_tour div")[2]
            .textContent
        );
      } catch (error) {}
      try {
        Bathrooms = clean(
          document.querySelectorAll(".tower_detail .about_tour div")[1]
            .textContent
        );
      } catch (error) {}
      try {
        agent = clean(document.querySelector(".agent_name h5").textContent);
      } catch (error) {}
      let temp = Array.from(
        document.querySelectorAll(
          ".slick-list .slick-slide:not(.slick-cloned) img"
        )
      );
      let images = [];
      temp.forEach((e) => {
        try {
          images.push(clean(e.src));
        } catch (error) {}
      });
      images = [...new Set(images)];
      //   console.log(images.length);
      return {
        title: title,
        price: price,
        Bedrooms: Bedrooms,
        Bathrooms: Bathrooms,
        size: size,
        description: description,
        agent: agent,
        images: images,
        signaturea: Date.now(),
      };
    })
  );
  //   const exist_imgs = await page.evaluate(() => {
  //     return document.querySelector(".image_count_content") !== null;
  //   });
  //   let images = [];
  //   if (exist_imgs) {
  //     await page.click(".image_count_content div");
  //     images = await page.evaluate(() => {
  //       let temp = Array.from(
  //         document.querySelectorAll(".slick-slide img.mx-auto")
  //       );
  //       let imgs = [];
  //       temp.forEach((e) => {
  //         try {
  //           imgs.push(e.src);
  //         } catch (error) {}
  //       });
  //       return [...new Set(imgs)];
  //     });
  //     console.log(images);
  //     console.log(images.length);
  //   } else {
  //     console.log("no imgs");
  //   }
  //   data[0].images = images;

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("buy_commercail_alsop", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://www.allsoppandallsopp.com/dubai/properties/commercial/sales/page-${i}`;
  if (i == 1) {
    target =
      "https://www.allsoppandallsopp.com/dubai/properties/commercial/sales";
  }
  console.log(target);
  await page.goto(target);
  const links = await page.evaluate(() => {
    let all = [];
    let link = Array.from(document.querySelectorAll(".results_card >a"));
    link.forEach((e) => {
      let a = e.href;
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
  if (i == 1 || i % 20 == 0 || i == 6) {
    const message = `Done - buy_coom_alsop_alsop  ${i} done`;

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
    if (i == 6) {
      exec("pm2 stop main_alsop", (error, stdout, stderr) => {
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

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/usr/bin/google-chrome-stable",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  // let plans_data = {};
  for (let i = 1; i <= 6; i++) {
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
