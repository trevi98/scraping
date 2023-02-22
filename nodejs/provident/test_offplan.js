const puppeteer = require("puppeteer");
async function run() {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--enable-automation"],
  });
  const page = await browser.newPage();
  await page.goto(
    "https://www.providentestate.com/dubai-offplan/damac-bay-by-cavalli.html"
  );
  // Evaluate the page content and modify target attribute
  const html = await page.evaluate(() => {
    const links = document.querySelectorAll('a[target="_blank"]');
    links.forEach((link) => link.setAttribute("target", ""));
    return document.documentElement.outerHTML;
  });

  // Update the page with the modified HTML content
  await page.setContent(html);

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
              one = e.textContent;
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
              one = e.textContent;
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
              one = e.textContent;
            } catch (error) {}
            if (one) {
              Unit_Sizes.push(one);
            }
          });
        }
        if (/Overview/i.test(e.querySelector("h3").textContent)) {
          try {
            Overview = e.querySelector(
              "div.wpb_text_column.wpb_content_element div.wpb_wrapper"
            ).textContent;
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
        if (/video/i.test(e.querySelector("h3").textContent)) {
          try {
            video = e.querySelector("div.fluid-width-video-wrapper iframe").src;
          } catch (error) {}
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
                one = e.textContent;
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
                handover = e.textContent.replaceAll("Handover:", "").trim();
              }
            });
          } else {
            temp1 = Array.from(document.querySelectorAll("div.payment-plan"));
            temp1.forEach((e) => {
              let one = "";
              try {
                one = e.textContent;
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
              des = temp4[i].querySelectorAll("td")[0].textContent;
            } catch (error) {}
            try {
              mil = temp4[i].querySelectorAll("td")[1].textContent;
            } catch (error) {}
            try {
              pay = temp4[i].querySelectorAll("td")[2].textContent;
            } catch (error) {}
            Payment_Plan_all_table[des] = [mil, pay];
          }
          Payment_Plan_table.push(JSON.stringify(Payment_Plan_all_table));
        }
        if (/Interiors/i.test(e.querySelector("h3").textContent)) {
          Interiors = e.querySelector(
            "div.wpb_text_column.wpb_content_element div.wpb_wrapper"
          ).textContent;
        }
        if (/Amenities/i.test(e.querySelector("h3").textContent)) {
          try {
            Amenities_description = e.querySelector(
              "div.wpb_text_column.wpb_content_element div.wpb_wrapper"
            ).textContent;
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
              one = e.textContent;
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
              one = e.textContent;
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
              one = e.textContent;
            } catch (error) {}
            if (one) {
              Unit_Sizes.push(one);
            }
          });
        }
        if (/Overview/i.test(e.querySelector("h2").textContent)) {
          Overview = e.querySelector(
            "div.wpb_text_column.wpb_content_element div.wpb_wrapper"
          ).textContent;
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
        if (/video/i.test(e.querySelector("h2").textContent)) {
          try {
            video = e.querySelector("div.fluid-width-video-wrapper iframe").src;
          } catch (error) {}
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
                one = e.textContent;
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
                handover = e.textContent.replaceAll("Handover:", "").trim();
              }
            });
          } else {
            temp1 = Array.from(document.querySelectorAll("div.payment-plan"));
            temp1.forEach((e) => {
              let one = "";
              try {
                one = e.textContent;
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
              des = temp4[i].querySelectorAll("td")[0].textContent;
            } catch (error) {}
            try {
              mil = temp4[i].querySelectorAll("td")[1].textContent;
            } catch (error) {}
            try {
              pay = temp4[i].querySelectorAll("td")[2].textContent;
            } catch (error) {}
            Payment_Plan_all_table[des] = [mil, pay];
          }
          Payment_Plan_table.push(JSON.stringify(Payment_Plan_all_table));
        }
        if (/Interiors/i.test(e.querySelector("h2").textContent)) {
          Interiors = e.querySelector(
            "div.wpb_text_column.wpb_content_element div.wpb_wrapper"
          ).textContent;
        }
        if (/Amenities/i.test(e.querySelector("h2").textContent)) {
          Amenities_description = e.querySelector(
            "div.wpb_text_column.wpb_content_element div.wpb_wrapper"
          ).textContent;
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
        Location_Map += e.textContent;
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
        if (/Amenities/i.test(temp[i].querySelector("h3").textContent)) {
          all = Array.from(temp[i + 1].querySelectorAll("li"));
          break;
        }
      }
      if (temp[i].querySelector("h2") !== null) {
        if (/Amenities/i.test(temp[i].querySelector("h2").textContent)) {
          all = Array.from(temp[i + 1].querySelectorAll("li"));
          break;
        }
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
    };
  });
  console.log(links);

  //#################### brochure #####################################
  const exists = await page.evaluate(() => {
    return (
      document.querySelector(
        "div.vc_btn3-container.download_btn.vc_btn3-center a"
      ) !== null &&
      /download brochure/i.test(
        document.querySelectorAll(
          "div.vc_btn3-container.download_btn.vc_btn3-center a"
        )[0].textContent
      )
    );
  });
  if (exists) {
    await page.click("div.vc_btn3-container.download_btn.vc_btn3-center a");
    await page.waitForSelector(
      "div.modal-content div.modal-body.listing-form-7 form input[name='your-name']"
    );
    await page.evaluate(() => {
      document.querySelector(
        "div.modal-content div.modal-body.listing-form-7 form input[name='your-name']"
      ).value = "John";
      document.querySelector(
        "div.modal-content div.modal-body.listing-form-7 form input[name='your-email']"
      ).value = "jhon@jmail.com";
      document.querySelector(
        "div.modal-content div.modal-body.listing-form-7 form input[name='your-phone']"
      ).value = "944331234";
      document.querySelector(
        "div.modal-content div.modal-body.listing-form-7 form textarea[name='your-message']"
      ).value = "Hello";
    });

    await page.evaluate(() => {
      document
        .querySelector(
          "div.modal-content div.modal-body.listing-form-7 div form input[type=submit]"
        )
        .click();
    });
    await page.waitForNavigation();
    let brochure = await page.evaluate(() => document.location.href);

    // const [newPage] = await Promise.all([
    //   new Promise((resolve) =>
    //     browser.once("targetcreated", (target) => resolve(target.page()))
    //   ),
    //   await page.evaluate(() => {
    //     document
    //       .querySelector(
    //         "div.modal-content div.modal-body.listing-form-7 div form input[type=submit]"
    //       )
    //       .click();
    //   }),
    // ]);
    // // Get the URL of the new page
    // const url = await newPage.url();
    // brochure = url;
    console.log(brochure);
    console.log("yes");
    await page.goto(
      "https://www.providentestate.com/dubai-offplan/creek-beach-lotus.html"
    );
  } else {
    console.log("no");
  }

  //#################### floor_link #####################################
  const exists_floor_btn = await page.evaluate(() => {
    return (
      document.querySelectorAll(
        "div.vc_btn3-container.download_btn.vc_btn3-center a"
      )[1] !== null &&
      /floor/i.test(
        document.querySelectorAll(
          "div.vc_btn3-container.download_btn.vc_btn3-center a"
        )[1].textContent
      )
    );
  });
  if (exists_floor_btn) {
    await page.evaluate(() => {
      document
        .querySelectorAll(
          "div.vc_btn3-container.download_btn.vc_btn3-center a"
        )[1]
        .click();
    });
    await page.waitForSelector(
      "div.modal-content div.modal-body.listing-form-7 form input[name='your-name']"
    );
    await page.evaluate(() => {
      document.querySelector(
        "div.modal-content div.modal-body.listing-form-7 form input[name='your-name']"
      ).value = "John";
      document.querySelector(
        "div.modal-content div.modal-body.listing-form-7 form input[name='your-email']"
      ).value = "jhon@jmail.com";
      document.querySelector(
        "div.modal-content div.modal-body.listing-form-7 form input[name='your-phone']"
      ).value = "944331234";
      document.querySelector(
        "div.modal-content div.modal-body.listing-form-7 form textarea[name='your-message']"
      ).value = "Hello";
    });

    await page.evaluate(() => {
      document
        .querySelector(
          "div.modal-content div.modal-body.listing-form-7 div form input[type=submit]"
        )
        .click();
    });

    const [newPage] = await Promise.all([
      new Promise((resolve) =>
        browser.once("targetcreated", (target) => resolve(target.page()))
      ),
      await page.evaluate(() => {
        document
          .querySelector(
            "div.modal-content div.modal-body.listing-form-7 div form input[type=submit]"
          )
          .click();
      }),
    ]);
    // Get the URL of the new page
    const url = await newPage.url();
    let floor_plan_link = url;
    console.log(floor_plan_link);
  } else {
    console.log("no floor_plan_link");
  }

  await browser.close();
}
run();
// https://www.providentestate.com/dubai-offplan/damac-lagoons.html

// https://www.providentestate.com/dubai-offplan/nad-al-sheba.html

// https://www.providentestate.com/dubai-offplan/belair-the-trump-estate.html
