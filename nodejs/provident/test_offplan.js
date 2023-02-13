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
    "https://www.providentestate.com/dubai-offplan/all-seasons-damac-hills.html"
  );
  const links = await page.evaluate(() => {
    let title = document.querySelector("vc_custom_heading");
    let temp = Array.from(
      document.querySelectorAll(
        "div.wpb_column.vc_column_container.vc_col-sm-6 div.vc_column-inner div.wpb_wrapper div.wpb_text_column.wpb_content_element div.wpb_wrapper div.table-responsive table#datatable1 tbody td "
      )
    );
    let Down_Payment = "";
    let Location = "";
    let Bedrooms = "";
    let Type = "";
    let Area = "";
    let Completion = "";
    let Starting_Price = "";
    let Community = "";
    for (let i = 0; i < temp.length; i++) {
      if (/Down Payment/i.test(temp[i].textContent)) {
        Down_Payment = temp[i + 1].textContent;
      }
      if (/Location/i.test(temp[i].textContent)) {
        Location = temp[i + 1].textContent;
      }
      if (/Bedrooms/i.test(temp[i].textContent)) {
        Bedrooms = temp[i + 1].textContent;
      }
      if (/Area/i.test(temp[i].textContent)) {
        Area = temp[i + 1].textContent;
      }
      if (/Type/i.test(temp[i].textContent)) {
        Type = temp[i + 1].textContent;
      }
      if (/Completion/i.test(temp[i].textContent)) {
        Completion = temp[i + 1].textContent;
      }
      if (/price/i.test(temp[i].textContent)) {
        Starting_Price = temp[i + 1].textContent;
      }
      if (/Community/i.test(temp[i].textContent)) {
        Community = temp[i + 1].textContent;
      }
    }
    let Investment = [];
    let Exclusive_Features = [];
    let Unit_Sizes = [];
    let Overview = "";
    let Payment_Plan = [];
    let Interiors = "";
    let Location_Map = "";
    let Image_location_map = "";
    let handover = "";
    let floor_plan_images = [];
    let Amenities_description = "";
    let Amenities_List = [];
    let images = [];
    let video = "";
    let temp1, temp2;
    temp = Array.from(document.querySelectorAll("div.wpb_wrapper"));
    temp.forEach((e) => {
      if (e.querySelector("h3") !== null) {
        if (
          /Investment/i.test(e.querySelector("h3").textContent) ||
          /Investment/i.test(e.querySelector("h2").textContent)
        ) {
          temp1 = e.querySelector(
            "div.wpb_text_column.wpb_content_element div.wpb_wrapper ul"
          );
          temp2 = Array.from(temp1.querySelectorAll("li"));
          temp2.forEach((e) => Investment.push(clean(e.textContent)));
        }
        if (
          /Exclusive Features/i.test(e.querySelector("h3").textContent) ||
          /Exclusive Features/i.test(e.querySelector("h2").textContent)
        ) {
          temp1 = e.querySelector(
            "div.wpb_text_column.wpb_content_element div.wpb_wrapper ul"
          );
          temp2 = Array.from(temp1.querySelectorAll("li"));
          temp2.forEach((e) => Exclusive_Features.push(clean(e.textContent)));
        }
        if (
          /Unit Sizes/i.test(e.querySelector("h3").textContent) ||
          /Unit Sizes/i.test(e.querySelector("h3").textContent)
        ) {
          temp1 = e.querySelector(
            "div.wpb_text_column.wpb_content_element div.wpb_wrapper"
          );
          temp2 = Array.from(temp1.querySelectorAll("p"));
          temp2.forEach((e) => Unit_Sizes.push(clean(e.textContent)));
        }
        if (
          /Overview/i.test(e.querySelector("h3").textContent) ||
          /Overview/i.test(e.querySelector("h3").textContent)
        ) {
          Overview = clean(
            e.querySelector(
              "div.wpb_text_column.wpb_content_element div.wpb_wrapper"
            ).textContent
          );
        }
        if (
          /Gallery/i.test(e.querySelector("h3").textContent) ||
          /Gallery/i.test(e.querySelector("h3").textContent)
        ) {
          temp1 = Array.from(
            e.querySelectorAll("div.vc_grid-container-wrapper.vc_clearfix img")
          );
          temp1.forEach((e) => images.push(e.src));
        }
        if (
          /video/i.test(e.querySelector("h3").textContent) ||
          /video/i.test(e.querySelector("h3").textContent)
        ) {
          try {
            video = e.querySelector("div.fluid-width-video-wrapper iframe").src;
          } catch (error) {}
        }
        if (
          /Payment Plan/i.test(e.querySelector("h3").textContent) ||
          /Payment Plan/i.test(e.querySelector("h3").textContent)
        ) {
          if (
            e.querySelector(
              "div.wpb_text_column.wpb_content_element div.wpb_wrapper ul"
            ) !== null
          ) {
            temp1 = e.querySelector(
              "div.wpb_text_column.wpb_content_element div.wpb_wrapper ul"
            );
            temp2 = Array.from(temp1.querySelectorAll("li"));
            temp2.forEach((e) => Payment_Plan.push(clean(e.textContent)));
            temp = Array.from(
              e.querySelectorAll(
                "div.wpb_text_column.wpb_content_element div.wpb_wrapper ul li"
              )
            );
            temp.forEach((e) => {
              if (/Handover/i.test(e.textContent)) {
                handover = e.textContent.replaceAll("Handover:", "").trim();
              }
            });
          } else {
            temp = Array.from(document.querySelectorAll("div.payment-plan"));
            temp.forEach((e) => Payment_Plan.push(clean(e.textContent)));
          }
        }
        if (
          /Interiors/i.test(e.querySelector("h3").textContent) ||
          /Interiors/i.test(e.querySelector("h3").textContent)
        ) {
          Interiors = clean(
            e.querySelector(
              "div.wpb_text_column.wpb_content_element div.wpb_wrapper"
            ).textContent
          );
        }
        if (
          /Amenities/i.test(e.querySelector("h3").textContent) ||
          /Amenities/i.test(e.querySelector("h3").textContent)
        ) {
          Amenities_description = clean(
            e.querySelector(
              "div.wpb_text_column.wpb_content_element div.wpb_wrapper"
            ).textContent
          );
        }
        if (
          /Floor/i.test(e.querySelector("h3").textContent) ||
          /Floor/i.test(e.querySelector("h3").textContent)
        ) {
          let images = Array.from(e.querySelectorAll("img"));
          images.forEach((e) => {
            floor_plan_images.push(e.src);
          });
          floor_plan_images = [...new Set(floor_plan_images)];
        }
      }
    });
    Location_Map = "";
    temp = Array.from(
      document.querySelectorAll(
        "div#locationmap div.wpb_column.vc_column_container"
      )
    );
    temp.forEach((e) => {
      Location_Map += clean(e.textContent);
    });
    try {
      Image_location_map = document.querySelector(
        "div#locationmap div.wpb_column.vc_column_container img"
      ).src;
    } catch (error) {
      Image_location_map = "";
    }
    temp = Array.from(
      document.querySelectorAll("div.vc_row.wpb_row.vc_inner.vc_row-fluid")
    );
    let all = [];
    for (let i = 0; i < temp.length; i++) {
      if (
        temp[i].querySelector("h3") !== null &&
        /Amenities/i.test(temp[i].querySelector("h3").textContent)
      ) {
        all = Array.from(temp[i + 1].querySelectorAll("li"));
        break;
      }
    }
    all.forEach((e) => Amenities_List.push(clean(e.textContent)));

    return {
      title: title,
      Down_Payment: Down_Payment,
      Location: Location,
      Bedrooms: Bedrooms,
      Type: Type,
      Area: Area,
      Completion: Completion,
      Starting_Price: Starting_Price,
      Community: Community,
      Investment_Highlights: Investment,
      Exclusive_Features: Exclusive_Features,
      Unit_Sizes: Unit_Sizes,
      Overview: Overview,
      Payment_Plan: Payment_Plan,
      Interiors: Interiors,
      Amenities_description: Amenities_description,
      Amenities_List: Amenities_List,
      handover: handover,
      Location_Map: Location_Map,
      Image_location_map: Image_location_map,
      images: images,
      video: video,
      floor_plan_images: floor_plan_images,
    };
  });
  console.log(links);

  //#################### brochure#####################################
  const exists = await page.evaluate(() => {
    return (
      document.querySelector(
        "div.vc_btn3-container.download_btn.vc_btn3-center a"
      ) !== null &&
      document
        .querySelector("div.vc_btn3-container.download_btn.vc_btn3-center a")
        .textContent.includes("Brochure")
    );
  });
  if (exists) {
    await page.click("div.vc_btn3-container.download_btn.vc_btn3-center a");
    await page.waitForSelector(
      'div.modal-content div.modal-body.listing-form-7 form input[name="your-name"]'
    );
    await page.type(
      'div.modal-content div.modal-body.listing-form-7 form input[name="your-name"]',
      "John"
    );
    await page.type(
      'div.modal-content div.modal-body.listing-form-7 form input[name="your-email"]',
      "jhon@jmail.com"
    );
    await page.type(
      'div.modal-content div.modal-body.listing-form-7 form textarea[name="your-message"]',
      "Hello"
    );
    await page.evaluate(() => {
      document
        .querySelector(
          "div.modal-content div.modal-body.listing-form-7 div form input[type=submit]"
        )
        .click();
    });
    await page.waitForNavigation();
    let brochure = await page.evaluate(() => document.location.href);
    data[0].brochure = brochure;
    // data.push({brochure:url})
    console.log(brochure);
  } else {
    console.log("yyyy");
  }
  await browser.close();
}
run();
