const puppeteer = require('puppeteer');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');

function csv_handler (directory,batch){
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
}
return createCsvWriter({
  path: `${directory}/metro_projects${batch}.csv`,
  header: [
    {id: 'title', title: 'title'},
    {id: 'price', title: 'price'},
    {id: 'area', title: 'area'},
    {id: 'size', title: 'size'},
    {id: 'available_units', title: 'available_units'},
    {id: 'units', title: 'units'},
    {id: 'hand_over', title: 'hand_over'},
    {id: 'description', title: 'description'},
    {id: 'status', title: 'status'},
    {id: 'developer', title: 'developer'},
    {id: 'type', title: 'type'},
    {id: 'amenities', title: 'amenities'},
    {id: 'brochure', title: 'brochure'},
    {id: 'floor_plans_pdf', title: 'floor_plans_pdf'},
    {id: 'floor_plans', title: 'floor_plans'},
    {id: 'payment_plan', title: 'payment_plan'},
    {id: 'location', title: 'location'},
    {id: 'property_price', title: 'property_price'},
    {id: 'economic_apeal', title: 'economic_apeal'},
    {id: 'images', title: 'images'},
    {id: 'faq', title: 'faq'},
    {id: 'signaturea', title: 'signaturea'},

  ]
});


}

function csv_error_handler (directory){
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
}
return createCsvWriter({
  path: `${directory}/error_links.csv`,
  header: [
    {id: 'link', title: 'link'},
    {id: 'error', title: 'error'},
  ]
});
}

let csvErrr = csv_error_handler('projects')
let csvWriter = csv_handler('projects',1)
let batch = 0
let j = 0
let main_err_record = 0
let visit_err_record = 0

// async function clean(text){
//   try{

//     return text.replace('\n','').replace('\r','').replace('\t','').replace('  ','');
//   }catch(error){
//     return text;
//   }
// }

async function visit_each(link,page){
  // await page.setCacheEnabled(false);
  await page.goto(link);
  // await page.waitForNavigation();
  await page.deleteCookie({name:'hkd'})








  

  // await page.click('._35b183c9._39b0d6c4');
  // const element = await page.waitForSelector('._18c28cd2._277fb980');
  let data = []
  data.push(await page.evaluate(async ()=>{

    function extract_one_text_from_pare_elements_in_one_container__pass_array_of_main_containers(elmnts,key,value_selector){
      let results = []
      let result = ''
      try{

        results = elmnts.filter(elmnt => {
          if(elmnt.textContent.includes(key))
            return true
        })
        result = results[0].querySelector(value_selector).textContent
      }
      catch(error){
        console.error(error)
      }
      return result
    }

    function clean(text){
      try{
    
        return text.replaceAll('\n','').replaceAll('\r','').replaceAll('\t','').replaceAll('  ','').trim();
      }catch(error){
        return text;
      }
    }

    function create_pares_from_pare_elements_in_one_container_if_thing_exists__pass_array_of_pares_containers(elmnts,search_key,key_selector,value_selector){
      let results = elmnts.filter(elmnt => {
        if(elmnt.textContent.includes(search_key))
          return true
      })
      let result = []
      results.forEach(e => {
        let key = e.querySelector(key_selector).textContent
        let value = e.querySelector(value_selector).textContent
        result.push({key,value})
      })
      return JSON.stringify(result)
    }


    function extract_text_from_pare_elements__section__(elmnts,search_key,value_selector){
      results = ""
      elmnts.forEach(t => {
        try{
  
          if(t.querySelector(".container .projectHeading").textContent.includes(search_key)){
            results = clean(t.querySelector(value_selector).innerText)
          }
        }
        catch(error){
  
          console.error(error)
        }
  
      })
      return results
    }


    // function get_text_from_section_if



    let title = clean(document.querySelector(".projectHeading  h2").textContent.replace("About",""))

    let price = extract_one_text_from_pare_elements_in_one_container__pass_array_of_main_containers(Array.from(document.querySelectorAll(".container .row.advRow.as_grid .as_grid-item")),'Starting Price from','span.as_grid-params')
    let size = extract_one_text_from_pare_elements_in_one_container__pass_array_of_main_containers(Array.from(document.querySelectorAll(".container .row.advRow.as_grid .as_grid-item")),'Area from (sq. ft.)','span.as_grid-params')
    let available_units = extract_one_text_from_pare_elements_in_one_container__pass_array_of_main_containers(Array.from(document.querySelectorAll(".container .row.advRow.as_grid .as_grid-item")),'Available Units','span.as_grid-params')
    let handover = extract_one_text_from_pare_elements_in_one_container__pass_array_of_main_containers(Array.from(document.querySelectorAll(".container .row.advRow.as_grid .as_grid-item")),'Handover','span.as_grid-params')
    let area = extract_one_text_from_pare_elements_in_one_container__pass_array_of_main_containers(Array.from(document.querySelectorAll(".container .as_lits li")),'Location','span.as_lits-params')
    let status = extract_one_text_from_pare_elements_in_one_container__pass_array_of_main_containers(Array.from(document.querySelectorAll(".container .as_lits li")),'Status','span.as_lits-params')
    let developer = extract_one_text_from_pare_elements_in_one_container__pass_array_of_main_containers(Array.from(document.querySelectorAll(".container .as_lits li")),'Developer','span.as_lits-params')
    let type = extract_one_text_from_pare_elements_in_one_container__pass_array_of_main_containers(Array.from(document.querySelectorAll(".container .as_lits li")),'Type','span.as_lits-params')
    let units = extract_one_text_from_pare_elements_in_one_container__pass_array_of_main_containers(Array.from(document.querySelectorAll(".container .as_lits li")),'Units','span.as_lits-params')
    let entire_description = ""
    try{
      entire_description = clean(Array.from(document.querySelectorAll(".contentSection.featureProjects"))[1].innerText)

    }
    catch(error){
      entire_description = ""
    }
    let amenities = []

    amenities = Array.from(document.querySelectorAll(".container .two-col-text .two-col-text-item.text-text ul li"),li => li.textContent)
    if(amenities.length == 0){

      amenities = Array.from(document.querySelectorAll(".container .two-col-text ul li"),li => li.textContent)
    }
    if(amenities.length == 0){
      amenities = Array.from(document.querySelectorAll(".container .two-col-text .two-col-text-item.grid-text ul li"),li => li.textContent)
    }
    if(amenities.length == 0){
      amenities = Array.from(document.querySelectorAll(".container .two-col-text .two-col-text-item.video-text ul li"),li => li.textContent)
    }
    let floor_plans = []
    let temp = Array.from(document.querySelectorAll(".container.fp .fp__slider.fp-slider .fpSlider .owl-item:not(.cloned)"))
    temp.forEach(t => {
      let items_container = t.querySelector(".fpSlider__col.fpSlider__col--desc")
      let title = clean(items_container.querySelector(".fpSlider__desc-head").textContent)
      let pares = Array.from(items_container.querySelectorAll('.fpSlider__desc-item'))
      let type = extract_one_text_from_pare_elements_in_one_container__pass_array_of_main_containers(pares,'Type','span')
      let total_area = extract_one_text_from_pare_elements_in_one_container__pass_array_of_main_containers(pares,'Total Area','span')
      let starting_price = extract_one_text_from_pare_elements_in_one_container__pass_array_of_main_containers(pares,'Starting Price','span')
      let image = t.querySelector('.fpSlider__col.fpSlider__col--image img').getAttribute('data-src')
      // console.log("!!!!")
      // console.log(image)

      floor_plans.push(JSON.stringify({title,type,total_area,starting_price,image}))

    })

    let images = Array.from(document.querySelectorAll(".gallerySlider__item img"),img=>img.getAttribute('data-src'))
    temp = Array.from(document.querySelectorAll('.container .row.advRow.as_grid .as_grid-cell.col-1'))
    payment_plan = create_pares_from_pare_elements_in_one_container_if_thing_exists__pass_array_of_pares_containers(temp,'%','.as_grid-title','.as_grid-params')
    temp = Array.from(document.querySelectorAll(".contentSection.featureProjects"))
    x = extract_text_from_pare_elements__section__(temp,'Location','.container .two-col-text')
    economic_apeal = extract_text_from_pare_elements__section__(temp,'Economic Appeal','.container .textBlock.pd30.full')
    property_price = extract_text_from_pare_elements__section__(temp,'Property Prices','.container .textBlock.pd30.full')
    let faq = []
    temp = Array.from(document.querySelectorAll('.Faq .Faq_item'))
    temp.forEach(t => {
      let q = clean(t.querySelector('.Faq_title').innerText)
      let a = clean(t.querySelector('.Faq_answer').innerText)
      faq.push({question:q,answer:a})
    })






  return({
      title: title,
      price: price,
      size: size,
      hand_over: handover,
      available_units: available_units,
      available_units: available_units,
      description: entire_description,
      amenities: amenities,
      area:area,
      status: status,
      developer: developer,
      type: type,
      units: units,
      floor_plans:floor_plans,
      images:images,
      payment_plan:payment_plan,
      location:x,
      economic_apeal:economic_apeal,
      property_price:property_price,
      faq:JSON.stringify(faq),
      signaturea : Date.now(),
      // price: price,
    })

  }))






//  ----------- pdf floor plan --------------
const exists_plan_btn = await page.evaluate(() => {
  return document.querySelector('.container.fp .fp__slider.fp-slider .fpSlider .owl-item:not(.cloned) .fpSlider__desc-btn.fpSlider__desc-btn--PDF') !== null;
});
if(exists_plan_btn){
  await page.click('.container.fp .fp__slider.fp-slider .fpSlider .owl-item:not(.cloned) .fpSlider__desc-btn.fpSlider__desc-btn--PDF')
  await page.type('#wpcf7-f84322-o4 input[name="user-name"]', 'John');
  await page.type('#wpcf7-f84322-o4 input[name="user-phone"]', '+968509465823');
  await page.type('#wpcf7-f84322-o4 input[name="user-email"]', 'jhon@jmail.com');
  // await page.evaluate(() => {
  //   document.querySelector('input[name="acceptance-350"]').click();
  // });
  await page.evaluate(() => {
    document.querySelector('#wpcf7-f84322-o4 button[type=submit]').click();
  });
  await page.waitForNavigation()
  let floor_plans_pdf = await page.evaluate(() => document.location.href)
  data[0].floor_plans_pdf = floor_plans_pdf
  await page.goBack();

  // data.push({brochure:url})
  // console.log(url)
}
else{
  console.log("yyyy")
}








  //  ----------- brochur --------------
  await page.deleteCookie({name:'hkd'})
  const exists = await page.evaluate(() => {
    return document.querySelector('.project-header__btn.brochure') !== null;
  });
  if(exists){
    await page.click('.project-header__btn.brochure')
    await page.type('#download input[name="user-name"]', 'John');
    await page.type('#download input[name="user-phone"]', '+968509465823');
    await page.type('#download input[name="user-email"]', 'jhon@jmail.com');
    // await page.evaluate(() => {
    //   document.querySelector('input[name="acceptance-350"]').click();
    // });
    await page.evaluate(() => {
      document.querySelector('#download button[type=submit]').click();
    });
    await page.waitForNavigation()
    let brochure = await page.evaluate(() => document.location.href)
    data[0].brochure = brochure
    // data.push({brochure:url})
    // console.log(url)
  }
  else{
    console.log("yyyy")
  }




  if((j%500) == 0){
    batch++
    csvWriter = csv_handler('projects',batch)
  }
  
  csvWriter
  .writeRecords(data)
  .then(()=> console.log('The CSV file was written successfully'));
  j++;
  
}



async function main_loop(page,i){
  

  let target = `https://metropolitan.realestate/projects/page/${i}`;
  if(i == 1){
    target = 'https://metropolitan.realestate/projects/'
  }
  console.log(target)
  await page.goto(target);
  const links = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('#projects-row .project__image-wrap .project__link'),a=>a.href);
    let uniqe_links = [...new Set(anchors)];
    return (uniqe_links)
  });


  for (const link of links) {
    try{

      await visit_each(link,page)
    }catch(error){
      try{
        await visit_each(link,page)
      }catch(err){
        try{
          await visit_each(link,page)

        }
        catch(error){
          console.error(error)
          csvErrr.writeRecords({link:link,error:err})
          .then(()=> console.log('error logged main loop'));
          continue
        }
      }
    }
  }

}



async function main(){

  const browser = await puppeteer.launch({headless: false,executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',args: ['--enable-automation']});
  const page = await browser.newPage();
  // let plans_data = {};
  for(let i=1 ; i<=180 ; i++){
    try{
      await main_loop(page,i)
    }catch(error){
      try{
        await main_loop(page,i)
      }catch(error){
        console.error(error)
        csvErrr.writeRecords({link:i,error:error})
        .then(()=> console.log('error logged main'));
        continue
      }
    }

  }
  await browser.close();
        
}

main()
