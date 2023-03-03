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
  await page.goto("https://www.bayut.com/buildings/the-jewels/");
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
      document.querySelectorAll(".post.container.text-base.leading-9 >div")
    );
    let content = [];
    let all_content = {};
    for (let i = 0; i < temp.length; i++) {
      let des = [];
      let titles = "";
      if (temp[i].hasAttribute("id")) {
        try {
          titles = temp[i].textContent;
        } catch (error) {}
        let s = i + 1;
        let res = [];
        while (s < temp.length) {
          if (
            temp[s].hasAttribute("id") ||
            temp[s].querySelectorAll("img").length > 0
          )
            break;
          else {
            res.push(clean(temp[s].textContent));
            s++;
          }
        }
        des.push(res);
        all_content[titles] = des;
        i = s - 1;
      } else {
        continue;
      }
    }
    if (temp.length === 0) {
      temp = Array.from(document.querySelectorAll("._53549583.be4c198c >*"));
      for (let i = 0; i < temp.length; i++) {
        let des = [];
        let titles = "";
        if (
          temp[i].tagName === "H3" ||
          temp[i].tagName === "H4" ||
          temp[i].tagName === "H5" ||
          temp[i].tagName === "H2"
        ) {
          try {
            titles = temp[i].textContent;
          } catch (error) {}
          let s = i + 1;
          let res = [];
          while (s < temp.length) {
            if (
              temp[s].tagName === "H3" ||
              temp[s].tagName === "H4" ||
              temp[s].tagName === "H5" ||
              temp[s].tagName === "H2"
            )
              break;
            else {
              try {
                let one = Array.from(temp[s].querySelectorAll("*"));
                one.forEach((e) => {
                  try {
                    res.push(clean(e.textContent));
                  } catch (e) {}
                });
                res.push(clean(temp[s].textContent));
              } catch (error) {}
              s++;
            }
          }
          des.push(res);
          all_content[titles] = des;
          i = s - 1;
        } else {
          continue;
        }
      }
    }

    content.push(JSON.stringify(all_content));
    let cover_img = "";
    try {
      cover_img = document.querySelectorAll(
        "div.container div.relative div div span img"
      )[5].src;
    } catch (error) {}
    if (!cover_img) {
      try {
        cover_img = clean(
          document.querySelectorAll("._53549583.be4c198c img")[0].src
        );
      } catch (error) {}
    }
    let images = [];
    temp = Array.from(document.querySelectorAll("div.mt-6.mb-5 img"));
    if (temp.length == 0)
      temp = Array.from(document.querySelectorAll("._53549583.be4c198c img"));
    temp.forEach((e) => {
      try {
        images.push(clean(e.src));
      } catch (error) {}
    });
    let Floor_plans = [];
    let floor = Array.from(document.querySelectorAll("a"));
    floor.forEach((e) => {
      if (/floor/i.test(e.href)) {
        try {
          Floor_plans.push(clean(e.href));
        } catch (error) {}
      }
    });
    Floor_plans = [...new Set(Floor_plans)];
    return {
      title: title,
      content: content,
      temp: temp.length,
      images: images,
      cover_img: cover_img,
      Floor_plans: Floor_plans,
      signaturea: Date.now(),
    };
  });
  console.log(links);
  await browser.close();
}
run();
