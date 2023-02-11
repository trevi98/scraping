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
    "https://www.hausandhaus.com/latest-news/market/greening-the-urban-jungle-how-the-uae-can-lead-the-way"
  );
  const links = await page.evaluate(() => {
    let title = document.querySelector("div.article-head h1").textContent;
    let about = document.querySelector(
      "div.article-head div.introtext.row.js-animate-right div.col-sm-12 p"
    ).textContent;
    let temp = Array.from(
      document.querySelectorAll(
        "div.article-body.remove-border.js-animate-left div.article-entry div.row div.col-sm-6 p"
      )
    );
    let all_description = "";
    temp.forEach((e) => (all_description += e.textContent));
    // for (let i = 0; i < temp.length; i++) {
    //   if (
    //     temp[i].innerHTML.startsWith("<strong") ||
    //     temp[i].innerHTML.startsWith("<b>")
    //   ) {
    //     all_title.push(temp[i].textContent);
    //     let results = "";
    //     let s = i + 1;
    //     while (s < temp.length) {
    //       if (
    //         temp[s].innerHTML.startsWith("<strong") ||
    //         temp[s].innerHTML.startsWith("<b>")
    //       )
    //         break;
    //       else {
    //         results += temp[s].textContent;
    //         s += 1;
    //         continue;
    //       }
    //     }
    //     i = s - 1;
    //     all_description.push(results);
    //   } else {
    //     continue;
    //   }
    // }
    // all = {};
    // for (let i = 0; i < all_description.length; i++) {
    //   all[all_title[i]] = all_description[i];
    // }

    return {
      title: title,
      about: about,
      all_description: all_description,
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
