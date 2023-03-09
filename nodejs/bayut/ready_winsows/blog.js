const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/blog${batch}.csv`,
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

let csvErrr = csv_error_handler("blog");
let csvWriter = csv_handler("blog", 1);
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
        title = clean(document.titles.split("-")[0]);
      } catch (error) {}
      let sections = [
        ...document.querySelectorAll(
          ".entry-content.blog_post_text.blog_post_description.clearfix>*"
        ),
      ];
      let content = [];
      for (let i = 0; i < sections.length; i++) {
        let section = sections[i];
        let all_content = {};
        let titles = "";
        let des = [];
        if (
          section.tagName === "H1" ||
          section.tagName === "H2" ||
          section.tagName === "H3" ||
          section.tagName === "H4" ||
          section.tagName === "H5" ||
          section.tagName === "H6"
        ) {
          try {
            titles = section.textContent;
          } catch (error) {}
          let s = i + 1;
          while (s < sections.length) {
            let tds = [];
            let temp3 = sections[s];
            if (temp3.tagName === "P") {
              des.push(clean(temp3.textContent));
              s++;
            } else if (temp3.tagName === "UL") {
              let li = Array.from(temp3.querySelectorAll("li"));
              li.forEach((e) => {
                try {
                  des.push(clean(e.textContent));
                } catch (error) {}
              });
              s++;
            } else if (temp3.tagName === "TABLE") {
              let th = Array.from(temp3.querySelectorAll("tr"));

              for (let m = 0; m < th.length; m++) {
                let td = Array.from(th[m].querySelectorAll("td"));
                td.forEach((e) => {
                  tds.push(clean(e.textContent));
                });
                des.push(JSON.stringify(tds));
              }
              s++;
            } else if (
              temp3.tagName === "H1" ||
              temp3.tagName === "H2" ||
              temp3.tagName === "H3" ||
              temp3.tagName === "H4" ||
              temp3.tagName === "H5" ||
              temp3.tagName === "H6"
            ) {
              break;
            } else {
              s++;
            }
          }
          all_content[titles] = des;
          i = s - 1;
        } else {
          continue;
        }
        content.push(JSON.stringify(all_content));
      }
      let cover_img = "";
      try {
        cover_img = clean(
          document.querySelector(
            "main .row .col12.featured-single-post  .post_banner img"
          ).src
        );
      } catch (error) {}
      let images = [];
      let temp = Array.from(
        document.querySelectorAll(
          ".entry-content.blog_post_text.blog_post_description.clearfix figure img"
        )
      );
      temp.forEach((e) => {
        try {
          images.push(clean(e.src));
        } catch (error) {}
      });
      return {
        title: title,
        content: content,
        cover_img: cover_img,
        images: images,
        signaturea: Date.now(),
      };
    })
  );

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("blog", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://www.bayut.com/mybayut/page/${i}/`;
  if (i == 1) {
    target = "https://www.bayut.com/mybayut";
  }
  console.log(target);
  await page.goto(target);
  await page.waitForSelector(".entry-title.title.post_title a");
  const links = await page.evaluate(() => {
    const anchors = Array.from(
      document.querySelectorAll(".entry-title.title.post_title a"),
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
  for (let i = 1; i <= 526; i++) {
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
