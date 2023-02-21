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
    "https://famproperties.com/bluewaters-island-dubai/bluewaters-bay"
  );
  await page.evaluate(() => {
    document.querySelector(
      ".col.col-12.apex-col-auto.marquizPopup.col-start.col-end"
    ).style.display = "none";
  });
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
    let temp;
    let cover_img = "";
    try {
      cover_img = document
        .querySelector(".main-banner.lozad")
        .style.backgroundImage.slice(5, -2);
    } catch (error) {}
    let price = "";
    try {
      price = clean(
        document.querySelector(
          ".sub-heading.padding-top-lg.padding-bottom-lg.u-textLeft.padding-left-md"
        ).textContent
      );
      price = price.replace(price.match(/starting price/i)[0], "");
    } catch (error) {}
    let Lifestyle = "";
    let type = "";
    let title_type = "";
    let Completion_data = "";
    let developer = "";
    temp = Array.from(
      document.querySelectorAll(
        ".property-highlights.project.info-based li .highlight-option"
      )
    );
    temp.forEach((e) => {
      let key = clean(e.querySelector("span").textContent);
      let value = clean(e.textContent);
      if (/Developer/i.test(key)) {
        developer = value;
        developer = developer.replace(key, "");
      }
      if (/Lifestyle/i.test(key)) {
        Lifestyle = value;
        Lifestyle = Lifestyle.replace(key, "");
      }
      if (/Completion date/i.test(key)) {
        Completion_data = value;
        Completion_data = Completion_data.replace(key, "");
      }
      if (/Title type/i.test(key)) {
        title_type = value;
        title_type = title_type.replace(key, "");
      }
      if (/Type/i.test(key) && !/Title type/i.test(key)) {
        type = value;
        type = type.replace(key, "");
      }
    });
    let payment_plan = [];
    let payment_plan_all = {};
    temp = Array.from(
      document.querySelectorAll(
        "#report_24261508315928286013_catch li .t-Card-title"
      )
    );
    temp.forEach((e) => {
      try {
        payment_plan_all[clean(e.querySelector("h3").textContent)] = clean(
          e.querySelector("h4").textContent
        );
      } catch (error) {}
    });
    payment_plan.push(JSON.stringify(payment_plan_all));
    let images = [];
    temp = Array.from(
      document.querySelectorAll("#R23240284213309688160 .swiper-slide img")
    );
    temp.forEach((e) => {
      try {
        images.push(e.src);
      } catch (error) {}
    });
    images = [...new Set(images)];
    let amenities = [];
    temp = Array.from(
      document.querySelectorAll(
        "#R22528583529857287712_Cards .a-CardView-items.a-CardView-items--grid4col li"
      )
    );
    temp.forEach((e) => {
      try {
        amenities.push(clean(e.textContent));
      } catch (error) {}
    });
    let overview = "";
    try {
      overview = clean(document.querySelector("#overview").textContent);
    } catch (error) {}
    let overview_img = "";
    try {
      overview_img = document.querySelector("#overview img").src;
    } catch (error) {}
    let nearby_schools = [];
    temp = Array.from(
      document.querySelectorAll(
        "#R29114923532291890799_Cards .a-CardView-header"
      )
    );
    temp.forEach((e) => {
      try {
        nearby_schools.push(clean(e.querySelector("h3").textContent));
      } catch (error) {}
    });
    let buildings = [];
    temp = Array.from(document.querySelectorAll("#building-types_Cards li"));
    temp.forEach((e) => {
      try {
        buildings.push(clean(e.textContent));
      } catch (error) {}
    });
    let properties = [];
    temp = Array.from(
      document.querySelectorAll("#listings  .t-Report-report tbody tr")
    );
    temp.forEach((e) => {
      try {
        properties.push({
          title: clean(
            e.querySelector(
              "#listings  .t-Report-report tbody tr td[headers='TITLE'] "
            ).textContent
          ),
          type: clean(
            e.querySelector(
              "#listings  .t-Report-report tbody tr td[headers='PROPERTY'] p"
            ).textContent
          ),
          beds_baths: clean(
            e.querySelector(
              "#listings  .t-Report-report tbody tr td[headers='PROPERTY'] span"
            ).textContent
          ),
          price: clean(
            e.querySelector(
              "#listings  .t-Report-report tbody tr td[headers='PRICE'] span"
            ).textContent
          ),
          size: clean(
            e.querySelector(
              "#listings  .t-Report-report tbody tr td[headers='PRICE'] p"
            ).textContent
          ),
        });
      } catch (error) {}
    });
    return {
      title: title,
      cover_img: cover_img,
      price: price,
      Lifestyle: Lifestyle,
      type: type,
      title_type: title_type,
      Completion_data: Completion_data,
      developer: developer,
      payment_plan: payment_plan,
      images: images,
      amenities: amenities,
      nearby_schools: nearby_schools,
      buildings: buildings,
      properties: properties,
    };
  });
  console.log(links);
  const backgroundImage = await page.evaluate(
    (el) => window.getComputedStyle(el).backgroundImage,
    await page.$(".main-banner.lozad")
  );
  console.log(backgroundImage.slice(5, -2));

  const exist = await page.evaluate(() => {
    return (
      document.querySelector(
        ".a-GV-pageButton.a-GV-pageButton--nav.js-pg-next"
      ) !== null
    );
  });

  let s = [];
  if (exist) {
    await page.click(".a-GV-pageButton.a-GV-pageButton--nav.js-pg-next");
    await page.waitForTimeout(500);
    s.push(
      JSON.stringify(
        await page.evaluate(() => {
          let temp = Array.from(
            document.querySelectorAll(
              "#R29114923532291890799_Cards .a-CardView-header"
            )
          );
          let ss = [];
          let title = "";
          let Curriculum = "";
          let Rating = "";
          temp.forEach((e) => {
            try {
              title = e.querySelector("h3").textContent;
            } catch (error) {}
            try {
              Curriculum = e
                .querySelector("h4")
                .textContent.replace(
                  e.querySelector(" h4 span.u-color-4-text.padding-right-sm")
                    .textContent,
                  ""
                );
            } catch (error) {}
            try {
              Rating = e
                .querySelectorAll("h4")[1]
                .textContent.replace(
                  e.querySelectorAll(
                    " h4 span.u-color-4-text.padding-right-sm"
                  )[1].textContent,
                  ""
                );
            } catch (error) {}
            ss.push({ title, Curriculum, Rating });
          });
          return ss;
        })
      )
    );
    while (true) {
      // await page.waitForSelector
      // await page.click("#marquizPopup .fa.fa-times.fa-2x.closeMarquiz");
      if (
        await page.evaluate(() => {
          return (
            document
              .querySelector(".a-GV-pageButton.a-GV-pageButton--nav.js-pg-next")
              .getAttribute("disabled") !== null
          );
        })
      ) {
        break;
      }
      await page.click(".a-GV-pageButton.a-GV-pageButton--nav.js-pg-next");
      await page.waitForTimeout(2000);

      s.push(
        JSON.stringify(
          await page.evaluate(() => {
            let temp = Array.from(
              document.querySelectorAll(
                "#R29114923532291890799_Cards .a-CardView-header"
              )
            );
            let ss = [];
            let title = "";
            let Curriculum = "";
            let Rating = "";
            temp.forEach((e) => {
              try {
                title = e.querySelector("h3").textContent;
              } catch (error) {}
              try {
                Curriculum = e
                  .querySelector("h4")
                  .textContent.replace(
                    e.querySelector(" h4 span.u-color-4-text.padding-right-sm")
                      .textContent,
                    ""
                  );
              } catch (error) {}
              try {
                Rating = e
                  .querySelectorAll("h4")[1]
                  .textContent.replace(
                    e.querySelectorAll(
                      " h4 span.u-color-4-text.padding-right-sm"
                    )[1].textContent,
                    ""
                  );
              } catch (error) {}
              ss.push({ title, Curriculum, Rating });
            });
            return ss;
          })
        )
      );
    }
    console.log(s);
  } else {
    console.log("no");
  }
  const images = await page.evaluate(() => {
    return document.querySelector("#R23240284213309688160") !== null;
  });
  let all = [];
  if (images) {
    let len = await page.evaluate(() => {
      let le = Array.from(
        document.querySelectorAll(
          "#R23240284213309688160 .swiper-pagination.swiper-pagination-clickable.swiper-pagination-bullets.swiper-pagination-bullets-dynamic span"
        )
      );
      return le;
    });
    for (let i = 0; i < len.length; i++) {
      await page.click(
        "#R23240284213309688160 .fa.fa-chevron-circle-right.fa-3x"
      );
      await page.waitForTimeout(300);
    }
    all = await page.evaluate(() => {
      let images = [];
      let temp = Array.from(
        document.querySelectorAll("#R23240284213309688160 .swiper-slide img")
      );
      temp.forEach((e) => {
        try {
          images.push(e.src);
        } catch (error) {}
      });
      return images;
    });
    console.log(all);
    console.log(all.length);
    console.log([...new Set(all)].length);
    // console.log(all);
  } else {
    console.log("no");
  }
  // -----------------------------------------------
  //   await page.waitForSelector(
  //     ".a-GV-pageButton.a-GV-pageButton--nav.js-pg-next"
  //   );
  // //   const exist = await page.evaluate(() => {
  // //     return (
  // //       document.querySelector(
  // //         ".a-GV-pageButton.a-GV-pageButton--nav.js-pg-next"
  // //       ) !== null
  // //     );
  // //   });
  // //   if (exist) {
  // //     await page.click(".a-GV-pageButton.a-GV-pageButton--nav.js-pg-next");
  // //     console.log("yes");
  // //     await page.waitForTimeout(2000);
  // //     let i = 1;
  // //     while (true) {
  // //       let s = await page.evaluate(() => {
  // //         let btn =
  // //           document
  // //             .querySelector(".a-GV-pageButton.a-GV-pageButton--nav.js-pg-next")
  // //             .getAttribute("disabled") === "disabled";
  // //         if (btn) return true;
  // //         return false;
  // //       });
  // //       if (s) {
  // //         console.log("no");
  // //         break;
  // //       }
  // //       await page.click(".a-GV-pageButton.a-GV-pageButton--nav.js-pg-next");
  // //       console.log("yes");
  // //       console.log(i);
  // //       i++;
  // //       await page.waitForTimeout(1000);
  // //     }
  // //   }
  await browser.close();
}
run();
// document
// .querySelector(".a-GV-pageButton.a-GV-pageButton--nav.js-pg-next")
// .getAttribute("disabled") === null
