const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/builgings${batch}.csv`,
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

let csvErrr = csv_error_handler("builgings");
let csvWriter = csv_handler("builgings", 1);
let batch = 0;
let j = 0;
let main_err_record = 0;
let visit_err_record = 0;

async function visit_each(link, page) {
  await page.goto(link);
  let data = [];
  await page.waitForSelector(".post.container.text-base.leading-9 >div");
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
        title = clean(document.title.split("|")[0]);
      } catch (error) {}
      let temp;
      temp = Array.from(
        document.querySelectorAll(".post.container.text-base.leading-9 >div")
      );
      let content = [];
      let all_content = {};
      for (let i = 0; i < temp.length; i++) {
        let des = [];
        let titles = "";
        if (temp[i].hasAttribute("id")) {
          try {
            titles = temp[i].textContent;
          } catch (error) {}
          let s = i + 1;
          while (s < temp.length) {
            if (temp[s].hasAttribute("id")) break;
            else {
              let one = Array.from(temp[s].querySelectorAll("li,p"));
              one.forEach((e) => {
                try {
                  des.push(clean(e.textContent));
                } catch (error) {}
              });
              s++;
            }
          }

          all_content[titles] = des;
          i = s - 1;
        } else {
          continue;
        }
      }
      if (temp.length === 0) {
        temp = Array.from(document.querySelectorAll("._53549583.be4c198c >*"));
        for (let i = 0; i < temp.length; i++) {
          let des = [];
          let titles = "";
          if (
            temp[i].tagName === "H3" ||
            temp[i].tagName === "H4" ||
            temp[i].tagName === "H5" ||
            temp[i].tagName === "H2"
          ) {
            try {
              titles = temp[i].textContent;
            } catch (error) {}
            let s = i + 1;
            let res = [];
            while (s < temp.length) {
              if (
                temp[s].tagName === "H3" ||
                temp[s].tagName === "H4" ||
                temp[s].tagName === "H5" ||
                temp[s].tagName === "H2"
              )
                break;
              else {
                try {
                  let one = Array.from(temp[s].querySelectorAll("li,p"));
                  one.forEach((e) => {
                    try {
                      des.push(clean(e.textContent));
                    } catch (error) {}
                  });
                } catch (error) {}
                s++;
              }
            }

            all_content[titles] = des;
            i = s - 1;
          } else {
            continue;
          }
        }
      }

      content.push(JSON.stringify(all_content));
      let cover_img = "";
      try {
        cover_img = document.querySelectorAll(
          "div.container div.relative div div span img"
        )[5].src;
      } catch (error) {}
      if (!cover_img) {
        try {
          cover_img = clean(
            document.querySelectorAll("._53549583.be4c198c img")[0].src
          );
        } catch (error) {}
      }
      let images = [];
      temp = Array.from(document.querySelectorAll("div.mt-6.mb-5 img"));
      if (temp.length == 0)
        temp = Array.from(document.querySelectorAll("._53549583.be4c198c img"));
      temp.forEach((e) => {
        try {
          images.push(clean(e.src));
        } catch (error) {}
      });

      return {
        title: title,
        content: content,
        images: images,
        cover_img: cover_img,
        signaturea: Date.now(),
      };
    })
  );

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("builgings", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://www.bayut.com/buildings/dubai/page/${i}/`;
  if (i == 1) {
    target = "https://www.bayut.com/buildings/dubai";
  }
  console.log(target);
  await page.goto(target);
  await page.waitForSelector(".mt-10.gap-5 .relative a");
  const links = await page.evaluate(() => {
    const anchors = Array.from(
      document.querySelectorAll(".mt-10.gap-5 .relative a"),
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
  for (let i = 1; i <= 241; i++) {
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
