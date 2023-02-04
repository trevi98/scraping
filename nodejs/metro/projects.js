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

async function clean(text){
  try{

    return text.replace('\n','').replace('\r','').replace('\t','').replace('  ','');
  }catch(error){
    return text;
  }
}

async function visit_each(link,page){
  await page.setCacheEnabled(false);
  await page.goto(link);
  await page.deleteCookie({name:'hkd'})









  
  const exists = await page.evaluate(() => {
    return document.querySelector('.project-header__btn.brochure') !== null;
  });
  if(exists){
    console.log("xxxx")
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
    let url = await page.evaluate(() => document.location.href);
    console.log(url)
  }
  else{
    console.log("yyyy")
  }
  // await page.click('._35b183c9._39b0d6c4');
  // const element = await page.waitForSelector('._18c28cd2._277fb980');
  let data = []
  data.push(await page.evaluate(async ()=>{
    function extract_pare(elmnts,key){
      let pare = []
      pare = elmnts.filter((elmnt)=>{
        try{
          
          if(elmnt.includes(key)){
            return true
          }
        }catch(error){
        }
      })
      try{

        pare = pare[0].replace(key,'').replace(" ","").replace("\n","").replace("\t","").replace("\r","").replace("  ","")
        return pare
      }
      catch(error){
        return ""
      }
    }
    let title = 'dd'
   
  return({
      title: title,
    })

  }))

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
        csvErrr.writeRecords({link:link,error:err})
        .then(()=> console.log('error logged main loop'));
        continue
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
        csvErrr.writeRecords({link:i,error:error})
        .then(()=> console.log('error logged main'));
        continue
      }
    }

  }
  await browser.close();
        
}

main()
