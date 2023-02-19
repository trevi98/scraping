const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/opr_faq${batch}.csv`,
    header: [
      { id: "qeustion", title: "qeustion" },
      { id: "answer", title: "answer" },
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

let csvErrr = csv_error_handler("opr_faq");
let csvWriter = csv_handler("opr_faq", 1);
let batch = 0;
let j = 0;
let main_err_record = 0;
let visit_err_record = 0;

// async function clean(text){
//   try{

//     return text.replace('\n','').replace('\r','').replace('\t','').replace('  ','');
//   }catch(error){
//     return text;
//   }
// }

async function visit_each(link, page) {
  // await page.setCacheEnabled(false);
  await page.goto(link);
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
  let data = [];
  data.push(
    await page.evaluate(async () => {
      let qeustion = "";
      try {
        qeustion = clean(
          document.querySelector(
            "div#header-menu-mobile ~ div.node.section-clear.section.menu2 div.node.widget-text.cr-text.widget.lg-hidden p.textable"
          ).textContent
        );
      } catch (error) {}
      let answer = "";
      try {
        answer = clean(
          document.querySelector(
            "div.node.widget-text.cr-text.widget.links-on-black-text p"
          ).textContent
        );
      } catch (error) {}
      return {
        qeustion: qeustion,
        answer: answer,
      };
    })
  );

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("opr_faq", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://opr.ae/faq/${i}`;
  if (i == 1) {
    target = "https://opr.ae/faq";
  }
  console.log(target);
  await page.goto(target);
  const links = await page.evaluate(() => {
    let all = [];
    let link = Array.from(
      document.querySelectorAll(
        "div.spoiler0-container.is-collapsed div.cont div#faq-more-link.node.widget-text.cr-text.widget.faq-more-link p"
      )
    );
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
