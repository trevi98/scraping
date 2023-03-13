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
  await page.goto("https://www.binayah.com/dubai-projects/tria-by-deyaar/");
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
      ) !== null ||
      /amenities/i.test(
        document.querySelectorAll(
          ".wpb_text_column.wpb_content_element .wpb_wrapper"
        )[3].textContent
      )
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
    temp = Array.from(
      document.querySelectorAll(
        "div.wpb_text_column.wpb_content_element.bedroom div.wpb_wrapper"
      )
    );
    let type_size = [];
    temp.forEach((e) => {
      try {
        type_size.push(e.textContent);
      } catch (error) {}
    });
    let Payment_Plan_list = [];
    temp = Array.from(document.querySelectorAll(".paymentplan"));
    temp.forEach((e) => {
      try {
        Payment_Plan_list.push(e.textContent);
      } catch (error) {}
    });
    // temp = document.querySelectorAll(".vc_row.wpb_row.vc_row-fluid")[4];
    // let all = Array.from(temp.querySelectorAll(">*"));
    // let s = [];
    // all.forEach((e) => s.push());
    temp = Array.from(document.querySelectorAll(".wpb_wrapper"));
    let floor_plans = {};
    let s = 0;
    for (let i = 0; i < temp.length; i++) {
      if (
        temp[i].querySelector(".wpb_heading.wpb_singleimage_heading") !== null
      ) {
        s++;
        if (s > 1) {
          try {
            floor_plans[temp[i].textContent] =
              temp[i].querySelector("figure a").href;
          } catch (error) {}
        }
      }
    }
    let location_map = "";
    temp = Array.from(
      document.querySelectorAll(
        ".wpb_single_image.wpb_content_element.vc_align_center a"
      )
    );
    temp.forEach((e) => {
      if (/locationmap/i.test(e.href)) {
        location_map = e.href;
      }
    });
    if (!location_map) {
      temp = document.querySelectorAll(".mega_wrap img");
      temp.forEach((e) => {
        try {
          location_map = e.getAttribute("data-src");
        } catch (error) {}
      });
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
      Amenities_description: Amenities_description,
      Amenities_list: Amenities_list,
      attractions: attractions,
      type_size: type_size,
      Payment_Plan_list: Payment_Plan_list,
      video: video,
      floor_plans: floor_plans,
      location_map: location_map,
    };
  });
  console.log(links);
  // .wpb_text_column.wpb_content_element.paymentplan
  // await page.waitForSelector(".vc_clearfix.vc_col-sm-3.vc_visible-item");
  // await page.waitForNavigation();
  // await page.waitForTimeout(10000);
  const exist = await page.evaluate(() => {
    return (
      document.querySelector(".vc_grid-container-wrapper.vc_clearfix") !== null
    );
  });
  let images;
  if (exist) {
    await page.keyboard.down("End");
    await page.waitForTimeout(1000);
    await page.keyboard.down("Home");
    await page.waitForTimeout(5000);
    // if (
    //   await page.evaluate(() => {
    //     return document.querySelector(
    //       ".vc_gitem-link.prettyphoto.vc-zone-link.vc-prettyphoto-link"
    //     );
    //   })
    // ) {
    //   console.log("d");
    //   await page.click(
    //     ".vc_gitem-link.prettyphoto.vc-zone-link.vc-prettyphoto-link"
    //   );
    // }
    images = await page.evaluate(() => {
      let imgs = [];
      temp = Array.from(
        document.querySelectorAll(
          ".vc_gitem-link.prettyphoto.vc-zone-link.vc-prettyphoto-link"
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
  } else {
    console.log("no imgs");
  }

  await browser.close();
}
run();
