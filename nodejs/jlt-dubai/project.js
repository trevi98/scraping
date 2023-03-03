const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/project${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "content", title: "content" },
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

let csvErrr = csv_error_handler("project");
let csvWriter = csv_handler("project", 1);
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
      let images = [];
      let temp = Array.from(document.querySelectorAll(".img_gal img"));
      temp.forEach((e) => {
        try {
          images.push(clean(e.src));
        } catch (error) {}
      });
      images = [...new Set(images)];
      let sections = [...document.querySelectorAll(".detailtext article>*")];
      let content = [];
      for (let i = 0; i < sections.length; i++) {
        let all_content = {};
        let titles = "";
        let des = [];
        let temp2 = sections[i];
        if (
          temp2.tagName === "H3" ||
          temp2.tagName === "H4" ||
          temp2.tagName === "H5" ||
          temp2.tagName === "H2"
        ) {
          try {
            titles = temp2.textContent;
          } catch (error) {}
          let s = i + 1;
          let res = [];
          while (s < sections.length) {
            let temp3 = sections[s];
            if (
              temp3.tagName === "H3" ||
              temp3.tagName === "H4" ||
              temp3.tagName === "H5" ||
              temp3.tagName === "H2"
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
          i = s - 1;
        }

        content.push(JSON.stringify(all_content));
      }

      return {
        title: title,
        content: content,
        images: images,
        signaturea: Date.now(),
      };
    })
  );

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("project", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://www.jlt-dubai.com/jumeirah-lake-towers-projects.html`;
  console.log(target);
  await page.goto(target);
  const links = await page.evaluate(() => {
    let all = [];
    let link = Array.from(document.querySelectorAll(".viewdetail a"));
    link.forEach((e) => {
      all.push(e.href);
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
