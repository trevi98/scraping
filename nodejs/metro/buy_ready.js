const puppeteer = require('puppeteer');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');

function csv_handler (directory,batch){
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
}
return createCsvWriter({
  path: `${directory}/metro_developers${batch}.csv`,
  header: [
    {id: 'title', title: 'title'},
    {id: 'price_from', title: 'price_from'},
    {id: 'projects', title: 'projects'},
    {id: 'founded_in', title: 'founded_in'},
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

let csvErrr = csv_error_handler('developers')
let csvWriter = csv_handler('developers',1)
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




    let title = clean(document.querySelector(".developer-header__title").textContent)
    let temp = Array.from(document.querySelectorAll('.developer-header__details-item'))
    let price_from = extract_one_text_from_pare_elements_in_one_container__pass_array_of_main_containers(temp,'Price','.developer-header__details-item-value')
    let founded_in = extract_one_text_from_pare_elements_in_one_container__pass_array_of_main_containers(temp,'Founded','.developer-header__details-item-value')
    let projects = extract_one_text_from_pare_elements_in_one_container__pass_array_of_main_containers(temp,'Projects','.developer-header__details-item-value')
    let content = extract_text_from_section_key_value_auto_all__pass_elmnts_with_key_selector(Array.from(document.querySelectorAll('.contentSection.featureProjects')),'.projectHeading ')
    let images = Array.from(document.querySelectorAll('.gallerySlider__item img'),img => img.getAttribute('data-src'))





  return({
      title: title,
      price_from:price_from,
      founded_in:founded_in,
      projects:projects,
      content:content,
      images:images,

    })

  }))










  if((j%500) == 0){
    batch++
    csvWriter = csv_handler('developers',batch)
  }
  
  csvWriter
  .writeRecords(data)
  .then(()=> console.log('The CSV file was written successfully'));
  j++;
  
}



async function main_loop(page,i){
  
    const apiUrl = 'https://metropolitan.realestate/ajax-listing.php';
    const requestBody = `action=listing&type=buy&page=${i}&status=0&ln=en`
  
    const response = await page.evaluate(async (apiUrl, requestBody) => {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });
      return await response.json();
    }, apiUrl, requestBody);
  
    console.log(response);

}



async function main(){

  const browser = await puppeteer.launch({headless: false,executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',args: ['--enable-automation']});
  const page = await browser.newPage();
  // let plans_data = {};
  for(let i=1 ; i<=57 ; i++){
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
