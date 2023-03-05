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
    "https://www.bayut.com/schools/dubai-english-speaking-school/"
  );
  const links = await page.evaluate(() => {
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
    let title = "";
    try {
      title = clean(document.title.split("|")[0]);
    } catch (error) {}
    let temp = Array.from(
      document.querySelectorAll("div.post.container.text-base.leading-9 >*")
    );
    let content = [];
    let all_content = {};
    for (let i = 0; i < temp.length; i++) {
      let titles = "";
      let des = [];
      if (temp[i].hasAttribute("id")) {
        try {
          titles = clean(temp[i].textContent);
        } catch (error) {}
        let s = i + 1;

        while (s < temp.length) {
          if (temp[s].hasAttribute("id")) break;
          else {
            let one = Array.from(temp[s].querySelectorAll("li,p,tr"));
            one.forEach((e) => {
              try {
                des.push(clean(e.textContent));
              } catch (error) {}
            });
            s++;
          }
        }
        all_content[titles] = des;
        i = s - 1;
      } else {
        continue;
      }
    }
    content.push(JSON.stringify(all_content));
    let cover_img = "";
    try {
      cover_img = document.querySelectorAll(
        "div.container div.relative div div span img"
      )[5].src;
    } catch (error) {}
    let images = [];
    temp = Array.from(document.querySelectorAll("div.mt-6.mb-5 img"));
    temp.forEach((e) => {
      try {
        images.push(clean(e.src));
      } catch (error) {}
    });
    return {
      title: title,
      content: content,
      images: images,
      cover_img: cover_img,
      signaturea: Date.now(),
    };
  });
  console.log(links);

  await browser.close();
}
run();
