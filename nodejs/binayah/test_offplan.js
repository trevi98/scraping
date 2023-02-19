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
  await page.goto("https://www.binayah.com/dubai-projects/jomana-mjl/");
  // .vc_row.wpb_row.vc_inner.vc_row-fluid:not(.payment) .wpb_single_image.wpb_content_element.vc_align_center +.wpb_text_column.wpb_content_element;
  const links = await page.evaluate(() => {
    let title = "";
    try {
      title = document.title;
    } catch (error) {}
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
    temp = Array.from(
      document.querySelectorAll(
        ".vc_row.wpb_row.vc_inner.vc_row-fluid.lists li"
      )
    );
    temp.forEach((e) => {
      try {
        Amenities_list.push(e.textContent);
      } catch (error) {}
    });
    temp = document.querySelectorAll(
      "div.wpb_column.vc_column_container.vc_col-sm-3 div.wpb_single_image.wpb_content_element.vc_align_center + div.wpb_text_column.wpb_content_element strong"
    );
    let attractions = [];
    temp.forEach((e) => {
      try {
        attractions.push(e.textContent);
      } catch (error) {}
    });
    if (
      document.querySelector(
        ".wpb_text_column.wpb_content_element + .wpb_row.vc_inner.vc_row-fluid.lists"
      ) !== null
    ) {
      try {
        Amenities_description = document.querySelectorAll(
          ".wpb_text_column.wpb_content_element .wpb_wrapper"
        )[3].textContent;
      } catch (error) {}
    }
    let video = "";
    try {
      video = document
        .querySelector("div.rll-youtube-player")
        .getAttribute("data-src");
    } catch (error) {}
    // temp = document.querySelectorAll(".vc_row.wpb_row.vc_row-fluid")[4];
    // let all = Array.from(temp.querySelectorAll(">*"));
    // let s = [];
    // all.forEach((e) => s.push());
    temp = Array.from(document.querySelectorAll(".wpb_wrapper"));
    let floor_plans = {};
    for (let i = 0; i < temp.length; i++) {
      if (
        temp[i].querySelector(".wpb_heading.wpb_singleimage_heading") !== null
      ) {
        try {
          floor_plans[temp[i].textContent] =
            temp[i].querySelector("figure img").src;
        } catch (error) {}
      }
    }
    all = [];
    // for (let i = 0; i < array.length; i++) {
    //   const element = array[i];
    // }
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
      Amenities_description: Amenities_description,
      Amenities_list: Amenities_list,
      attractions: attractions,
      video: video,
      floor_plans: floor_plans,
    };
  });
  console.log(links);
  // .wpb_text_column.wpb_content_element.paymentplan

  const exist = await page.evaluate(() => {
    return (
      document.querySelector(
        ".vc_grid-container-wrapper.vc_clearfix.vc_grid-animation-fadeIn"
      ) !== null
    );
  });
  let images;
  if (exist) {
    await page.waitForSelector(
      ".vc_grid-container-wrapper.vc_clearfix.vc_grid-animation-fadeIn .vc_grid-item.vc_clearfix.vc_visible-item.fadeIn.animated"
    );
    // await page.waitForTimeout(10000);
    await page.click(
      ".vc_grid-container-wrapper.vc_clearfix.vc_grid-animation-fadeIn .vc_grid-item.vc_clearfix.vc_visible-item.fadeIn.animated"
    );
    images = await page.evaluate(() => {
      let imgs = [];
      temp = Array.from(
        document.querySelectorAll(
          ".vc_grid-container-wrapper.vc_clearfix.vc_grid-animation-fadeIn a"
        )
      );
      temp.forEach((e) => {
        try {
          imgs.push(e.href);
        } catch (error) {}
      });
      return imgs;
    });
    console.log(images);
    console.log(images.length);
    console.log([...new Set(images)].length);
  } else {
    console.log("w");
  }

  await browser.close();
}
run();
