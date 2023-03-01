const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/area${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "content", title: "content" },
      { id: "images", title: "images" },
      { id: "cover_img", title: "cover_img" },
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

let csvErrr = csv_error_handler("area");
let csvWriter = csv_handler("area", 1);
let batch = 0;
let j = 0;
let main_err_record = 0;
let visit_err_record = 0;

async function visit_each(link, page) {
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
        title = clean(document.title.split("»")[0]);
      } catch (error) {}
      let sections = [
        ...document.querySelectorAll("main section:not(#primary)"),
      ];
      let content = [];
      for (let i = 0; i < sections.length; i++) {
        let section = sections[i];
        let temp1 = section.children;
        let q = temp1.length;
        let all_content = {};
        for (let j = 0; j < q; j++) {
          let titles = "";
          let des = [];
          let temp2 = temp1[j];
          if (
            temp2.tagName === "H3" ||
            temp2.tagName === "H4" ||
            temp2.tagName === "H5"
          ) {
            try {
              titles = temp2.textContent;
            } catch (error) {}
            let s = j + 1;
            let res = [];
            while (s < q) {
              let temp3 = temp1[s];
              if (
                temp3.tagName === "H3" ||
                temp3.tagName === "H4" ||
                temp3.tagName === "H5"
              ) {
                break;
              } else if (
                temp3.tagName === "STYLE" ||
                temp3.tagName === "FIGURE"
              ) {
                s++;
                continue;
              } else {
                res.push(clean(temp3.textContent));
                s++;
              }
            }
            des.push(res);
            all_content[titles] = des;
            j = s - 1;
          }
        }
        content.push(JSON.stringify(all_content));
      }
      let cover_img = "";
      try {
        cover_img = clean(document.querySelector(".post_banner img").src);
      } catch (error) {}
      let images = [];
      let temp = Array.from(document.querySelectorAll(".wp-block-image img"));
      temp.forEach((e) => {
        try {
          images.push(clean(e.src));
        } catch (error) {}
      });
      return {
        title: title,
        content: content,
        signaturea: Date.now(),
      };
    })
  );

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
  let target = `https://www.bayut.com/area-guides/dubai/page/${i}/`;
  if (i == 1) {
    target = "https://www.bayut.com/area-guides/dubai";
  }
  console.log(target);
  await page.goto(target);
  await page.waitForSelector(".post_banner a");
  const links = await page.evaluate(() => {
    const anchors = Array.from(
      document.querySelectorAll(".post_banner a"),
      (a) => a.href
    );
    let uniqe_links = [...new Set(anchors)];
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
          .then(() => console.log("error logged visit"));
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
  for (let i = 1; i <= 91; i++) {
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
