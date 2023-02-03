const puppeteer = require('puppeteer');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');

function csv_handler (directory,batch){
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
}
return createCsvWriter({
  path: `${directory}/bayut_buy_offplan_${batch}.csv`,
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

let csvErrr = csv_error_handler('offplan')
let csvWriter = csv_handler('offplan',1)
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
  await page.goto(link);
  let btns = await page.evaluate(()=>{
    let elmnts = Array.from(document.querySelectorAll("span._4b6fd844"))
    let b = []
    elmnts.forEach((elmnt)=>{
        if(elmnt.textContent.includes('3D Image')){
            elmnt.id = 'd3fd'
            b.push('d3fd')
            
        }
        else if(elmnt.textContent.includes('2D Image')){
            elmnt.id = 'd2fd'
            b.push('d2fd')
            
        }
    })
    return b
})

let plans = {
    d3 : [],
    d2 : []
}

if(btns.length>0){

    for (let btn of btns){
        await page.click(`#${btn}`)
        const element = await page.waitForSelector('._50f15c14 img');
        if(btn == 'd3fd'){

            plans.d3.push(await page.evaluate(() => {
                return Array.from(document.querySelectorAll("._50f15c14 img"),img => img.src.replace('\n','').replace('\r','').replace('\t','').replace('  ',''))
            }))
        }
        else{

            plans.d2.push(await page.evaluate(() => {
                return Array.from(document.querySelectorAll("._50f15c14 img"),img => img.src.replace('\n','').replace('\r','').replace('\t','').replace('  ',''))
            }))
        }


    }
}
    if(plans.d3.length > 0){

        data_plans_3d.push({plans_3d:plans.d3[0]})

    }
    if(plans.d2.length > 0){

        data_plans_2d.push({plans_2d:plans.d2[0]})

    }

  await page.click('._35b183c9._39b0d6c4');
  const element = await page.waitForSelector('._18c28cd2._277fb980');
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
    const images = document.querySelectorAll('._18c28cd2._277fb980 img');
    let imgs = Array.from(images, img => img.src.replace('\n','').replace('\r','').replace('\t','').replace('  ',''));
    let title = document.querySelector("h1.fcca24e0").textContent.replace('\n','').replace('\r','').replace('\t','').replace('  ','')
    let info = Array.from(document.querySelectorAll("div.ba1ca68e._0ee3305d"),elmnt=>elmnt.textContent.replace('\n','').replace('\r','').replace('\t','').replace('  ',''))
    info = Array.from(document.querySelectorAll("._033281ab li"),elmnt=>elmnt.textContent.replace('\n','').replace('\r','').replace('\t','').replace('  ',''))
   
  return({
      title: title,
    })

  }))

  if((j%500) == 0){
    batch++
    csvWriter = csv_handler('offplan',batch)
  }
  
  data[0].plans_2d = plans.d2[0]
  data[0].plans_3d = plans.d3[0]
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
        .then(()=> console.log('error logged'));
        continue
      }
    }
  }

}



async function main(){

  const browser = await puppeteer.launch({headless: true,executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',args: ['--enable-automation']});
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
        .then(()=> console.log('error logged'));
        continue
      }
    }

  }
  await browser.close();
        
}

main()