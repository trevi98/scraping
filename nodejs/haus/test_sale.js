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
    "https://www.providentestate.com/dubai-offplan/ramhan-island.html"
  );
  const links = await page.evaluate(() => {
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
    let title = "";
    try {
      title = clean(document.title);
    } catch (error) {}
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
        Down_Payment = clean(temp[i + 1].textContent);
      }
      if (/Location/i.test(temp[i].textContent)) {
        try {
          Location = clean(temp[i + 1].textContent);
        } catch (error) {}
      }
      if (/Bedrooms/i.test(temp[i].textContent)) {
        try {
          Bedrooms = clean(temp[i + 1].textContent);
        } catch (error) {}
      }
      if (/Area/i.test(temp[i].textContent)) {
        try {
          Area = clean(temp[i + 1].textContent);
        } catch (error) {}
      }
      if (/Type/i.test(temp[i].textContent)) {
        try {
          Type = clean(temp[i + 1].textContent);
        } catch (error) {}
      }
      if (/Completion/i.test(temp[i].textContent)) {
        try {
          Completion = clean(temp[i + 1].textContent);
        } catch (error) {}
      }
      if (/price/i.test(temp[i].textContent)) {
        try {
          Starting_Price = temp[i + 1].textContent;
        } catch (error) {}
      }
      if (/Community/i.test(temp[i].textContent)) {
        try {
          Community = clean(temp[i + 1].textContent);
        } catch (error) {}
      }
    }
    let Investment = [];
    let Exclusive_Features = [];
    let Unit_Sizes = [];
    let Overview = "";
    let Payment_Plan = [];
    let Payment_Plan_table = [];
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
      //-------------h3-------------
      if (e.querySelector("h3") !== null) {
        if (/Investment/i.test(e.querySelector("h3").textContent)) {
          temp1 = e.querySelector(
            "div.wpb_text_column.wpb_content_element div.wpb_wrapper ul"
          );
          temp2 = Array.from(temp1.querySelectorAll("li"));
          temp2.forEach((e) => {
            let one = "";
            try {
              one = clean(e.textContent);
            } catch (error) {}
            if (one) {
              Investment.push(one);
            }
          });
        }
        if (/Exclusive Features/i.test(e.querySelector("h3").textContent)) {
          temp1 = e.querySelector(
            "div.wpb_text_column.wpb_content_element div.wpb_wrapper ul"
          );
          temp2 = Array.from(temp1.querySelectorAll("li"));
          temp2.forEach((e) => {
            let one = "";

            try {
              one = clean(e.textContent);
            } catch (error) {}
            if (one) {
              Exclusive_Features.push(one);
            }
          });
        }
        if (/Unit Sizes/i.test(e.querySelector("h3").textContent)) {
          temp1 = e.querySelector(
            "div.wpb_text_column.wpb_content_element div.wpb_wrapper"
          );
          temp2 = Array.from(temp1.querySelectorAll("p"));
          temp2.forEach((e) => {
            let one = "";
            try {
              one = clean(e.textContent);
            } catch (error) {}
            if (one) {
              Unit_Sizes.push(one);
            }
          });
        }
        if (/Overview/i.test(e.querySelector("h3").textContent)) {
          try {
            Overview = clean(
              e.querySelector(
                "div.wpb_text_column.wpb_content_element div.wpb_wrapper"
              ).textContent
            );
          } catch (error) {}
        }
        if (/Gallery/i.test(e.querySelector("h3").textContent)) {
          temp1 = Array.from(
            e.querySelectorAll("div.vc_grid-container-wrapper.vc_clearfix img")
          );

          temp1.forEach((e) => {
            let one = "";
            try {
              one = e.src;
            } catch (error) {}
            if (one) {
              images.push(one);
            }
          });
        }
        if (/Payment Plan/i.test(e.querySelector("h3").textContent)) {
          if (
            e.querySelector(
              "div.wpb_text_column.wpb_content_element div.wpb_wrapper ul"
            ) !== null
          ) {
            temp1 = e.querySelector(
              "div.wpb_text_column.wpb_content_element div.wpb_wrapper ul"
            );
            temp2 = Array.from(temp1.querySelectorAll("li"));
            temp2.forEach((e) => {
              let one = "";
              try {
                one = clean(e.textContent);
              } catch (error) {}
              if (one) {
                Payment_Plan.push(one);
              }
            });
            let s = Array.from(
              e.querySelectorAll(
                "div.wpb_text_column.wpb_content_element div.wpb_wrapper ul li"
              )
            );
            s.forEach((e) => {
              if (/Handover/i.test(e.textContent)) {
                try {
                  handover = clean(
                    e.textContent.replaceAll("Handover:", "").trim()
                  );
                } catch (error) {}
              }
            });
          } else {
            temp1 = Array.from(document.querySelectorAll("div.payment-plan"));
            temp1.forEach((e) => {
              let one = "";
              try {
                one = clean(e.textContent);
              } catch (error) {}
              if (one) {
                Payment_Plan.push(one);
              }
            });
          }
          let temp4 = Array.from(
            document.querySelectorAll("#paymentplan #datatable1 tr")
          );
          let Payment_Plan_all_table = {};
          for (let i = 1; i < temp4.length; i++) {
            let des = "";
            let mil = "";
            let pay = "";
            try {
              des = clean(temp4[i].querySelectorAll("td")[0].textContent);
            } catch (error) {}
            try {
              mil = clean(temp4[i].querySelectorAll("td")[1].textContent);
            } catch (error) {}
            try {
              pay = clean(temp4[i].querySelectorAll("td")[2].textContent);
            } catch (error) {}
            Payment_Plan_all_table[des] = [mil, pay];
          }
          Payment_Plan_table.push(JSON.stringify(Payment_Plan_all_table));
        }
        if (/Interiors/i.test(e.querySelector("h3").textContent)) {
          try {
            Interiors = clean(
              e.querySelector(
                "div.wpb_text_column.wpb_content_element div.wpb_wrapper"
              ).textContent
            );
          } catch (error) {}
        }
        if (/Amenities/i.test(e.querySelector("h3").textContent)) {
          try {
            Amenities_description = clean(
              e.querySelector(
                "div.wpb_text_column.wpb_content_element div.wpb_wrapper"
              ).textContent
            );
          } catch (error) {}
        }
        if (/video/i.test(e.querySelector("h3").textContent)) {
          try {
            video = e.querySelector("div.fluid-width-video-wrapper iframe").src;
          } catch (error) {}
        }
        if (/Floor/i.test(e.querySelector("h3").textContent)) {
          let images = Array.from(e.querySelectorAll("img"));
          images.forEach((e) => {
            try {
              floor_plan_images.push(e.src);
            } catch (error) {}
          });
          floor_plan_images = [...new Set(floor_plan_images)];
        }
      }
      // ------------h2-------------
      if (e.querySelector("h2") !== null) {
        if (/Investment/i.test(e.querySelector("h2").textContent)) {
          temp1 = e.querySelector(
            "div.wpb_text_column.wpb_content_element div.wpb_wrapper ul"
          );
          temp2 = Array.from(temp1.querySelectorAll("li"));
          temp2.forEach((e) => {
            let one = "";
            try {
              one = clean(e.textContent);
            } catch (error) {}
            if (one) {
              Investment.push(one);
            }
          });
        }
        if (/Exclusive Features/i.test(e.querySelector("h2").textContent)) {
          temp1 = e.querySelector(
            "div.wpb_text_column.wpb_content_element div.wpb_wrapper ul"
          );
          temp2 = Array.from(temp1.querySelectorAll("li"));
          temp2.forEach((e) => {
            let one = "";

            try {
              one = clean(e.textContent);
            } catch (error) {}
            if (one) {
              Exclusive_Features.push(one);
            }
          });
        }
        if (/Unit Sizes/i.test(e.querySelector("h2").textContent)) {
          temp1 = e.querySelector(
            "div.wpb_text_column.wpb_content_element div.wpb_wrapper"
          );
          temp2 = Array.from(temp1.querySelectorAll("p"));
          temp2.forEach((e) => {
            let one = "";
            try {
              one = clean(e.textContent);
            } catch (error) {}
            if (one) {
              Unit_Sizes.push(one);
            }
          });
        }
        if (/Overview/i.test(e.querySelector("h2").textContent)) {
          try {
            Overview = clean(
              e.querySelector(
                "div.wpb_text_column.wpb_content_element div.wpb_wrapper"
              ).textContent
            );
          } catch (error) {}
        }
        if (/Gallery/i.test(e.querySelector("h2").textContent)) {
          temp1 = Array.from(
            e.querySelectorAll("div.vc_grid-container-wrapper.vc_clearfix img")
          );

          temp1.forEach((e) => {
            let one = "";
            try {
              one = e.src;
            } catch (error) {}
            if (one) {
              images.push(one);
            }
          });
        }
        if (/Payment Plan/i.test(e.querySelector("h2").textContent)) {
          if (
            e.querySelector(
              "div.wpb_text_column.wpb_content_element div.wpb_wrapper ul"
            ) !== null
          ) {
            temp1 = e.querySelector(
              "div.wpb_text_column.wpb_content_element div.wpb_wrapper ul"
            );
            temp2 = Array.from(temp1.querySelectorAll("li"));
            temp2.forEach((e) => {
              let one = "";
              try {
                one = clean(e.textContent);
              } catch (error) {}
              if (one) {
                Payment_Plan.push(one);
              }
            });
            let s = Array.from(
              e.querySelectorAll(
                "div.wpb_text_column.wpb_content_element div.wpb_wrapper ul li"
              )
            );
            s.forEach((e) => {
              if (/Handover/i.test(e.textContent)) {
                try {
                  handover = clean(
                    e.textContent.replaceAll("Handover:", "").trim()
                  );
                } catch (error) {}
              }
            });
          } else {
            temp1 = Array.from(document.querySelectorAll("div.payment-plan"));
            temp1.forEach((e) => {
              let one = "";
              try {
                one = clean(e.textContent);
              } catch (error) {}
              if (one) {
                Payment_Plan.push(one);
              }
            });
          }
          let temp4 = Array.from(
            document.querySelectorAll("#paymentplan #datatable1 tr")
          );
          let Payment_Plan_all_table = {};
          for (let i = 1; i < temp4.length; i++) {
            let des = "";
            let mil = "";
            let pay = "";
            try {
              des = clean(temp4[i].querySelectorAll("td")[0].textContent);
            } catch (error) {}
            try {
              mil = clean(temp4[i].querySelectorAll("td")[1].textContent);
            } catch (error) {}
            try {
              pay = clean(temp4[i].querySelectorAll("td")[2].textContent);
            } catch (error) {}
            Payment_Plan_all_table[des] = [mil, pay];
          }
          Payment_Plan_table.push(JSON.stringify(Payment_Plan_all_table));
        }
        if (/Interiors/i.test(e.querySelector("h2").textContent)) {
          try {
            Interiors = clean(
              e.querySelector(
                "div.wpb_text_column.wpb_content_element div.wpb_wrapper"
              ).textContent
            );
          } catch (error) {}
        }
        if (/Amenities/i.test(e.querySelector("h2").textContent)) {
          try {
            Amenities_description = clean(
              e.querySelector(
                "div.wpb_text_column.wpb_content_element div.wpb_wrapper"
              ).textContent
            );
          } catch (error) {}
        }
        if (/video/i.test(e.querySelector("h2").textContent)) {
          try {
            video = e.querySelector("div.fluid-width-video-wrapper iframe").src;
          } catch (error) {}
        }
        if (/Floor/i.test(e.querySelector("h2").textContent)) {
          let images = Array.from(e.querySelectorAll("img"));
          images.forEach((e) => {
            try {
              floor_plan_images.push(e.src);
            } catch (error) {}
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
      try {
        Location_Map += clean(e.textContent);
      } catch (error) {}
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
      if (temp[i].querySelector("h3") !== null) {
        if (
          /Amenities/i.test(temp[i].querySelector("h3").textContent) &&
          temp[i + 1].querySelector("h3") === null
        ) {
          all = Array.from(temp[i + 1].querySelectorAll("li"));
          break;
        }
      }
      if (temp[i].querySelector("h2") !== null) {
        if (
          /Amenities/i.test(temp[i].querySelector("h2").textContent) &&
          temp[i + 1].querySelector("h2") === null
        ) {
          all = Array.from(temp[i + 1].querySelectorAll("li"));
          break;
        }
      }
    }
    all.forEach((e) => {
      try {
        Amenities_List.push(clean(e.textContent));
      } catch (error) {}
    });

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
      Payment_Plan_table: Payment_Plan_table,
      Interiors: Interiors,
      Amenities_description: Amenities_description,
      Amenities_List: Amenities_List,
      handover: handover,
      Location_Map: Location_Map,
      Image_location_map: Image_location_map,
      images: images,
      video: video,
      floor_plan_images: floor_plan_images,
      signaturea: Date.now(),
    };
  });
  console.log(links);

  await browser.close();
}
run();
