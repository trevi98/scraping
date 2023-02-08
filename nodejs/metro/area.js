const puppeteer = require('puppeteer');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');

function csv_handler (directory,batch){
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
}
return createCsvWriter({
  path: `${directory}/metro_areas${batch}.csv`,
  header: [
    {id: 'title', title: 'title'},
    {id: 'content', title: 'content'},
    {id: 'images', title: 'images'},
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

let csvErrr = csv_error_handler('areas')
let csvWriter = csv_handler('areas',1)
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


      function extract_text_from_section_key_value_auto_all__pass_elmnts_with_key_selector(elmnts,key_selector){
        let results = []
        let title = ""
        let content = ""
        elmnts.forEach(elmnt => {
            try{
                title = clean(elmnt.querySelector(key_selector).textContent)
                content = clean(elmnt.innerText.replace(title,''))
                results.push({title:title,content:content})
            }
            catch(error){
                console.error(error)
            }
        });
        return JSON.stringify(results)
      }


    function clean(text){
        try{
      
          return text.replaceAll('\n','').replaceAll('\r','').replaceAll('\t','').replaceAll('  ','').trim();
        }catch(error){
          return text;
        }
      }




    let title = clean(document.querySelector(".area-header__title").textContent)
    let content = extract_text_from_section_key_value_auto_all__pass_elmnts_with_key_selector(Array.from(document.querySelectorAll('.contentSection.featureProjects')),'.projectHeading ')
    let images = Array.from(document.querySelectorAll('.gallerySlider-wrap .gallerySlider__item img'),img => img.getAttribute('data-src'))





  return({
      title: title,
      content:content,
      images:images,

    })

  }))










  if((j%500) == 0){
    batch++
    csvWriter = csv_handler('areas',batch)
  }
  
  csvWriter
  .writeRecords(data)
  .then(()=> console.log('The CSV file was written successfully'));
  j++;
  
}



async function main_loop(page,i){
  

  let target = `https://metropolitan.realestate/projects/page/${i}`;
  if(i == 1){
    target = 'https://metropolitan.realestate/areas/'
  }
  console.log(target)
  await page.goto(target);
  const links = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('.col-md-6.col-lg-4.areas-list__item.area-item .area-item__image-wrap .area-item__link'),a=>a.href);
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
  for(let i=1 ; i<=1 ; i++){
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