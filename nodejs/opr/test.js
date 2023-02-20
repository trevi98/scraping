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
    "https://opr.ae/projects/aire-dubai-residences-for-sale-in-al-wasl-by-alta-real-estate"
  );
  await page.waitForSelector(".bgimage.bg-cover");
  const links = await page.evaluate(() => {
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
      location = document.querySelector(
        "div#location.node.section-clear.section div.container.fullwidth div.cont div.node.widget-grid.widget div.grid.valign-top.paddings-40px.xs-wrap div.gridwrap div.col div.cont div.node.widget-text.cr-text.widget.links-on-black-text p.textable"
      ).textContent;
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

    let images = Array.from(
      document.querySelectorAll(".gallery1-image.fancybox ")
    );
    let Exteriors_images = [];
    images.forEach((e) => {
      Exteriors_images.push(e.href.split(",")[0]);
    });
    Exteriors_images = [...new Set(Exteriors_images)];

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
      Exteriors_images: Exteriors_images,
      // al: all_images.length,
      signaturea: Date.now(),
    };
  });
  console.log(links);

<<<<<<< HEAD
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

<<<<<<< HEAD
  //############### brochure #####################
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
    await page.type(
      " div.modal6-root div.modal6-panel2 div.cont div.node.widget-form2.cr-form.widget div div.metahtml div.form1-cover div div.cont div.node.widget-field.cr-field.widget div.metahtml div.is-text div.input input[autocomplete='name']",
      "John"
    );
    await page.type(
      "div.modal6-root div.modal6-panel2 div.cont div.node.widget-form2.cr-form.widget div div.metahtml div.form1-cover div div.cont div.node.widget-field.cr-field.widget div div.metahtml div.is-text div.input input[autocomplete='tel']",
      "+968509465823"
    );
    await page.type(
      "div.modal6-root div.modal6-panel2 div.cont div.node.widget-form2.cr-form.widget div div.metahtml div.form1-cover div div.cont div.node.widget-field.cr-field.widget div.metahtml div.is-text div.input input[autocomplete='email']",
      "jhon@jmail.com"
    );

    await page.evaluate(() => {
      document
        .querySelector(
          "div.form1-cover div div.cont div.node.widget-button.widget div.button-wrapper button"
        )
        .click();
    });
    await page.waitForNavigation();
    let brochure = await page.evaluate(() => document.location.href);
    console.log("yes");
    // data.push({brochure:url})
    console.log(brochure);
    await page.goto(
      "https://opr.ae/projects/emaar-mina-rashid-yacht-marina-seascape-apartments-in-dubai"
    );
  } else {
    console.log("yyyy");
  }
=======
  // //############### brochure #####################
  const exists = await page.evaluate(() => {
=======
  const exist = await page.evaluate(() => {
>>>>>>> 8c0891c5af81663d389b779a6bdbc8b9b3b89116
    return (
      document.querySelectorAll(".tabs1-pagination .tabs1-page ")[1] !== null
    );
  });
<<<<<<< HEAD
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

<<<<<<< HEAD
  //   await page.evaluate(() => {
  //     document
  //       .querySelector(".modal.nocolors.active button:not(.modal6-close)")
  //       .click();
  //   });
  //   await page.waitForNavigation();
  //   let brochure = await page.evaluate(() => document.location.href);
  //   console.log("yes");
  //   // data.push({brochure:url})
  //   console.log(brochure);
  // } else {
  //   console.log("yyyy");
  // }
>>>>>>> 74d7e7d4c3ded30ef80e08e3a7c730624931d883
=======
    await page.evaluate(() => {
      document
        .querySelector(".modal.nocolors.active button:not(.modal6-close)")
        .click();
=======
  if (exist) {
    await page.click(".tabs1-pagination> div:not(.is-active)");
    let Interiors_images = await page.evaluate(() => {
      let temp = Array.from(
        document.querySelectorAll(".gallery1-image.fancybox")
      );
      let imgs = [];
      temp.forEach((e) => {
        try {
          imgs.push(e.href.split(",")[0]);
        } catch (error) {}
      });
      return imgs;
    });
    links.Exteriors_images.forEach((e) => {
      Interiors_images = Interiors_images.filter((s) => {
        return s !== e;
      });
>>>>>>> 8c0891c5af81663d389b779a6bdbc8b9b3b89116
    });
  } else {
    console.log("no Interiors_images");
  }
>>>>>>> 66206c27aa1b3212ebe0efa26b08a4c22c2694f7

<<<<<<< HEAD
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

<<<<<<< HEAD
    // data.push({ brochure: url });
  } else {
    console.log("yyyy");
  }
=======
  //   // data.push({ brochure: url });
  // } else {
  //   console.log("yyyy");
  // }

>>>>>>> 74d7e7d4c3ded30ef80e08e3a7c730624931d883
=======
>>>>>>> 8c0891c5af81663d389b779a6bdbc8b9b3b89116
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
