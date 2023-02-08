const puppeteer = require('puppeteer');

async function makePostRequest() {
  const browser = await puppeteer.launch({headless: false,executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',args: ['--enable-automation']});  const page = await browser.newPage();

  const apiUrl = 'https://metropolitan.realestate/ajax-listing.php';
  const requestBody = `action=listing&type=buy&page=57&status=0&ln=en`

  const response = await page.evaluate(async (apiUrl, requestBody) => {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    return await response.json();
  }, apiUrl, requestBody);

  console.log(response);

  await browser.close();
}

makePostRequest();
