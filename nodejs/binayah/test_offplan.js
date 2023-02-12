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
    "https://www.binayah.com/dubai-projects/emaar-beachfront-apartments-sale-rent/"
  );
  const links = await page.evaluate(() => {
    let title = document.querySelector(
      ".wpb_column.vc_column_container.vc_col-sm-6 .wpb_wrapper h2.vc_custom_heading"
    ).textContent;
    let temp = Array.from(
      document.querySelectorAll("div#property-address-wrap ul li")
    );
    let Property_Type = "";
    let Payment_Plan = "";
    let Developer = "";
    let Unit_Type = "";
    let Size = "";
    let Area = "";
    let Starting_Price = "";
    let Title_type = "";
    let Downpayment = "";
    let Completion_date = "";
    for (let i = 0; i < temp.length; i++) {
      let temp1 = temp[i].querySelector("strong").textContent;
      if (/Property Type/i.test(temp1)) {
        Property_Type = temp[i].querySelector("span").textContent;
      }
      if (/Payment Plan/i.test(temp1)) {
        Payment_Plan = temp[i].querySelector("span").textContent;
      }
      if (/Developer/i.test(temp1)) {
        Developer = temp[i].querySelector("span").textContent;
      }
      if (/Unit Type/i.test(temp1)) {
        Unit_Type = temp[i].querySelector("span").textContent;
      }
      if (/Size/i.test(temp1)) {
        Size = temp[i].querySelector("span").textContent;
      }
      if (/Area/i.test(temp1)) {
        Area = temp[i].querySelector("span").textContent;
      }
      if (/Price/i.test(temp1)) {
        Starting_Price = temp[i].querySelector("span").textContent;
      }
      if (/Title type/i.test(temp1)) {
        Title_type = temp[i].querySelector("span").textContent;
      }
      if (/Downpayment/i.test(temp1)) {
        Downpayment = temp[i].querySelector("span").textContent;
      }
      if (/Completion date/i.test(temp1)) {
        Completion_date = temp[i].querySelector("span").textContent;
      }
    }
    let about = "";
    let Amenities_description = "";
    let Amenities_list = [];
    try {
      about = document.querySelectorAll(
        ".wpb_text_column.wpb_content_element .wpb_wrapper"
      )[2].textContent;
    } catch (error) {}
    temp = document.querySelectorAll(
      "#property-description-wrap div.block-content-wrap div.vc_row.wpb_row.vc_row-fluid"
    )[1];
    temp = Array.from(
      document.querySelectorAll(
        "div.wpb_column.vc_column_container.vc_col-sm-12 div.vc_column-inner div.wpb_wrapper > *"
      )
    );
    let all = [];
    temp.forEach((e) => all.push(e.innerHTML));
    let req = /(Amenities|Nearby Attractions|Payment Plan|Size)/i;
    for (let i = 0; i < all.length; i++) {
      if (req.test(all[i])) {
        if (/\bAmenities\b/i.test(all[i])) {
            let s=i+1
            if(req.test(all[s]))break
            else{}
        }
      }
    }

    return {
      title: title,
      Property_Type: Property_Type,
      Payment_Plan: Payment_Plan,
      Developer: Developer,
      Unit_Type: Unit_Type,
      Size: Size,
      Area: Area,
      Starting_Price: Starting_Price,
      Title_type: Title_type,
      Downpayment: Downpayment,
      Completion_date: Completion_date,
      about: about,
      all: all,
      a: all.length,
    };
  });
  console.log(links);

  await browser.close();
}
run();
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
