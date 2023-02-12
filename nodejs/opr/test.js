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
    "https://opr.ae/projects/emaar-mina-rashid-yacht-marina-seascape-apartments-in-dubai"
  );
  const links = await page.evaluate(() => {
    let price_payment = [];
    let a = document.querySelectorAll(
      "#header-menu-desktop ~ div.node.section-zero.section div.zero-layer-axis.lg-left.lg-bottom strong"
    );
    a.forEach((e) => price_payment.push(e.textContent));
    let handover = Array.from(
      document.querySelectorAll(
        "#header-menu-desktop ~ div.node.section-zero.section div.zero-layer-axis.lg-center.lg-bottom strong"
      )
    )[0].innerText;
    let overview = document.querySelector(
      "#header-menu-desktop ~ div.node.section-zero.section div.zero-layer-axis.lg-left.lg-middle p"
    ).textContent;
    let temp = document.querySelector(
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
    let title = temp + " " + temp2;
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
    payment_plan = [];
    temp = document.querySelectorAll(
      "div#pp.node.section-clear.section div.container div.cont div.node.widget-grid.widget div.grid.valign-middle.paddings-40px.xs-wrap div.gridwrap div.col div.cont div.node.widget-element.widget div.cont"
    );
    temp.forEach((e) => payment_plan.push(e.textContent));
    aaa = [];
    floor_plans = Array.from(
      document.querySelectorAll(
        "div#fb.node.section-clear.section div.container.fullwidth div.cont div.node.widget-tabs.cr-tabs.widget div.metahtml div.tabs1-container.swiper-container.swiper-container-horizontal.swiper-container-autoheight div.tabs1-root div.swiper-wrapper div.swiper-slide"
      )
    );
    floor_plans.forEach((e) => aaa.push(e.textContent));
    let images = Array.from(
      document.querySelectorAll("div.gallery1-pagination.border.bottom")
    );
    let all_images = [];
    images.forEach((e) => {
      let all = Array.from(e.querySelectorAll("div.gallery1-page"));
      all.forEach((s) => {
        let img = s.querySelector("div.gallery1-page-image div");
        let style = window.getComputedStyle(img);
        bi = style.backgroundImage.slice(5, -2);
        all_images.push(bi);
      });
    });

    return {
      title: title,
      overview: overview,
      price_payment: price_payment,
      handover: handover,
      about: about,
      proprty_info: proprty_info,
      location: location,
      nearby_place: nearby_place,
      payment_plan: payment_plan,
      floor_plans: floor_plans,
      images: all_images,
    };
  });
  console.log(links);
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
    await page.waitForSelector(".modal.nocolors.css156.active");
    await page.type(
      "div.modal6-root div.modal6-panel2 div.cont div.node.widget-form2.cr-form.widget div div.metahtml div.form1-cover div div.cont div.node.widget-field.cr-field.widget div.metahtml div.is-text div.input input[autocomplete='name']",
      "John"
    );
    await page.type(
      ".modal.nocolors.css156.active .form-control[autocomplete='tel']",
      "+968509465823"
    );
    await page.type(
      ".modal.nocolors.css156.active .form-control[autocomplete='email']",
      "jhon@jmail.com"
    );

    await page.evaluate(() => {
      document
        .querySelector(
          ".modal.nocolors.css156.active div.form1-cover div div.cont div.node.widget-button.widget div.button-wrapper button"
        )
        .click();
    });
    await page.waitForNavigation();
    let brochure = await page.evaluate(() => document.location.href);
    console.log("yes");
    // data.push({brochure:url})
    console.log(brochure);
  } else {
    console.log("yyyy");
  }
  await browser.close();
}
run();
