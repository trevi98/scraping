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
    "https://www.providentestate.com/dubai-developments/jumeirah-park-65.html"
  );
  const links = await page.evaluate(() => {
    let arr = Array.from(
      document.querySelectorAll(
        "div.wpb_text_column.wpb_content_element  div.wpb_wrapper *"
      )
    );

    // all_titles = [];
    // all_des = [];
    // for (let i = 0; i < arr.length; i++) {
    //   if (arr[i].startsWith("<h3") && e.incudus("<b>")) {
    //     all_titles.push(arr[i].textContent);
    //     let s = i + 1;
    //     let result = "";
    //     while (s < arr.length) {
    //       if (
    //         arr[s].startsWith("<p") ||
    //         arr[s].startsWith("<h5") ||
    //         arr[s].startsWith("<ul")
    //       ) {
    //         result += arr[s].textContent;
    //       } else if (arr[s].startsWith("<h3")) {
    //         break;
    //       }
    //     }
    //     all_des.push(result);
    //   }
    // }

    return {
      des: arr.length,
      t: arr,
    };
  });
  console.log(links);
  //   console.log(await page.content());

  await browser.close();
}
run();
