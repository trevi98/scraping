const puppeteer = require("puppeteer");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

function csv_handler(directory, batch) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return createCsvWriter({
    path: `${directory}/metro_projects${batch}.csv`,
    header: [
      { id: "title", title: "title" },
      { id: "type", title: "type" },
      { id: "price", title: "price" },
      { id: "area", title: "area" },
      { id: "size", title: "size" },
      { id: "available_units", title: "available_units" },
      { id: "units", title: "units" },
      { id: "hand_over", title: "hand_over" },
      { id: "description", title: "description" },
      { id: "status", title: "status" },
      { id: "developer", title: "developer" },
      { id: "amenities", title: "amenities" },
      { id: "brochure", title: "brochure" },
      { id: "floor_plans_pdf", title: "floor_plans_pdf" },
      { id: "floor_plans", title: "floor_plans" },
      { id: "payment_plan", title: "payment_plan" },
      { id: "location", title: "location" },
      { id: "property_price", title: "property_price" },
      { id: "economic_apeal", title: "economic_apeal" },
      { id: "images", title: "images" },
      { id: "faq", title: "faq" },
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

let csvErrr = csv_error_handler("projects");
let csvWriter = csv_handler("projects", 1);
let batch = 0;
let j = 0;
let main_err_record = 0;
let visit_err_record = 0;

// async function clean(text){
//   try{

//     return text.replace('\n','').replace('\r','').replace('\t','').replace('  ','');
//   }catch(error){
//     return text;
//   }
// }

async function visit_each(link, page) {
  console.log(link.types);
  // await page.setCacheEnabled(false)
  await page.goto(link.link);
  // await page.waitForNavigation();
  //   await page.deleteCookie({name:'hkd'})

  // await page.click('._35b183c9._39b0d6c4');
  // const element = await page.waitForSelector('._18c28cd2._277fb980');
  let data = [];
  data.push(
    await page.evaluate(async () => {
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

      let title = clean(document.querySelector("title").textContent);
      price_payment = [];
      let temp = document.querySelectorAll(
        "#header-menu-desktop ~ div.node.section-zero.section div.zero-layer-axis.lg-left.lg-bottom strong"
      );
      temp.forEach((e) => price_payment.push(e.textContent));
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
      let overview = clean(
        document.querySelector(
          "#header-menu-desktop ~ div.node.section-zero.section div.zero-layer-axis.lg-left.lg-middle p"
        ).textContent
      );
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
      temp.forEach((e) => place.push(e.textContent));
      payment_plan = [];
      temp = document.querySelectorAll(
        "div#pp.node.section-clear.section div.container div.cont div.node.widget-grid.widget div.grid.valign-middle.paddings-40px.xs-wrap div.gridwrap div.col div.cont div.node.widget-element.widget div.cont"
      );
      temp.forEach((e) => payment_plan.push(e.textContent));
      // let price = extract_one_text_from_pare_elements_in_one_container__pass_array_of_main_containers(Array.from(document.querySelectorAll(".container .row.advRow.as_grid .as_grid-item")),'Starting Price from','span.as_grid-params')
      // let size = extract_one_text_from_pare_elements_in_one_container__pass_array_of_main_containers(Array.from(document.querySelectorAll(".container .row.advRow.as_grid .as_grid-item")),'Area from (sq. ft.)','span.as_grid-params')
      // let available_units = extract_one_text_from_pare_elements_in_one_container__pass_array_of_main_containers(Array.from(document.querySelectorAll(".container .row.advRow.as_grid .as_grid-item")),'Available Units','span.as_grid-params')
      // let handover = extract_one_text_from_pare_elements_in_one_container__pass_array_of_main_containers(Array.from(document.querySelectorAll(".container .row.advRow.as_grid .as_grid-item")),'Handover','span.as_grid-params')
      // let area = extract_one_text_from_pare_elements_in_one_container__pass_array_of_main_containers(Array.from(document.querySelectorAll(".container .as_lits li")),'Location','span.as_lits-params')
      // let status = extract_one_text_from_pare_elements_in_one_container__pass_array_of_main_containers(Array.from(document.querySelectorAll(".container .as_lits li")),'Status','span.as_lits-params')
      // let developer = extract_one_text_from_pare_elements_in_one_container__pass_array_of_main_containers(Array.from(document.querySelectorAll(".container .as_lits li")),'Developer','span.as_lits-params')
      // let type = extract_one_text_from_pare_elements_in_one_container__pass_array_of_main_containers(Array.from(document.querySelectorAll(".container .as_lits li")),'Type','span.as_lits-params')
      // let units = extract_one_text_from_pare_elements_in_one_container__pass_array_of_main_containers(Array.from(document.querySelectorAll(".container .as_lits li")),'Units','span.as_lits-params')
      // let entire_description = ""
      // try{
      //   entire_description = clean(Array.from(document.querySelectorAll(".contentSection.featureProjects"))[1].innerText)

      // }
      // catch(error){
      //   entire_description = ""
      // }
      // let amenities = []

      // amenities = Array.from(document.querySelectorAll(".container .two-col-text .two-col-text-item.text-text ul li"),li => li.textContent)
      // if(amenities.length == 0){

      //   amenities = Array.from(document.querySelectorAll(".container .two-col-text ul li"),li => li.textContent)
      // }
      // if(amenities.length == 0){
      //   amenities = Array.from(document.querySelectorAll(".container .two-col-text .two-col-text-item.grid-text ul li"),li => li.textContent)
      // }
      // if(amenities.length == 0){
      //   amenities = Array.from(document.querySelectorAll(".container .two-col-text .two-col-text-item.video-text ul li"),li => li.textContent)
      // }
      // let floor_plans = []
      // let temp = Array.from(document.querySelectorAll(".container.fp .fp__slider.fp-slider .fpSlider .owl-item:not(.cloned)"))
      // temp.forEach(t => {
      //   let items_container = t.querySelector(".fpSlider__col.fpSlider__col--desc")
      //   let title = clean(items_container.querySelector(".fpSlider__desc-head").textContent)
      //   let pares = Array.from(items_container.querySelectorAll('.fpSlider__desc-item'))
      //   let type = extract_one_text_from_pare_elements_in_one_container__pass_array_of_main_containers(pares,'Type','span')
      //   let total_area = extract_one_text_from_pare_elements_in_one_container__pass_array_of_main_containers(pares,'Total Area','span')
      //   let starting_price = extract_one_text_from_pare_elements_in_one_container__pass_array_of_main_containers(pares,'Starting Price','span')
      //   let image = t.querySelector('.fpSlider__col.fpSlider__col--image img').getAttribute('data-src')
      //   // console.log("!!!!")
      //   // console.log(image)

      //   floor_plans.push(JSON.stringify({title,type,total_area,starting_price,image}))

      // })

      // let images = Array.from(document.querySelectorAll(".gallerySlider__item img"),img=>img.getAttribute('data-src'))
      // temp = Array.from(document.querySelectorAll('.container .row.advRow.as_grid .as_grid-cell.col-1'))
      // payment_plan = create_pares_from_pare_elements_in_one_container_if_thing_exists__pass_array_of_pares_containers(temp,'%','.as_grid-title','.as_grid-params')
      // temp = Array.from(document.querySelectorAll(".contentSection.featureProjects"))
      // x = extract_text_from_pare_elements__section__(temp,'Location','.container .two-col-text')
      // economic_apeal = extract_text_from_pare_elements__section__(temp,'Economic Appeal','.container .textBlock.pd30.full')
      // property_price = extract_text_from_pare_elements__section__(temp,'Property Prices','.container .textBlock.pd30.full')
      // let faq = []
      // temp = Array.from(document.querySelectorAll('.Faq .Faq_item'))
      // temp.forEach(t => {
      //   let q = clean(t.querySelector('.Faq_title').innerText)
      //   let a = clean(t.querySelector('.Faq_answer').innerText)
      //   faq.push({question:q,answer:a})
      // })

      return {
        title: title,

        //   price: price,
        //   size: size,
        //   hand_over: handover,
        //   available_units: available_units,
        //   available_units: available_units,
        //   description: entire_description,
        //   amenities: amenities,
        //   area:area,
        //   status: status,
        //   developer: developer,
        //   type: type,
        //   units: units,
        //   floor_plans:floor_plans,
        //   images:images,
        //   payment_plan:payment_plan,
        //   location:x,
        //   economic_apeal:economic_apeal,
        //   property_price:property_price,
        //   faq:JSON.stringify(faq)
        // price: price,
      };
    })
  );

  data[0].type = link.types;

  //  ----------- pdf floor plan --------------
  const exists_plan_btn = await page.evaluate(() => {
    return (
      document.querySelector(
        ".container.fp .fp__slider.fp-slider .fpSlider .owl-item:not(.cloned) .fpSlider__desc-btn.fpSlider__desc-btn--PDF"
      ) !== null
    );
  });
  if (exists_plan_btn) {
    await page.click(
      ".container.fp .fp__slider.fp-slider .fpSlider .owl-item:not(.cloned) .fpSlider__desc-btn.fpSlider__desc-btn--PDF"
    );
    await page.type('#wpcf7-f84322-o4 input[name="user-name"]', "John");
    await page.type(
      '#wpcf7-f84322-o4 input[name="user-phone"]',
      "+968509465823"
    );
    await page.type(
      '#wpcf7-f84322-o4 input[name="user-email"]',
      "jhon@jmail.com"
    );
    await page.evaluate(() => {
      document.querySelector("#wpcf7-f84322-o4 button[type=submit]").click();
    });
    await page.waitForNavigation();
    let floor_plans_pdf = await page.evaluate(() => document.location.href);
    data[0].floor_plans_pdf = floor_plans_pdf;
    await page.goBack();

    data.push({ brochure: url });
    console.log(url);
  } else {
    console.log("yyyy");
  }

  //  ----------- brochur --------------
  //   await page.deleteCookie({name:'hkd'})
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
    await page.waitForSelector(".modal.nocolors.active");
    await page.type(
      "div.modal6-root div.modal6-panel2 div.cont div.node.widget-form2.cr-form.widget div div.metahtml div.form1-cover div div.cont div.node.widget-field.cr-field.widget div.metahtml div.is-text div.input input[autocomplete='name']",
      "John"
    );
    await page.type(
      ".modal.nocolors.active .form-control[autocomplete='tel']",
      "+968509465823"
    );
    await page.type(
      ".modal.nocolors.active .form-control[autocomplete='email']",
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
    data[0].brochure = brochure;
    // data.push({brochure:url})
    // console.log(url)
  } else {
    console.log("yyyy");
  }

  if (j % 500 == 0) {
    batch++;
    csvWriter = csv_handler("projects", batch);
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
  j++;
}

async function main_loop(page, i) {
  let target = "https://opr.ae/projects/waterfront-properties-in-dubai";
  await page.goto(target);
  //   await page.waitForNavigation()

  for (let j = 1; j <= i; j++) {
    await page.waitForSelector("div.offPlanListing__loadMore a");
    await page.evaluate(() => {
      document.querySelector("div.offPlanListing__loadMore a").click();
    });
  }
  const links = await page.evaluate(() => {
    const items = Array.from(
      document.querySelectorAll(
        ".node.section-clear.section.css88 .code #OffPlanListing #addListing .offPlanListing  .offPlanListing__item"
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
  // let plans_data = {};
  try {
    await main_loop(page, 4);
  } catch (error) {
    try {
      await main_loop(page, 4);
    } catch (error) {
      console.error(error);
      // csvErrr.writeRecords({link:i,error:error})
      // .then(()=> console.log('error logged main'));
    }
  }

  await browser.close();
}

main();
