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
    path: `${directory}/developers${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "about", title: "about" },
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

let csvErrr = csv_error_handler("developers");
let csvWriter = csv_handler("developers", 1);
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
        title = clean(document.title);
      } catch (error) {}
      let about = "";
      let temp = Array.from(
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
      temp = Array.from(
        document.querySelectorAll(
          ".node.widget-text.cr-text.widget:not(.lg-hidden)"
        )
      );
      let all = {};
      let tit2 = "";
      let tit3 = "";
      for (let i = 0; i < temp.length; i++) {
        if (temp[i].querySelector("h2")) {
          try {
            tit2 = temp[i].querySelector("h2").textContent;
          } catch (error) {}
          if (/offplan project/i.test(tit2)) {
            t = tit2;
            d = temp[i + 1].textContent;
            all[t] = d;
          }
          if (/best properties/i.test(tit2)) {
            t = tit2;
            d = temp[i + 1].textContent;
            all[t] = d;
          }
        }
        if (temp[i].querySelector("h3")) {
          try {
            tit3 = temp[i].querySelector("h3").textContent;
          } catch (error) {}
          if (/offplan project/i.test(tit3)) {
            t = tit2;
            d = temp[i + 1].textContent;
            all[t] = d;
          }
          if (/best properties/i.test(tit3)) {
            t = tit2;
            d = temp[i + 1].textContent;
            all[t] = d;
          }
        }
      }
      let all_content = [];
      all_content.push(JSON.stringify(all));

      return {
        title: title,
        about: about,
        all_content: all_content,
      };
    })
  );

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("developers_opr", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://opr.ae/developers`;

  console.log(target);
  await page.goto(target);
  const links = await page.evaluate(() => {
    let all = [];
    let link = Array.from(
      document.querySelectorAll(
        ".s-elements-grid.valign-top.halign-center.use-flex .node.widget-element.widget .btn.btn-legacy.hvr-fade"
      )
    );
    link.forEach((e) => {
      let a = e.href;
      all.push(a);
    });
    let uniqe_links = [...new Set(all)];
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
      const message = `Data -  opr developers ${links.indexOf(link) + 1} done`;

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
