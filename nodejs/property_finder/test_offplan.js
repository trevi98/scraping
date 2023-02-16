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
    "https://www.propertyfinder.ae/en/new-projects/emaar-properties/collective-2"
  );
  const links = await page.evaluate(() => {
    let title = "";
    try {
      title = document.title.split("|")[0];
    } catch (error) {}
    let images = [];
    let temp = Array.from(document.querySelectorAll("._1rJE5wS3 img"));
    temp.forEach((e) => {
      try {
        images.push(e.src);
      } catch (error) {}
    });
    let development = "";
    try {
      development = document.querySelector("._1KmX3mFx").textContent;
    } catch (error) {}
    let Completion = "";
    try {
      Completion = document.querySelectorAll("._2n1p1Fk3 li")[1].textContent;
    } catch (error) {}
    let price = "";
    try {
      price = document.querySelector("._2zZtS67d").textContent;
    } catch (error) {}
    temp = Array.from(document.querySelectorAll("._1-jqWgJk"));
    let per_Price = "";
    let Status = "";
    let handover = "";
    let Total_units = "";
    let Bedrooms = "";
    let key = "";
    let valeu = "";
    temp.forEach((e) => {
      try {
        key = e.querySelector("._1EKHXI5l").textContent;
      } catch (error) {}
      try {
        valeu = e.querySelector("._1-htALWL").textContent;
      } catch (error) {}
      if (!price && /price from/i.test(key)) {
        price = valeu;
      }
      if (/price per/i.test(key)) {
        per_Price = valeu;
      }
      if (/Delivery Date/i.test(key)) {
        handover = valeu;
      }
      if (/Status/i.test(key)) {
        Status = valeu;
      }
      if (/Total units/i.test(key)) {
        Total_units = valeu;
      }
      if (/Bedrooms/i.test(key)) {
        Bedrooms = valeu;
      }
    });
    let location = "";
    try {
      location = document.querySelector("._3XeJbDEl").textContent;
    } catch (error) {}
    let description = "";
    try {
      description = document.querySelector("._3RInl69y").textContent;
    } catch (error) {}
    let amenities = [];
    temp = Array.from(document.querySelectorAll(".tFA-5K61"));
    temp.forEach((e) => {
      try {
        amenities.push(e.textContent);
      } catch (error) {}
    });
    return {
      title: title,
      images: images,
      developer: development,
      Completion: Completion,
      price: price,
      per_Price: per_Price,
      Status: Status,
      Bedrooms: Bedrooms,
      Total_units: Total_units,
      handover: handover,
      location: location,
      description: description,
      amenities: amenities,
    };
  });
  console.log(links);

  const exists = await page.evaluate(() => {
    return document.querySelector(".hKLeOaZw") !== null;
  });
  let all = [];
  if (exists) {
    await page.click(".hKLeOaZw");
    let number = await page.evaluate(() => {
      let number = document.querySelector("._1NQKGfgH").textContent;
      return number.match(/(\d+)/)[0];
    });
    console.log(number);
    let one = "";
    for (let i = 0; i < number - 1; i++) {
      await page.click("._2QSr25U5._3FXKQtgy .Gyj5GDoE._1aq7zO-I");
      await page.waitForTimeout(600);

      one = await page.evaluate(() => {
        if (
          document.querySelector("._1Hu9Ll0m") !== null &&
          /floorplan/i.test(document.querySelector("._1Hu9Ll0m").src)
        ) {
          let title = "";
          try {
            title = document.querySelector("._1F-XLCtc").textContent;
          } catch (error) {}
          let temp = Array.from(
            document.querySelectorAll(
              "._3lqkaot7.SuVNGgcu._1KmjrEtq p:not(._1F-XLCtc)"
            )
          );
          let all_content = {};
          let i = 0;
          for (; i < temp.length; ) {
            try {
              all_content[temp[i].textContent] = temp[i + 1].textContent;
            } catch (error) {}
            i += 2;
          }
          let img = "";
          try {
            img = document.querySelector("._1Hu9Ll0m").src;
          } catch (error) {}
          return {
            title: title,
            all_content: all_content,
            img: img,
          };
        }
      });
      if (one) all.push(one);
    }
  } else {
    console.log("no");
  }
  console.log(all);
  await browser.close();
}
run();

// a._3CeWVKEE
