const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");
function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/opr_blog${batch}.csv`,
    header: [
      { id: "titles", title: "titles" },
      { id: "description", title: "description" },
      { id: "list", title: "list" },
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

let csvErrr = csv_error_handler("opr_blog");
let csvWriter = csv_handler("opr_blog", 1);
let batch = 0;
let j = 0;
let main_err_record = 0;
let visit_err_record = 0;

async function visit_each(link, page) {
  await page.goto(link);
  let data = [];
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
  data.push(
    await page.evaluate(async () => {
      let titles = [];
      let temp = Array.from(document.querySelectorAll("h2"));
      temp.forEach((e) => {
        try {
          titles.push(clean(e.textContent));
        } catch (error) {}
      });
      let description = [];
      temp = Array.from(
        document.querySelectorAll(
          "div.node.widget-text.cr-text.widget.links-on-black-text p"
        )
      );
      temp.forEach((e) => {
        try {
          description.push(clean(e.textContent));
        } catch (error) {}
      });
      let list = [];
      temp = Array.from(
        document.querySelectorAll("div.node.widget-list.widget ul li")
      );
      temp.forEach((e) => {
        try {
          list.push(clean(e.textContent));
        } catch (error) {}
      });
      return {
        titles: titles,
        description: description,
        list: list,
      };
    })
  );

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("opr_blog", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://opr.ae/blog-${i}/`;
  if (i == 1) {
    target = "https://opr.ae/blog";
  }
  console.log(target);
  await page.goto(target);
  const links = await page.evaluate(() => {
    let link = Array.from(
      document.querySelectorAll(
        "div.s-elements-grid.valign-top.halign-center.use-flex div.s-elements-cell div.s-elements-cellwrapper div.cont.cell div.node.widget-element.widget div.cont div.node.widget-element.widget div.cont div.node.widget-button.widget div.button-container div.button-wrapper"
      )
    );
    let all = [];
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
        csvErrr
          .writeRecords({ link: link, error: err })
          .then(() => console.log("error logged"));
        continue;
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
        csvErrr
          .writeRecords({ link: i, error: error })
          .then(() => console.log("error logged"));
        continue;
      }
    }
  }
  await browser.close();
}

main();
