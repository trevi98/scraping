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
    "https://www.providentestate.com/dubai-offplan/nara-the-valley.html"
  );
  const links = await page.evaluate(() => {
    let title = document.title;
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
      if (temp[i].textContent.includes("Down Payment")) {
        Down_Payment = temp[i + 1].textContent;
      }
      if (temp[i].textContent.includes("Location")) {
        Location = temp[i + 1].textContent;
      }
      if (temp[i].textContent.includes("Bedrooms")) {
        Bedrooms = temp[i + 1].textContent;
      }
      if (temp[i].textContent.includes("Area")) {
        Area = temp[i + 1].textContent;
      }
      if (temp[i].textContent.includes("Type")) {
        Type = temp[i + 1].textContent;
      }
      if (temp[i].textContent.includes("Completion")) {
        Completion = temp[i + 1].textContent;
      }
      if (temp[i].textContent.includes("Price")) {
        Starting_Price = temp[i + 1].textContent;
      }
      if (temp[i].textContent.includes("Community")) {
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
        if (e.querySelector("h3").textContent.includes("Investment")) {
          temp1 = e.querySelector(
            "div.wpb_text_column.wpb_content_element div.wpb_wrapper ul"
          );
          temp2 = Array.from(temp1.querySelectorAll("li"));
          temp2.forEach((e) => Investment.push(e.textContent));
        }
        if (e.querySelector("h3").textContent.includes("Exclusive Features")) {
          temp1 = e.querySelector(
            "div.wpb_text_column.wpb_content_element div.wpb_wrapper ul"
          );
          temp2 = Array.from(temp1.querySelectorAll("li"));
          temp2.forEach((e) => Exclusive_Features.push(e.textContent));
        }
        if (e.querySelector("h3").textContent.includes("Unit Sizes")) {
          temp1 = e.querySelector(
            "div.wpb_text_column.wpb_content_element div.wpb_wrapper"
          );
          temp2 = Array.from(temp1.querySelectorAll("p"));
          temp2.forEach((e) => Unit_Sizes.push(e.textContent));
        }
        if (e.querySelector("h3").textContent.includes("Overview")) {
          Overview = e.querySelector(
            "div.wpb_text_column.wpb_content_element div.wpb_wrapper"
          ).textContent;
        }
        if (e.querySelector("h3").textContent.includes("Gallery")) {
          temp1 = Array.from(
            e.querySelectorAll("div.vc_grid-container-wrapper.vc_clearfix img")
          );
          temp1.forEach((e) => images.push(e.src));
        }
        if (e.querySelector("h3").textContent.includes("Video")) {
          try {
            video = e.querySelector("div.fluid-width-video-wrapper iframe").src;
          } catch (error) {
            video = "";
          }
        }
        if (e.querySelector("h3").textContent.includes("Payment Plan")) {
          if (
            e.querySelector(
              "div.wpb_text_column.wpb_content_element div.wpb_wrapper ul"
            ) !== null
          ) {
            temp1 = e.querySelector(
              "div.wpb_text_column.wpb_content_element div.wpb_wrapper ul"
            );
            temp2 = Array.from(temp1.querySelectorAll("li"));
            temp2.forEach((e) => Payment_Plan.push(e.textContent));
            let temp = Array.from(
              e.querySelectorAll(
                "div.wpb_text_column.wpb_content_element div.wpb_wrapper ul li"
              )
            );
            temp.forEach((e) => {
              if (e.textContent.includes("Handover")) {
                handover = e.textContent.replaceAll("Handover:", "").trim();
              }
            });
          } else {
            temp = Array.from(document.querySelectorAll("div.payment-plan"));
            temp.forEach((e) => Payment_Plan.push(e.textContent));
          }
        }
        if (e.querySelector("h3").textContent.includes("Interiors")) {
          Interiors = e.querySelector(
            "div.wpb_text_column.wpb_content_element div.wpb_wrapper"
          ).textContent;
        }
        if (e.querySelector("h3").textContent.includes("Amenities")) {
          Amenities_description = e.querySelector(
            "div.wpb_text_column.wpb_content_element div.wpb_wrapper"
          ).textContent;
        }
        if (e.querySelector("h3").textContent.includes("Floor")) {
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
      Location_Map += e.textContent;
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
        temp[i].querySelector("h3").textContent.includes("Amenities")
      ) {
        all = Array.from(temp[i + 1].querySelectorAll("li"));
        break;
      }
    }
    all.forEach((e) => Amenities_List.push(e.textContent));

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
    await page.type(
      'div.modal-content div.modal-body form input[name="your-name"]',
      "John"
    );
    await page.type(
      'div.modal-content div.modal-body form input[name="your-email"]',
      "jhon@jmail.com"
    );
    await page.type(
      'div.modal-content div.modal-body form textarea[name="your-message"]',
      "Hello"
    );
    await page.evaluate(() => {
      document
        .querySelector(
          "div.modal-content div.modal-body div form input[type=submit]"
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
