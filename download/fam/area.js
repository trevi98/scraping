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
    path: `${directory}/area${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "about", title: "about" },
      { id: "signaturea", title: "signaturea" },
      { id: "cover_img", title: "cover_img" },
      { id: "number_of_project", title: "number_of_project" },
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
        title = clean(document.querySelector("#project h1").textContent);
      } catch (error) {}
      let about = [];
      let temp = Array.from(
        document.querySelectorAll("#R22095475096408413836 >*")
      );
      temp.forEach((e) => {
        try {
          about.push(clean(e.textContent));
        } catch (error) {}
      });

      return {
        title: title,
        about: about,
        signaturea: Date.now(),
      };
    })
  );
  data[0].cover_img = link.cover_img;
  data[0].number_of_project = link.number_of_project;

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("area", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page) {
  let target = `https://famproperties.com/dubai-property-areas`;

  console.log(target);
  await page.goto(target);
  let links = await page.evaluate(() => {
    let all = [];
    let link = Array.from(
      document.querySelectorAll(".row .t-Cards-item.area-list-card-bg")
    );
    link.forEach((e) => {
      let a = e.querySelector(".t-Card-wrap").href;
      let cover_img = "";
      try {
        cover_img = e.querySelector("img").getAttribute("data-src");
      } catch (error) {
        cover_img = e.querySelector("img").src;
      }
      let number_of_project = e.querySelector(
        ".col.col-3.project-count h5"
      ).textContent;
      all.push({
        link: a,
        cover_img: cover_img,
        number_of_project: number_of_project,
      });
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
    if (
      links.indexOf(link) === 0 ||
      links.indexOf(link) % 20 === 0 ||
      links.indexOf(link) === links.length - 1
    ) {
      const message = `Data -  Fam area ${links.indexOf(link) + 1} done`;

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
