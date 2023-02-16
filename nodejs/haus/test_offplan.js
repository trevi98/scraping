const puppeteer = require("puppeteer");
async function run() {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--enable-automation"],
  });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(80000);
  await page.goto(
    "https://www.hausandhaus.com/new-developments-details/1-2-3-bedroom-apartments-for-sale-in-district-one-residences-mbr-city-dubai/7654"
  );
  const links = await page.evaluate(() => {
    let title = document.querySelector(
      "div.intro-content div.titile"
    ).textContent;
    let overview = "";
    try {
      overview = document.querySelector(
        "div.main section.section-developments-details div.section-body section.section-header div.container header p"
      ).innerHTML;
    } catch (error) {
      overview = "";
    }
    let project_title = document.querySelector(".project-title").textContent;
    let brochure = "";
    let check_brochure = Array.from(
      document.querySelectorAll(
        "div.main section.section-developments-details div.section-body section.section-header div.container header div.btn-group a"
      )
    );
    check_brochure.forEach((e) => {
      if (e.textContent.includes("Brochure")) {
        brochure = e.href;
      }
    });
    let floor_plan_link = "";
    let check_floor_plan_link = Array.from(
      document.querySelectorAll(
        "section.btns-tab div.btn-group ul.list-inline.btnulli li a"
      )
    );
    check_floor_plan_link.forEach((e) => {
      if (e.textContent.includes("Floor")) {
        floor_plan_link = e.href;
      }
    });
    let Location = document
      .querySelector(
        "section.details.clearfix div.row.wrapper div.col-xs-12.contents div.item-details div.item-location"
      )
      .textContent.split(":")[1];
    let developer = document
      .querySelector(
        "section.details.clearfix div.row.wrapper div.col-xs-12.contents div.item-details div.item-developer"
      )
      .textContent.split(":")[1];
    let develpment_type = document
      .querySelector(
        "section.details.clearfix div.row.wrapper div.col-xs-12.contents div.item-details div.item-building"
      )
      .textContent.split(":")[1];
    let completion_date = document
      .querySelector(
        "section.details.clearfix div.row.wrapper div.col-xs-12.contents div.item-details div.item-date"
      )
      .textContent.split(":")[1];
    let price = document
      .querySelector(
        "section.details.clearfix div.row.wrapper div.col-xs-12.contents div.item-details div.item-price"
      )
      .textContent.split(":")[1];
    let images = [];
    let temp = Array.from(
      document.querySelectorAll(
        "section.section-developments-details div.section-body div.section-slider div.container div.prop-slider-wrapper.prop-slider div.slider.slider-developments-details img"
      )
    );
    temp.forEach((e) => images.push(e.src));
    images = [...new Set(images)];
    let Payment_Plan = [];
    temp = Array.from(
      document.querySelectorAll("ul.payment-list.list-inline li")
    );

    temp.forEach((e) => {
      Payment_Plan.push(e.textContent);
    });
    temp = Array.from(
      document.querySelectorAll(
        ".section-description .description.col-md-12 .col-md-6"
      )
    );
    let tr = "";
    let Community = "";
    let i = 0;
    for (; i < temp.length; i++) {
      if (
        temp[i].querySelector("p") !== null ||
        temp[i].querySelector("ul") !== null
      ) {
        try {
          tr = temp[i].querySelector("strong").textContent;
        } catch (error) {}
        if (/Community/i.test(tr)) {
          let s = i + 1;
          let results = "";
          while (s < temp.length) {
            console.log(temp[s].querySelector("p").textContent.length);
            if (temp[s].querySelector("p").textContent.length < 40) {
              break;
            }
            results += temp[s].querySelector("p").textContent;
          }
          i = s - 1;
          try {
            Community = results;
          } catch (error) {}
        }
      }
    }

    return {
      // title: title,
      // project_title: project_title,
      // overview: overview,
      // brochure: brochure,
      // floor_plan_link: floor_plan_link,
      // price: price,
      // Location: Location,
      // completion_date: completion_date,
      // developer: developer,
      // develpment_type: develpment_type,
      // images: images,
      // Payment_Plan: Payment_Plan,
      Community: Community,
    };
  });
  console.log(links);

  await browser.close();
}
run();
// let all = Array.from(
//   document.querySelectorAll(
//     "div.description.col-md-12 div.item-description div.col-md-6 > *"
//   )
// );

// // temp.forEach((e) => all.push(e.innerHTML));
// let titles = [];
// let descriptions = [];
// let i = 0;
// for (; i < all.length; i++) {
//   if (all[i].textContent.length < 40) {
//     titles.push(all[i].textContent);
//     let results = [];
//     let s = i + 1;
//     while (s < all.length) {
//       if (all[s].textContent.length < 40) {
//         break;
//       } else {
//         results.push(all[s].textContent);
//         s + 1;
//       }
//     }
//     i = s - 1;
//     descriptions.push(results);
//   } else {
//     continue;
//   }
// }
