const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");
const { on } = require("events");
const axios = require("axios");
const { exec } = require("child_process");
// const StealthPlugin = require("puppeteer-extra-plugin-stealth");
// puppeteer.use(StealthPlugin());
function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/buy_near_golf${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "price", title: "price" },
      { id: "type", title: "type" },
      { id: "info", title: "info" },
      { id: "handover", title: "handover" },
      { id: "overview_title", title: "overview_title" },
      { id: "overview", title: "overview" },
      { id: "about", title: "about" },
      { id: "proprty_info", title: "proprty_info" },
      { id: "location", title: "location" },
      { id: "nearby_place", title: "nearby_place" },
      { id: "payment_plan", title: "payment_plan" },
      { id: "images", title: "images" },
      { id: "floor_plans", title: "floor_plans" },
      { id: "brochure", title: "brochure" },
      { id: "floor_plans_pdf", title: "floor_plans_pdf" },
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

let csvErrr = csv_error_handler("buy_near_golf");
let csvWriter = csv_handler("buy_near_golf", 1);
let batch = 0;
let j = 0;
let main_err_record = 0;
let visit_err_record = 0;

async function visit_each(link, page) {
  await page.goto(link.link);
  let data = [];
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
      function extract_one_text_from_pare_elements_in_one_container__pass_array_of_main_containers(
        elmnts,
        key,
        value_selector
      ) {
        let results = [];
        let result = "";
        try {
          results = elmnts.filter((elmnt) => {
            if (elmnt.textContent.includes(key)) return true;
          });
          result = results[0].querySelector(value_selector).textContent;
        } catch (error) {
          console.error(error);
        }
        return result;
      }

      function create_pares_from_pare_elements_in_one_container_if_thing_exists__pass_array_of_pares_containers(
        elmnts,
        search_key,
        key_selector,
        value_selector
      ) {
        let results = elmnts.filter((elmnt) => {
          if (elmnt.textContent.includes(search_key)) return true;
        });
        let result = [];
        results.forEach((e) => {
          let key = e.querySelector(key_selector).textContent;
          let value = e.querySelector(value_selector).textContent;
          result.push({ key, value });
        });
        return JSON.stringify(result);
      }

      function extract_text_from_pare_elements__section__(
        elmnts,
        search_key,
        value_selector
      ) {
        results = "";
        elmnts.forEach((t) => {
          try {
            if (
              t
                .querySelector(".container .projectHeading")
                .textContent.includes(search_key)
            ) {
              results = clean(t.querySelector(value_selector).innerText);
            }
          } catch (error) {
            console.error(error);
          }
        });
        return results;
      }

      // function get_text_from_section_if

      let title = "";
      try {
        title = clean(document.querySelector("title").textContent);
      } catch (error) {}
      let price_payment = [];
      let temp = document.querySelectorAll(
        "#header-menu-desktop ~ div.node.section-zero.section div.zero-layer-axis.lg-left.lg-bottom strong"
      );
      try {
        temp.forEach((e) => price_payment.push(e.textContent));
      } catch (error) {}
      let price = "";
      price_payment.forEach((e) => {
        if (/AED/i.test(e)) {
          price = e;
        }
      });
      price_payment = price_payment.filter((e) => {
        return e !== price;
      });
      let info = [];
      price_payment.forEach((e) => {
        if (/price/i.test(e)) {
          let p = e;
          info = price_payment.filter((e) => {
            return e !== p;
          });
        }
      });
      let handover = [];
      try {
        temp = Array.from(
          document.querySelectorAll(
            "#header-menu-desktop ~ div.node.section-zero.section div.zero-layer-axis.lg-center.lg-bottom strong"
          )
        );
        temp.forEach((e) => {
          handover.push(e.textContent);
        });
      } catch (error) {}
      let temp1 = "";
      try {
        temp1 = document.querySelector(
          "#header-menu-desktop ~ div.node.section-zero.section div.zero-layer-axis.lg-left.lg-top strong"
        ).textContent;
      } catch (error) {}
      let temp2 = "";
      try {
        temp2 = document.querySelector(
          "#header-menu-desktop ~ div.node.section-zero.section div.zero-layer-axis.lg-left.lg-middle strong"
        ).textContent;
      } catch (error) {
        temp2 = Array.from(
          document.querySelectorAll(
            "#header-menu-desktop ~ div.node.section-zero.section div.zero-layer-axis.lg-left.lg-top strong"
          )
        )[1].textContent;
      }
      let overview_title = "";
      try {
        overview_title = temp1 + " " + temp2;
      } catch (error) {}
      let overview = "";
      try {
        overview = clean(
          document.querySelector(
            "#header-menu-desktop ~ div.node.section-zero.section div.zero-layer-axis.lg-left.lg-middle"
          ).textContent
        );
      } catch (error) {}
      let about = "";
      try {
        about = clean(
          document.querySelector(
            "div#about.node.section-clear.section div.node.widget-grid.widget.xs-hidden div.col div.node.widget-text.cr-text.widget.xs-hidden.links-on-black-text p.textable"
          ).textContent
        );
      } catch (error) {}
      let proprty_info = [];
      temp = document.querySelectorAll(
        "div#about.node.section-clear.section div.node.widget-grid.widget.xs-hidden div.grid.valign-middle.paddings-40px.xs-wrap div.gridwrap div.col div.cont div.node.widget-element.widget div.cont div.node.widget-text.cr-text.widget p.textable"
      );
      let one = "";
      try {
        temp.forEach((e) => {
          try {
            one = e.textContent;
          } catch (error) {}
          if (one) proprty_info.push(one);
        });
      } catch (error) {}
      let location = "";
      try {
        location = clean(
          document.querySelector(
            "div#location.node.section-clear.section div.container.fullwidth div.cont div.node.widget-grid.widget div.grid.valign-top.paddings-40px.xs-wrap div.gridwrap div.col div.cont div.node.widget-text.cr-text.widget.links-on-black-text p.textable"
          ).textContent
        );
      } catch (error) {}
      let nearby_place = [];
      temp = Array.from(
        document.querySelectorAll(
          "div#location.node.section-clear.section div.node.widget-grid.widget.xs-hidden div.grid.valign-middle.paddings-40px.xs-wrap div.gridwrap div.col div.cont div.node.widget-element.widget div.cont"
        )
      );
      try {
        temp.forEach((e) => {
          try {
            one = e.textContent;
          } catch (error) {}
          if (one) nearby_place.push(clean(one));
        });
      } catch (error) {}

      let payment_plan = [];
      temp = Array.from(
        document.querySelectorAll(
          "div#pp.node.section-clear.section div.container div.cont div.node.widget-grid.widget div.grid.valign-middle.paddings-40px.xs-wrap div.gridwrap div.col div.cont div.node.widget-element.widget div.cont"
        )
      );
      try {
        temp.forEach((e) => {
          try {
            one = e.textContent;
          } catch (error) {}
          if (one) payment_plan.push(clean(one));
        });
      } catch (error) {}

      return {
        title: title,
        price: price,
        info: info,
        handover: handover,
        overview_title: overview_title,
        overview: overview,
        about: about,
        proprty_info: proprty_info,
        location: location,
        nearby_place: nearby_place,
        payment_plan: payment_plan,
        signaturea: Date.now(),
      };
    })
  );

  const exist_images = await page.evaluate(() => {
    return (
      document.querySelector(
        "#gallery .tabs1-pagination> div:not(.is-active) "
      ) !== null
    );
  });
  let images;
  if (exist_images) {
    await page.click("#gallery .tabs1-pagination> div:not(.is-active)");
    images = await page.evaluate(() => {
      let temp = Array.from(
        document.querySelectorAll("#gallery .gallery1-image.fancybox")
      );
      let imgs = [];
      temp.forEach((e) => {
        try {
          imgs.push(e.href.split(",")[0]);
        } catch (error) {}
      });
      return imgs;
    });
  } else if (
    await page.evaluate(() => {
      return (
        document.querySelector("#gallery .gallery1-image.fancybox") !== null
      );
    })
  ) {
    images = await page.evaluate(() => {
      let temp = Array.from(
        document.querySelectorAll("#gallery .gallery1-image.fancybox")
      );
      let imgs = [];
      temp.forEach((e) => {
        try {
          imgs.push(e.href.split(",")[0]);
        } catch (error) {}
      });
      return imgs;
    });
  } else {
    console.log("no images");
  }
  data[0].images = images;

  //------------- floor plan------
  const floor = await page.evaluate(() => {
    let number = Array.from(document.querySelectorAll("#fp .tabs1-page"));
    let f = [];
    for (let i = 0; i < number.length; i++) {
      number[i].id = `h${i + 1}`;
      f.push(`h${i + 1}`);
    }
    return f;
  });
  let floor_plans = [];
  if (floor.length > 0) {
    for (let f of floor) {
      await page.click(`#${f}`);
      await page.waitForTimeout("700");
      await page.waitForSelector("#fp .swiper-slide.swiper-slide-active");
      floor_plans.push(
        JSON.stringify(
          await page.evaluate(() => {
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
            let size = [];
            let img = "";
            let title = "";
            let temp = document.querySelector(
              "#fp .swiper-slide.swiper-slide-active"
            );
            try {
              let size_all = Array.from(
                temp.querySelectorAll(
                  ".node.widget-text.cr-text.widget + .node.widget-text.cr-text.widget p"
                )
              );
              size_all.forEach((e) => {
                size.push(clean(e.textContent));
              });
            } catch (error) {}

            try {
              img = temp.querySelector(" a .fr-dib.fr-draggable").src;
            } catch (error) {}
            try {
              title = clean(temp.querySelector("h3").textContent);
            } catch (error) {}
            return {
              title: title,
              size: size,
              img: img,
            };
          })
        )
      );
    }
  }
  data[0].floor_plans = floor_plans;
  data[0].type = link.types;

  //  ----------- brochure --------------
  const exists = await page.evaluate(() => {
    return (
      document.querySelector(
        "#header-menu-mobile ~ div.node.section-clear.section.lg-hidden div.node.widget-button.widget div.button-container.center div.button-wrapper a"
      ) &&
      /brochure/i.test(
        document.querySelector(
          "#header-menu-mobile ~ div.node.section-clear.section.lg-hidden div.node.widget-button.widget div.button-container.center div.button-wrapper a span"
        ).textContent
      ) !== null
    );
  });
  if (exists) {
    await page.click(
      "#header-menu-mobile ~ div.node.section-clear.section.lg-hidden div.node.widget-button.widget div.button-container.center div.button-wrapper a"
    );
    await page.waitForSelector(".modal6-root.is-active");

    // Function to generate a random email
    function generateRandomEmail() {
      const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
      let email = "";
      for (let i = 0; i < 10; i++) {
        email += characters[Math.floor(Math.random() * characters.length)];
      }
      email += Math.floor(Math.random() * 100) + "@gmail.com";
      return email;
    }

    // Function to generate a random name
    function generateRandomName() {
      const firstNames = "qwertyuiopasdfghjklzxcvbnm1234567890";
      const lastNames = "qwertyuiopasdfghjklzxcvbnm1234567890";
      let firstName = "";
      let lastName = "";
      for (let i = 0; i < 5; i++) {
        firstNames[Math.floor(Math.random() * firstNames.length)];
        lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      }
      return `${firstName} ${lastName}`;
    }

    // Function to generate a random phone number
    function generateRandomPhoneNumber() {
      let phoneNumber = "555-";
      for (let i = 0; i < 4; i++) {
        phoneNumber += Math.floor(Math.random() * 100);
      }
      return phoneNumber;
    }

    await page.type(
      "div.modal6-root div.modal6-panel2 div.cont div.node.widget-form2.cr-form.widget div div.metahtml div.form1-cover div div.cont div.node.widget-field.cr-field.widget div.metahtml div.is-text div.input input[autocomplete='name']",
      generateRandomName()
    );
    await page.type(
      ".modal.nocolors.active .form-control[autocomplete='tel']",
      generateRandomPhoneNumber()
    );
    await page.type(
      ".modal.nocolors.active .form-control[autocomplete='email']",
      generateRandomEmail()
    );

    await page.evaluate(() => {
      document
        .querySelector(".modal.nocolors.active button:not(.modal6-close)")
        .click();
    });
    // await page.waitForNavigation();
    // await page.setDefaultNavigationTimeout(80000);
    // await page.waitForTimeout(1000);
    while (true) {
      if (/"#modal-brochure"/i.test(page.url())) {
        await page.waitForTimeout(1000);
      } else {
        break;
      }
    }
    let brochure = await page.evaluate(() => document.location.href);
    data[0].brochure = brochure;
    await page.goto(link.link);
    await page.waitForTimeout(1000);
  } else {
    console.log("yyyy");
  }

  // ----------- floor plan pdf  --------------

  const exists_plan_btn = await page.evaluate(() => {
    return (
      document.querySelector(
        "#fp .node.widget-element.widget .cont .node.widget-button.widget.lg-hidden .button-container.left.xs-full .button-wrapper a"
      ) !== null
    );
  });
  if (exists_plan_btn) {
    await page.click(
      "#fp .node.widget-element.widget .cont .node.widget-button.widget.lg-hidden .button-container.left.xs-full .button-wrapper a"
    );
    await page.waitForSelector(".modal6-root.is-active");
    function generateRandomEmail() {
      const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
      let email = "";
      for (let i = 0; i < 10; i++) {
        email += characters[Math.floor(Math.random() * characters.length)];
      }
      email += Math.floor(Math.random() * 100) + "@gmail.com";
      return email;
    }

    // Function to generate a random name
    function generateRandomName() {
      const firstNames = "qwertyuiopasdfghjklzxcvbnm1234567890";
      const lastNames = "qwertyuiopasdfghjklzxcvbnm1234567890";
      let firstName = "";
      let lastName = "";
      for (let i = 0; i < 5; i++) {
        firstNames[Math.floor(Math.random() * firstNames.length)];
        lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      }
      return `${firstName} ${lastName}`;
    }

    // Function to generate a random phone number
    function generateRandomPhoneNumber() {
      let phoneNumber = "555-";
      for (let i = 0; i < 4; i++) {
        phoneNumber += Math.floor(Math.random() * 100);
      }
      return phoneNumber;
    }
    await page.type(
      '.modal6-root.is-active div.input input[autocomplete="name"]',
      generateRandomName()
    );
    await page.type(
      '.modal6-root.is-active div.input input[autocomplete="tel"]',
      generateRandomPhoneNumber()
    );
    await page.type(
      '.modal6-root.is-active div.input input[autocomplete="email"]',
      generateRandomEmail()
    );
    await page.evaluate(() => {
      document
        .querySelector(".modal6-root.is-active button:not(.modal6-close)")
        .click();
    });
    // await page.waitForNavigation();
    // await page.setDefaultNavigationTimeout(80000);
    while (true) {
      if (/"#modal-fp"/i.test(page.url())) {
        await page.waitForTimeout(1000);
      } else {
        break;
      }
    }
    let floor_plans_pdf = await page.evaluate(() => document.location.href);
    data[0].floor_plans_pdf = floor_plans_pdf;
  } else {
    console.log("yyyy");
  }

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("buy_near_golf", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = "https://opr.ae/projects/properties-near-golf-course-in-dubai";
  await page.goto(target);
  console.log(target);
  for (let j = 1; j <= i; j++) {
    await page.waitForSelector("div.offPlanListing__loadMore a");
    await page.evaluate(() => {
      document.querySelector("div.offPlanListing__loadMore a").click();
    });
    console.log(j);
  }
  const links = await page.evaluate(() => {
    const items = Array.from(
      document.querySelectorAll(
        ".node.section-clear.section .code #OffPlanListing #addListing .offPlanListing  .offPlanListing__item"
      )
    );
    let anchors = [];
    items.forEach((item) => {
      let a = item.querySelector(".offPlanListing__item-titleLink").href;
      let types = Array.from(
        item.querySelectorAll(".offPlanListing__item-type"),
        (type) => type.textContent
      );
      anchors.push({ link: a, types: types });
    });
    let uniqe_links = [...new Set(anchors)];
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
            .writeRecords({ link: link.link, error: err })
            .then(() => console.log("error logged main loop"));
          continue;
        }
      }
    }
    if (
      links.indexOf(link) === 0 ||
      links.indexOf(link) % 20 === 0 ||
      links.indexOf(link) === links.length - 1
    ) {
      const message = `Data - opr ${links.indexOf(link) + 1} done`;

      const url = "https://profoundproject.com/tele/";

      axios
        .get(url, {
          params: {
            message: message,
          },
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
      if (links.indexOf(link) === links.length - 1) {
        exec("pm2 stop main2", (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing command: ${error}`);
            return;
          }

          console.log(`stdout: ${stdout}`);
          console.error(`stderr: ${stderr}`);
        });
      }
    }
  }
}

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/usr/bin/google-chrome-stable",
    args: [
      "--no-sandbox",
      "--proxy-server=socks://127.0.0.1:9050",
      "--disable-web-security",
      "--allow-running-insecure-content",
    ],
  });
  const page = await browser.newPage();
  try {
    await main_loop(page, 2);
  } catch (error) {
    try {
      await main_loop(page, 2);
    } catch (error) {
      console.error(error);
    }
  }

  await browser.close();
}

main();
