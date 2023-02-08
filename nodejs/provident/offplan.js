const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/offplan_driven${batch}.csv`,
    header: [{ id: "title", title: "title" }],
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

let csvErrr = csv_error_handler("offplan");
let csvWriter = csv_handler("offplan", 1);
let batch = 0;
let j = 0;
let main_err_record = 0;
let visit_err_record = 0;

async function visit_each(link, page) {
  // await page.setCacheEnabled(false);
  await page.goto(link);
  // await page.waitForNavigation();

  // await page.click('._35b183c9._39b0d6c4');
  // const element = await page.waitForSelector('._18c28cd2._277fb980');
  let data = [];
  data.push(
    await page.evaluate(async () => {
      function extract_one_text_from_pare_elements_in_one_container__pass_array_of_main_containers(
        elmnts,
        key,
        value_selector
      ) {
        let results = [];
        let result = "";
        try {
          results = elmnts.filter((elmnt) => {
            if (elmnt.textContent.includes(key)) return true;
          });
          result = results[0].querySelector(value_selector).textContent;
        } catch (error) {
          console.error(error);
        }
        return result;
      }

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

      function create_pares_from_pare_elements_in_one_container_if_thing_exists__pass_array_of_pares_containers(
        elmnts,
        search_key,
        key_selector,
        value_selector
      ) {
        let results = elmnts.filter((elmnt) => {
          if (elmnt.textContent.includes(search_key)) return true;
        });
        let result = [];
        results.forEach((e) => {
          let key = e.querySelector(key_selector).textContent;
          let value = e.querySelector(value_selector).textContent;
          result.push({ key, value });
        });
        return JSON.stringify(result);
      }

      function extract_text_from_pare_elements__section__(
        elmnts,
        search_key,
        value_selector
      ) {
        results = "";
        elmnts.forEach((t) => {
          try {
            if (
              t
                .querySelector(".container .projectHeading")
                .textContent.includes(search_key)
            ) {
              results = clean(t.querySelector(value_selector).innerText);
            }
          } catch (error) {
            console.error(error);
          }
        });
        return results;
      }

      // function get_text_from_section_if
    })
  );

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("offplan", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://www.providentestate.com/dubai-off-plan-properties.html/page/${i}`;
  if (i == 1) {
    target = "https://www.providentestate.com/dubai-off-plan-properties.html";
  }
  console.log(target);
  await page.goto(target);
  const links = await page.evaluate(() => {
    const anchors = Array.from(
      document.querySelectorAll(
        "#projects-row .project__image-wrap .project__link"
      ),
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
