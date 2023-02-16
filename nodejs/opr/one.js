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
    "https://opr.ae/projects/emaar-mina-rashid-yacht-marina-seascape-apartments-in-dubai"
  );
  const floor = await page.evaluate(() => {
    // .node.section-clear.section div.container.fullwidth div.cont div.node.widget-tabs.cr-tabs.widget div.metahtml div.tabs1-container.swiper-container.swiper-container-horizontal.swiper-container-autoheight div.tabs1-root div.swiper-wrapper div.swiper-slide
    let number = Array.from(document.querySelectorAll("#fp .tabs1-page"));
    let f = [];
    for (let i = 0; i < number.length; i++) {
      number[i].id = `h${i + 1}`;
      f.push(`h${i + 1}`);
    }
    return f;
  });
  // console.log(links.length);
  let floor_plans = [];
  if (floor.length > 0) {
    for (let f of floor) {
      await page.click(`#${f}`);
      console.log(f);
      floor_plans.push(
        await page.evaluate(() => {
          let size = "";
          let img = "";
          let title = "";
          try {
            size = document.querySelector(
              "#fp .swiper-slide.swiper-slide-active .node.widget-text.cr-text.widget + .node.widget-text.cr-text.widget p"
            ).textContent;
          } catch (error) {}

          try {
            img = document.querySelector(
              "#fp .swiper-slide.swiper-slide-active a .fr-dib.fr-draggable"
            ).src;
          } catch (error) {}
          try {
            title = document.querySelector(
              "#fp .swiper-slide.swiper-slide-active h3"
            ).textContent;
          } catch (error) {}
          return {
            title: title,
            size: size,
            img: img,
          };
        })
      );
    }
  }
  console.log(floor_plans);
  await browser.close();
}
run();

// -----area------

// let temp = Array.from(
//   document.querySelectorAll(
//     ".node.section-clear.section.font-text-opensanslight.font-header-opensanslight"
//   )
// );
// let all = {};
// let t = "";
// let d = "";
// temp.forEach((e) => {
//   if (e.querySelector("h2")) {
//     if (/how/i.test(e.querySelector("h2").textContent)) {
//       t = e.querySelector("h2").textContent;
//       d = e.querySelector(
//         ".node.section-clear.section.font-text-opensanslight.font-header-opensanslight .node.widget-text.cr-text.widget.xs-hidden p"
//       ).textContent;
//       all[t] = d;
//     }
//   }
// });
// temp = Array.from(
//   document.querySelectorAll(".node.widget-text.cr-text.widget:not(.lg-hidden)")
// );
// // let al = [];
// // temp.forEach((e) => al.push(e.innerHTML));
// let tit2 = "";
// let tit3 = "";
// for (let i = 0; i < temp.length; i++) {
//   if (temp[i].querySelector("h2")) {
//     try {
//       tit2 = temp[i].querySelector("h2").textContent;
//     } catch (error) {}
//     if (/Invest/i.test(tit2)) {
//       t = tit2;
//       d = temp[i + 1].textContent;
//       all[t] = d;
//     }
//     if (/Meraas Nikki Beach/i.test(tit2)) {
//       t = tit2;
//       d = temp[i + 1].textContent;
//       all[t] = d;
//     }
//     if (/Attractions/i.test(tit2)) {
//       t = tit2;
//       d = temp[i + 1].textContent;
//       all[t] = d;
//     }
//     if (/Real Estate/i.test(tit2)) {
//       t = tit2;
//       d = temp[i + 1].textContent;
//       all[t] = d;
//     }
//     if (/Transport/i.test(tit2)) {
//       t = tit2;
//       d = temp[i + 1].textContent;
//       all[t] = d;
//     }
//     if (/Off-Plan Projects/i.test(tit2)) {
//       t = tit2;
//       d = temp[i + 1].textContent;
//       all[t] = d;
//     }
//     if (/Best Properties/i.test(tit2)) {
//       t = tit2;
//       d = temp[i + 1].textContent;
//       all[t] = d;
//     }
//     if (/Location/i.test(tit2)) {
//       t = tit2;
//       d = temp[i + 1].textContent;
//       all[t] = d;
//     }
//     if (/Economic/i.test(tit2)) {
//       t = tit2;
//       d = temp[i + 1].textContent;
//       all[t] = d;
//     }
//     if (/Transactions/i.test(tit2)) {
//       t = tit2;
//       d = temp[i + 1].textContent;
//       all[t] = d;
//     }
//     if (/About/i.test(tit2)) {
//       t = tit2;
//       d = temp[i + 1].textContent;
//       all[t] = d;
//     }
//     if (/Sightseeing/i.test(tit2)) {
//       t = tit2;
//       d = temp[i + 1].textContent;
//       all[t] = d;
//     }
//     if (/Interesting Objects/i.test(tit2)) {
//       t = tit2;
//       d = temp[i + 1].textContent;
//       all[t] = d;
//     }
//   }
//   // -----------h3---------
//   if (temp[i].querySelector("h3")) {
//     try {
//       tit3 = temp[i].querySelector("h3").textContent;
//     } catch (error) {}
//     if (/Attractions/i.test(tit3)) {
//       t = tit3;
//       d = temp[i + 1].textContent;
//       all[t] = d;
//     }
//     if (/Interesting Objects/i.test(tit3)) {
//       t = tit3;
//       d = temp[i + 1].textContent;
//       all[t] = d;
//     }
//     if (/Investors/i.test(tit3)) {
//       t = tit3;
//       d = temp[i + 1].textContent;
//       all[t] = d;
//     }
//     if (/Sightseeing/i.test(tit3)) {
//       t = tit3;
//       d = temp[i + 1].textContent;
//       all[t] = d;
//     }
//     if (/Real Estate/i.test(tit3)) {
//       t = tit3;
//       d = temp[i + 1].textContent;
//       all[t] = d;
//     }
//     if (/Transactions/i.test(tit3)) {
//       t = tit3;
//       d = temp[i + 1].textContent;
//       all[t] = d;
//     }
//     if (/Investment/i.test(tit3)) {
//       t = tit3;
//       d = temp[i + 1].textContent;
//       all[t] = d;
//     }
//     if (/Economic/i.test(tit3)) {
//       t = tit3;
//       d = temp[i + 1].textContent;
//       all[t] = d;
//     }
//     if (/About/i.test(tit3)) {
//       t = tit3;
//       d = temp[i + 1].textContent;
//       all[t] = d;
//     }
//     if (/Best Projects/i.test(tit3)) {
//       t = tit3;
//       d = temp[i + 1].textContent;
//       all[t] = d;
//     }
//     if (/Transport/i.test(tit3)) {
//       t = tit3;
//       d = temp[i + 1].textContent;
//       all[t] = d;
//     }
//     if (/ROI/i.test(tit3)) {
//       t = tit3;
//       d = temp[i + 1].textContent;
//       all[t] = d;
//     }
//     if (/Best Property /i.test(tit3)) {
//       t = tit3;
//       d = temp[i + 1].textContent;
//       all[t] = d;
//     }
//     if (/Landmarks/i.test(tit3)) {
//       t = tit3;
//       d = temp[i + 1].textContent;
//       let s = i + 2;
//       while (s < temp.length) {
//         if (!(temp[s].querySelector("h2") || temp[s].querySelector("h3"))) {
//           try {
//             d += temp[s].textContent;
//             s++;
//           } catch (error) {}
//         } else {
//           break;
//         }
//       }
//       all[t] = d;
//       i = s - 1;
//     }
//   }
// }
// let images_sup = [];
// let temp_img = document.querySelector(
//   ".node.widget-image.widget .bgimage.bg-cover"
// );
// try {
//   let bgImage = temp_img.style.backgroundImage;
//   console.log(bgImage);
//   images_sup.push(bgImage.slice(4, -1).replace(/"/g, ""));
// } catch (error) {}
// temp_img = document.querySelector(".bgnormal a img");
// try {
//   images_sup.push(temp_img.src);
// } catch (error) {}
