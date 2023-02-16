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
    "https://opr.ae/projects/meraas-bluewaters-bay-apartments-for-sale-in-dubai"
  );
  const links = await page.evaluate(() => {
    // .node.section-clear.section.font-text-opensanslight.font-header-opensanslight .node.widget-text.cr-text.widget h2
    let title = document.querySelector("title").textContent;
    let price_payment = [];
    let temp = document.querySelectorAll(
      "#header-menu-desktop ~ div.node.section-zero.section div.zero-layer-axis.lg-left.lg-bottom strong"
    );
    temp.forEach((e) => price_payment.push(e.textContent));
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
    let handover = Array.from(
      document.querySelectorAll(
        "#header-menu-desktop ~ div.node.section-zero.section div.zero-layer-axis.lg-center.lg-bottom strong"
      )
    )[0].innerText;
    let temp1 = document.querySelector(
      "#header-menu-desktop ~ div.node.section-zero.section div.zero-layer-axis.lg-left.lg-top strong"
    ).textContent;
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
      )[1].innerText;
    }
    let overview_title = temp1 + " " + temp2;
    let overview = document.querySelector(
      "#header-menu-desktop ~ div.node.section-zero.section div.zero-layer-axis.lg-left.lg-middle "
    ).textContent;
    let about = document.querySelector(
      "div#about.node.section-clear.section div.node.widget-grid.widget.xs-hidden div.col div.node.widget-text.cr-text.widget.xs-hidden.links-on-black-text p.textable"
    ).textContent;
    let proprty_info = [];
    temp = document.querySelectorAll(
      "div#about.node.section-clear.section div.node.widget-grid.widget.xs-hidden div.grid.valign-middle.paddings-40px.xs-wrap div.gridwrap div.col div.cont div.node.widget-element.widget div.cont div.node.widget-text.cr-text.widget p.textable"
    );
    temp.forEach((e) => {
      proprty_info.push(e.textContent);
    });
    let location = document.querySelector(
      "div#location.node.section-clear.section div.container.fullwidth div.cont div.node.widget-grid.widget div.grid.valign-top.paddings-40px.xs-wrap div.gridwrap div.col div.cont div.node.widget-text.cr-text.widget.links-on-black-text p.textable"
    ).textContent;
    let nearby_place = [];
    temp = Array.from(
      document.querySelectorAll(
        "div#location.node.section-clear.section div.node.widget-grid.widget.xs-hidden div.grid.valign-middle.paddings-40px.xs-wrap div.gridwrap div.col div.cont div.node.widget-element.widget div.cont"
      )
    );
    temp.forEach((e) => nearby_place.push(e.textContent));

    let payment_plan = [];
    temp = document.querySelectorAll(
      "div#pp.node.section-clear.section div.container div.cont div.node.widget-grid.widget div.grid.valign-middle.paddings-40px.xs-wrap div.gridwrap div.col div.cont div.node.widget-element.widget div.cont"
    );
    temp.forEach((e) => payment_plan.push(e.textContent));

    let images = Array.from(
      document.querySelectorAll(
        ".node.section-clear.section div.container.fullwidth div.cont div.node.widget-tabs.cr-tabs.widget div.metahtml div.tabs1-root div.swiper-wrapper div.swiper-slide .cont-wrapper .gallery1-image.fancybox "
      )
    );
    let all_images = [];
    images.forEach((e) => {
      all_images.push(e.href);
    });
    all_images = [...new Set(all_images)];

    return {
      // all: all,
      // images_sup: images_sup,
      // al: al,
      // le: al.length,
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
      all_images: all_images,
      signaturea: Date.now(),
    };
  });
  console.log(links);
  const floor = await page.evaluate(() => {
    // .node.section-clear.section div.container.fullwidth div.cont div.node.widget-tabs.cr-tabs.widget div.metahtml div.tabs1-container.swiper-container.swiper-container-horizontal.swiper-container-autoheight div.tabs1-root div.swiper-wrapper div.swiper-slide
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
      console.log(f);
      await page.waitForTimeout("700");
      await page.waitForSelector("#fp .swiper-slide.swiper-slide-active");
      floor_plans.push(
        await page.evaluate(() => {
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
              size.push(e.textContent);
            });
          } catch (error) {}

          try {
            img = temp.querySelector(" a .fr-dib.fr-draggable").src;
          } catch (error) {}
          try {
            title = temp.querySelector("h3").textContent;
          } catch (error) {}

          return {
            title: title,
            size: size,
            img: img,
          };
        })
      );
    }
  }
  console.log(floor_plans);

  // //############### brochure #####################
  const exists = await page.evaluate(() => {
    return (
      document.querySelector(
        "#header-menu-mobile ~ div.node.section-clear.section.lg-hidden div.node.widget-button.widget div.button-container.center div.button-wrapper a"
      ) !== null
    );
  });
  if (exists) {
    await page.click(
      "#header-menu-mobile ~ div.node.section-clear.section.lg-hidden div.node.widget-button.widget div.button-container.center div.button-wrapper a"
    );
    await page.waitForSelector(".modal6-root.is-active");
    await page.type(
      "div.modal6-root div.modal6-panel2 div.cont div.node.widget-form2.cr-form.widget div div.metahtml div.form1-cover div div.cont div.node.widget-field.cr-field.widget div.metahtml div.is-text div.input input[autocomplete='name']",
      "John"
    );
    await page.type(
      ".modal.nocolors.active .form-control[autocomplete='tel']",
      "09509465823"
    );
    await page.type(
      ".modal.nocolors.active .form-control[autocomplete='email']",
      "jhon@jmail.com"
    );

    await page.evaluate(() => {
      document
        .querySelector(".modal.nocolors.active button:not(.modal6-close)")
        .click();
    });
    await page.waitForTimeout("700");
    await page.waitForNavigation();
    let brochure = await page.evaluate(() => document.location.href);
    console.log("yes");
    // data.push({brochure:url})
    console.log(brochure);
  } else {
    console.log("yyyy");
  }

  // floor###########

  // const exists_plan_btn = await page.evaluate(() => {
  //   return (
  //     document.querySelector(
  //       "#fp .node.widget-element.widget .cont .node.widget-button.widget.lg-hidden .button-container.left.xs-full .button-wrapper a"
  //     ) !== null
  //   );
  // });
  // if (exists_plan_btn) {
  //   await page.click(
  //     "#fp .node.widget-element.widget .cont .node.widget-button.widget.lg-hidden .button-container.left.xs-full .button-wrapper a"
  //   );
  //   await page.waitForSelector(".modal6-root.is-active");
  //   await page.type(
  //     '.modal6-root.is-active div.input input[autocomplete="name"]',
  //     "John"
  //   );
  //   await page.type(
  //     '.modal6-root.is-active div.input input[autocomplete="tel"]',
  //     "+968509465823"
  //   );
  //   await page.type(
  //     '.modal6-root.is-active div.input input[autocomplete="email"]',
  //     "jhon@jmail.com"
  //   );
  //   await page.evaluate(() => {
  //     document
  //       .querySelector(".modal6-root.is-active button:not(.modal6-close)")
  //       .click();
  //   });
  //   await page.waitForNavigation();
  //   let floor_plans_pdf = await page.evaluate(() => document.location.href);
  //   // data[0].floor_plans_pdf = floor_plans_pdf;
  //   console.log("f  ", floor_plans_pdf);
  //   console.log("yes");

  //   // data.push({ brochure: url });
  // } else {
  //   console.log("yyyy");
  // }

  await browser.close();
}
run();
// let array = Array.from(
//   document.querySelectorAll(
//     "#fp .node.widget-element.widget .cont .node.widget-button.widget.lg-hidden .button-container.left.xs-full .button-wrapper a"
//   )
// );
// array.forEach((e) => {
//   if (/floor/i.test(e.querySelector("span").textContent)) {
//     n = e;
//     return true;
//   }
// });
// return false;
