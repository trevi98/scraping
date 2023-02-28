const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");
const { type } = require("os");

function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/offplan${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "type", title: "type" },
      { id: "area", title: "area" },
      { id: "developer", title: "developer" },
      { id: "price", title: "price" },
      { id: "Post_Handover", title: "Post_Handover" },
      { id: "completion", title: "completion" },
      { id: "payment_plan", title: "payment_plan" },
      { id: "Fees_Waiver", title: "Fees_Waiver" },
      { id: "For_Book", title: "For_Book" },
      { id: "overview", title: "overview" },
      { id: "about", title: "about" },
      { id: "about_img", title: "about_img" },
      { id: "amenities", title: "amenities" },
      { id: "floor_plans", title: "floor_plans" },
      { id: "images", title: "images" },
      { id: "signaturea", title: "signaturea" },
    ],
  });
}

function csv_error_handler(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/error_links.csv`,
    header: [
      { id: "link", title: "link" },
      { id: "error", title: "error" },
    ],
  });
}

let csvErrr = csv_error_handler("offplan");
let csvWriter = csv_handler("offplan", 1);
let batch = 0;
let j = 0;
let main_err_record = 0;
let visit_err_record = 0;

async function visit_each(link, page) {
  await page.goto(link.link);
  let data = [];
  // await page.waitForSelector(".widgetModal .widgetModal-inner");
  // await page.evaluate(() => {
  //   document
  //     .querySelector(
  //       ".widgetModal .widgetModal-inner .widgetModal-close.js-closeModal"
  //     )
  //     .click();
  // });
  await page.addStyleTag({
    content: ".widgetModal { display: none !important; }",
  });
  data.push(
    await page.evaluate(async () => {
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
      let overview = "";
      try {
        overview = clean(
          document.querySelector(
            ".elementor-background-slideshow.swiper-container+.elementor-container .elementor-column.elementor-col-50.elementor-top-column.elementor-element .elementor-widget-text-editor p"
          ).textContent
        );
      } catch (error) {}
      let price = "";
      let Post_Handover = "";
      let completion = "";
      let payment_plan = "";
      let Fees_Waiver = "";
      let For_Book = "";
      let temp = Array.from(
        document.querySelectorAll(
          ".elementor-background-slideshow.swiper-container+.elementor-container .elementor-column.elementor-col-50.elementor-top-column.elementor-element .elementor-section-height-default .elementor-column.elementor-col-25.elementor-inner-column"
        )
      );
      temp.forEach((e) => {
        let key;
        let value;
        try {
          key = clean(e.querySelector("p").textContent);
        } catch (error) {}
        try {
          value = clean(e.querySelector("h3").textContent);
        } catch (error) {}
        if (/price/i.test(key)) {
          price = value;
        }
        if (/For Book/i.test(key)) {
          For_Book = value;
        }
        if (/Post-Handover/i.test(key)) {
          Post_Handover = value;
        }
        if (/completion/i.test(key)) {
          completion = value;
        }
        if (/payment plan/i.test(key)) {
          payment_plan = value;
        }
        if (/Fees Waiver/i.test(key)) {
          Fees_Waiver = value;
        }
      });
      let about = "";
      try {
        about = clean(
          document.querySelector(
            ".elementor-section.elementor-top-section +section .elementor-column.elementor-col-100 .elementor-skin-carousel.elementor-widget.elementor-widget-media-carousel +div +.elementor-widget-text-editor"
          ).textContent
        );
      } catch (error) {
        try {
          about = clean(
            document.querySelector(
              ".elementor-column.elementor-col-50.elementor-inner-column.elementor-element + .elementor-column.elementor-col-50.elementor-inner-column.elementor-element"
            ).textContent
          );
        } catch (error) {}
      }
      let amenities = [];
      let all_amenities = {};
      temp = Array.from(
        document.querySelectorAll(
          ".elementor-container.elementor-column-gap-no .elementor-column.elementor-col-25.elementor-top-column"
        )
      );
      temp.forEach((e) => {
        try {
          all_amenities[clean(e.querySelector("h3").textContent)] = clean(
            e.querySelector("p").textContent
          );
        } catch (error) {}
      });
      amenities.push(JSON.stringify(all_amenities));
      let floor_plans = [];
      let titles_floor = [];
      let images_floor = [];
      temp = Array.from(document.querySelectorAll(".alignnone.size-medium"));
      temp.forEach((e) => {
        try {
          images_floor.push(e.src);
        } catch (error) {}
      });
      temp = Array.from(
        document.querySelectorAll(
          ".elementor-tab-title.elementor-tab-desktop-title"
        )
      );
      temp.forEach((e) => {
        try {
          titles_floor.push(clean(e.textContent));
        } catch (error) {}
      });
      for (let i = 0; i < titles_floor.length; i++) {
        floor_plans.push(
          JSON.stringify({ title: titles_floor[i], img: images_floor[i] })
        );
      }
      return {
        title: title,
        overview: overview,
        price: price,
        Post_Handover: Post_Handover,
        completion: completion,
        payment_plan: payment_plan,
        Fees_Waiver: Fees_Waiver,
        For_Book: For_Book,
        about: about,
        amenities: amenities,
        floor_plans: floor_plans,
        signaturea: Date.now(),
      };
    })
  );
  data[0].type = link.type;
  data[0].area = link.area;
  data[0].developer = link.developer;
  await page.waitForSelector(".swiper-slide .elementor-carousel-image");
  const backgroundImages = await page.evaluate(() => {
    const elements = Array.from(
      document.querySelectorAll(".swiper-slide .elementor-carousel-image")
    );
    return elements
      .map((element) => {
        const style = window.getComputedStyle(element);
        return style.getPropertyValue("background-image");
      })
      .filter((image) => image !== "none");
  });
  let images = [];
  let about_img = "";
  for (let i = 0; i < backgroundImages.length; i++) {
    if (i == 0) about_img = backgroundImages[i].slice(5, -2);
    else {
      images.push(backgroundImages[i].slice(5, -2));
    }
  }
  images = [...new Set(images)];
  data[0].about_img = about_img;
  data[0].images = images;

  //   const exixst_brochure = await page.evaluate(() => {
  //     return (
  //       document.querySelectorAll(
  //         ".elementor-button-link.elementor-button.elementor-size-sm"
  //       )[3] !== null &&
  //       /brochure/i.test(
  //         document.querySelectorAll(
  //           ".elementor-button-link.elementor-button.elementor-size-sm"
  //         )[3].textContent
  //       )
  //     );
  //   });
  //   if (exixst_brochure) {
  //     await page.evaluate(() => {
  //       document
  //         .querySelectorAll(
  //           ".elementor-button-link.elementor-button.elementor-size-sm"
  //         )[3]
  //         .click();
  //     });
  //     // Function to generate a random email
  //     function generateRandomEmail() {
  //       const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  //       let email = "";
  //       for (let i = 0; i < 10; i++) {
  //         email += characters[Math.floor(Math.random() * characters.length)];
  //       }
  //       email += Math.floor(Math.random() * 100) + "@example.com";
  //       return email;
  //     }

  //     // Function to generate a random name
  //     function generateRandomName() {
  //       const firstNames = ["John", "Jane", "Bob", "Alice", "Mike", "Emily"];
  //       const lastNames = ["Doe", "Smith", "Johnson", "Jones", "Brown", "Taylor"];
  //       const firstName =
  //         firstNames[Math.floor(Math.random() * firstNames.length)];
  //       const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  //       return `${firstName} ${lastName}`;
  //     }

  //     // Function to generate a random phone number
  //     function generateRandomPhoneNumber() {
  //       let phoneNumber = "555-";
  //       for (let i = 0; i < 4; i++) {
  //         phoneNumber += Math.floor(Math.random() * 10);
  //       }
  //       return phoneNumber;
  //     }
  //     await page.type(
  //       ".elementor-popup-modal .elementor-widget-wrap.elementor-element-populated form input[name='form_fields[name]']",
  //       generateRandomName()
  //     );
  //     await page.type(
  //       ".elementor-popup-modal .elementor-widget-wrap.elementor-element-populated form input[type='tel']",
  //       generateRandomPhoneNumber
  //     );
  //     await page.type(
  //       ".elementor-popup-modal .elementor-widget-wrap.elementor-element-populated form input[name='form_fields[email]']",
  //       generateRandomEmail
  //     );
  //     await page.evaluate(() => {
  //       document
  //         .querySelector(
  //           ".elementor-popup-modal .elementor-widget-wrap.elementor-element-populated form button[type='submit']"
  //         )
  //         .click();
  //     });
  //   }

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("offplan", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = `https://dandbdubai.ae/offplan-properties-sale-dubai/`;
  console.log(target);
  await page.goto(target);
  await page.addStyleTag({
    content: ".widgetModal { display: none !important; }",
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
    let all = [];
    let card = Array.from(
      document.querySelectorAll(
        ".elementor-container.elementor-column-gap-default >.elementor-column.elementor-col-33 "
      )
    );

    card.forEach((e) => {
      let type = [];
      let temp = Array.from(
        e.querySelectorAll(
          ".elementor-widget-image~ .elementor-widget__width-initial .elementor-widget-container h2"
        )
      );
      temp.forEach((s) => {
        try {
          type.push(clean(s.textContent));
        } catch (error) {}
      });
      let a = e.querySelector(
        ".elementor-element.elementor-widget-divider--view-line.elementor-widget.elementor-widget-divider+.elementor-section .elementor-button-link.elementor-button"
      ).href;
      let area = clean(
        e.querySelectorAll(
          ".elementor-icon-list-item .elementor-icon-list-text"
        )[0].textContent
      );
      let developer = clean(
        e.querySelectorAll(
          ".elementor-icon-list-item .elementor-icon-list-text"
        )[1].textContent
      );
      all.push({ link: a, type: type, developer: developer, area: area });
    });
    let uniqe_links = [...new Set(all)];
    return uniqe_links;
  });
  for (const link of links) {
    try {
      await visit_each(link, page);
    } catch (error) {
      try {
        await visit_each(link, page);
      } catch (err) {
        try {
          await visit_each(link, page);
        } catch (error) {
          console.error(error);
          csvErrr
            .writeRecords({ link: link, error: err })
            .then(() => console.log("error logged main loop"));
          continue;
        }
      }
    }
  }
}

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--enable-automation"],
  });
  const page = await browser.newPage();
  for (let i = 1; i <= 1; i++) {
    try {
      await main_loop(page, i);
    } catch (error) {
      try {
        await main_loop(page, i);
      } catch (error) {
        console.error(error);
        csvErrr
          .writeRecords({ link: i, error: error })
          .then(() => console.log("error logged main"));
        continue;
      }
    }
  }
  await browser.close();
}

main();
