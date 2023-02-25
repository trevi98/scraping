const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");
const { on } = require("events");

function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/blog${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "cover_img", title: "cover_img" },
      { id: "content", title: "content" },
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
        title = clean(document.title);
      } catch (error) {}
      let cover_img = "";
      try {
        cover_img = document.querySelector("#R5729311864314920614 img").src;
      } catch (error) {}
      let content = "";
      try {
        content = clean(
          document.querySelector("#R5729311864314920614 ").textContent
        );
      } catch (error) {}

      return {
        title: title,
        cover_img: cover_img,
        content: content,
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

async function main_loop(page) {
  let target = `https://famproperties.com/blog`;

  console.log(target);
  await page.goto(target);
  let links = [];
  await page.waitForSelector(
    ".col.col-12.padding-top-sm.blog-info .t-Button.t-Button--icon.t-Button--primary.t-Button--simple.t-Button--iconRight"
  );
  await page.evaluate(() => {
    const popup = document.querySelector("#marquizPopup");
    const closeButton = popup.querySelector(".fa.fa-times.fa-2x.closeMarquiz");
    closeButton.click();
  });
  await page.evaluate(() => {
    document.querySelectorAll("footer .row")[15].style.display = "none";
  });

  while (true) {
    await page.evaluate(() => {
      document.querySelectorAll("footer .row")[15].style.display = "none";
      document.querySelector("#marquizPopup").style.display = "none";
    });
    await page.waitForTimeout(8000);
    links.push(
      await page.evaluate(() => {
        let all = [];
        let link = Array.from(
          document.querySelectorAll(
            ".col.col-12.padding-top-sm.blog-info .t-Button.t-Button--icon.t-Button--primary.t-Button--simple.t-Button--iconRight "
          )
        );
        link.forEach((e) => {
          let a = e.href;
          all.push(a);
        });
        let uniqe_links = [...new Set(all)];
        return uniqe_links;
      })
    );
    let temp = await page.evaluate(() => {
      let temp = document.querySelectorAll(".t-Report-paginationText a");
      let text = [];
      temp.forEach((e) => text.push(e.textContent));
      return text;
    });

    console.log(temp);
    let all_links = await page.evaluate(async (mytemp) => {
      let s = [];
      for (let i = 0; i < mytemp.length; i++) {
        await mytemp[i].click();
        setTimeout(() => {}, 4000);
        let link = Array.from(
          document.querySelectorAll(
            ".col.col-12.padding-top-sm.blog-info .t-Button.t-Button--icon.t-Button--primary.t-Button--simple.t-Button--iconRight "
          )
        );
        let all = [];
        link.forEach((e) => {
          let a = e.href;
          all.push(a);
        });
        let uniqe_links = [...new Set(all)];
        s.push(uniqe_links);
      }
      return s;
    }, temp);
    links.push(all_links);
    // console.log(all_links.l);
    if (
      await page.evaluate(() => {
        return (
          document.querySelector(
            ".t-Button.t-Button--small.t-Button--noUI.t-Report-paginationLink.t-Report-paginationLink--next"
          ) !== null
        );
      })
    ) {
      await page.click(
        ".t-Button.t-Button--small.t-Button--noUI.t-Report-paginationLink.t-Report-paginationLink--next"
      );
    } else {
      break;
    }
  }
  let all = [];
  links.forEach((e) => {
    e.forEach((s) => all.push(s));
  });
  let all_links_uniqe = [...new Set(all)];
  console.log(all_links_uniqe);
  console.log(all_links_uniqe.length);
  //   for (const link of all_links) {
  //     try {
  //       await visit_each(link, page);
  //     } catch (error) {
  //       try {
  //         await visit_each(link, page);
  //       } catch (err) {
  //         try {
  //           await visit_each(link, page);
  //         } catch (error) {
  //           console.error(error);
  //           csvErrr
  //             .writeRecords({ link: link, error: err })
  //             .then(() => console.log("error logged main loop"));
  //           continue;
  //         }
  //       }
  //     }
  //   }
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
