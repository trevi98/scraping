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
    "https://www.binayah.com/apartment/sale/downtown-dubai/dubai/boulevard-point-apartment-for-sale-in-downtown-dubai-1-bedroom/"
  );
  const links = await page.evaluate(() => {
    let title = "";
    try {
      title = document.title;
    } catch (error) {}
    let description = "";
    try {
      description = document.querySelector(
        "div.property-description-wrap.property-section-wrap div.block-wrap div.block-content-wrap"
      ).textContent;
    } catch (error) {}
    let location = "";
    let sub_location = "";
    let city = "";
    let country = "";
    try {
      location = document.querySelector(
        "#property-address-wrap .detail-area span"
      ).textContent;
    } catch (error) {}
    try {
      city = document.querySelector(
        "#property-address-wrap .detail-city span"
      ).textContent;
    } catch (error) {}
    try {
      country = document.querySelector(
        "#property-address-wrap .detail-country span"
      ).textContent;
    } catch (error) {}
    try {
      sub_location = document.querySelector(
        "#property-address-wrap .detail-country span"
      ).textContent;
    } catch (error) {}
    let temp = Array.from(
      document.querySelectorAll("#property-detail-wrap li")
    );
    let Property_ID = "";
    let Price = "";
    let Land_Area = "";
    let Bedrooms = "";
    let Bathrooms = "";
    let Garage = "";
    let Property_Type = "";
    let Property_Status = "";

    temp.forEach((e) => {
      let key = e.querySelector("strong").textContent;
      let value = e.querySelector("span").textContent;
      if (/Property ID/i.test(key)) {
        Property_ID = value;
      }
      if (/Price/i.test(key)) {
        Price = value;
      }
      if (/Land Area/i.test(key)) {
        Land_Area = value;
      }
      if (/Bedrooms/i.test(key)) {
        Bedrooms = value;
      }
      if (/Bathrooms/i.test(key)) {
        Bathrooms = value;
      }
      if (/Garage/i.test(key)) {
        Garage = value;
      }
      if (/Property Type/i.test(key)) {
        Property_Type = value;
      }
      if (/Property Status/i.test(key)) {
        Property_Status = value;
      }
    });

    return {
      title: title,
      description: description,
      location: location,
      sub_location: sub_location,
      city: city,
      country: country,
      Property_ID: Property_ID,
      Price: Price,
      Land_Area: Land_Area,
      Bedrooms: Bedrooms,
      Bathrooms: Bathrooms,
      Garage: Garage,
      Property_Type: Property_Type,
      Property_Status: Property_Status,
    };
  });
  console.log(links);
  // .wpb_text_column.wpb_content_element.paymentplan

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
