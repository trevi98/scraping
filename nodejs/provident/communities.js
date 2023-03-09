const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/communities${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "description", title: "description" },
      { id: "content", title: "content" },
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

let csvErrr = csv_error_handler("communities");
let csvWriter = csv_handler("communities", 1);
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

      let title = clean(
        document.querySelector(
          "div.col-sm-12.col-xs-12.col-lg-9.col-md-9.container-contentbar h1.development-header"
        ).textContent
      );
      let temp = Array.from(
        document.querySelectorAll(
          "div.wpb_text_column.wpb_content_element  div.wpb_wrapper .DB_content >*"
        )
      );
      if (temp.length == 0) {
        temp = Array.from(
          document.querySelectorAll(
            "div.wpb_text_column.wpb_content_element  div.wpb_wrapper >*"
          )
        );
      }
      let description = "";
      let content = [];

      let a = 0;
      while (true) {
        if (temp[a].tagName === "P") {
          try {
            description += clean(temp[a].textContent);
          } catch (error) {}
          a++;
        } else {
          break;
        }
      }
      for (let i = 0; i < temp.length; i++) {
        let title = "";
        let des = [];
        let all_content = {};
        if (
          temp[i].tagName === "H1" ||
          temp[i].tagName === "H2" ||
          temp[i].tagName === "H3" ||
          temp[i].tagName === "H4" ||
          temp[i].tagName === "H5" ||
          temp[i].tagName === "H6"
        ) {
          try {
            title = clean(temp[i].textContent);
          } catch (error) {}
          let s = i + 1;
          while (s < temp.length) {
            if (
              temp[s].tagName === "H1" ||
              temp[s].tagName === "H2" ||
              temp[s].tagName === "H3" ||
              temp[s].tagName === "H4" ||
              temp[s].tagName === "H5" ||
              temp[s].tagName === "H6"
            ) {
              break;
            } else if (temp[s].tagName == "UL") {
              let te = Array.from(temp[s].querySelectorAll("li"));
              te.forEach((e) => {
                try {
                  des.push(clean(e.textContent));
                } catch (error) {}
              });
              s++;
            } else if (temp[s].tagName === "P") {
              try {
                des.push(clean(temp[s].textContent));
              } catch (error) {}
              s++;
            } else {
              continue;
              s++;
            }
          }
          all_content[title] = des;
          i = s - 1;
          content.push(JSON.stringify(all_content));
        }
      }
      if (content.length === 0) {
        content.push(
          document.querySelector(
            "article.dubai-developments.type-dubai-developments.status-publish.has-post-thumbnail.hentry .entry-content"
          ).textContent
        );
      }
      return {
        title: title,
        description: description,
        content: content,
      };
    })
  );

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("communities", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://www.providentestate.com/dubai-developments.html/page/${i}`;
  if (i == 1) {
    target = "https://www.providentestate.com/dubai-developments.html";
  }
  console.log(target);
  await page.goto(target);
  const links = await page.evaluate(() => {
    let link = Array.from(
      document.querySelectorAll(
        "div.row.blog-masonry div.element-item.devPage div.post-item.post_bg a"
      )
    );
    let all = [];
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
