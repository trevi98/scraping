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
    "https://www.propertyfinder.ae/en/plp/buy/apartment-for-sale-dubai-downtown-dubai-burj-crown-9088037.html"
  );
  const links = await page.evaluate(() => {
    let title = "";
    try {
      title = document.title.split("|")[0];
    } catch (error) {
      title = document.title;
    }
    let temp = Array.from(document.querySelectorAll("ul.property-facts li"));
    let Property_type = "";
    let Property_size = "";
    let Bedrooms = "";
    let Bathrooms = "";
    let Developer = "";
    temp.forEach((e) => {
      let key = e.querySelector(".property-facts__label").textContent;
      let value = e.querySelector(".property-facts__value").textContent;
      if (/Property type/i.test(key)) {
        Property_type = value;
      }
      if (/Property size/i.test(key)) {
        Property_size = value;
      }
      if (/Bedrooms/i.test(key)) {
        Bedrooms = value;
      }
      if (/Bathrooms/i.test(key)) {
        Bathrooms = value;
      }
      if (/Developer/i.test(key)) {
        Developer = value;
      }
    });
    let price = "";
    try {
      price = document.querySelector(
        ".property-page__contact-section  .property-price .property-price__price"
      ).textContent;
    } catch (error) {}
    temp = Array.from(
      document.querySelectorAll(".property-payment-plan__item")
    );
    let Down_Payment = "";
    let Monthly_Payment = "";
    let Pay_Over = "";
    temp.forEach((e) => {
      let key = e.querySelector(".property-payment-plan__label").textContent;
      let value = e.querySelector(".property-payment-plan__value").textContent;
      if (/Down Payment/i.test(key)) {
        Down_Payment = value;
      }
      if (/Monthly Payment/i.test(key)) {
        Monthly_Payment = value;
      }
      if (/Pay Over/i.test(key)) {
        Pay_Over = value;
      }
    });
    temp = Array.from(
      document.querySelectorAll(".property-project-details__list-item")
    );
    let Size_range_sqm = "";
    let Starting_price = "";
    let Completion = "";
    temp.forEach((e) => {
      let key = e.querySelector(
        ".property-project-details__list-item div:not(.property-project-details__list-item-value)"
      ).textContent;
      let value = e.querySelector(
        ".property-project-details__list-item-value"
      ).textContent;
      if (/Size range/i.test(key)) {
        Size_range_sqm = value;
      }
      if (/Starting price/i.test(key)) {
        Starting_price = value;
      }
      if (/Completion/i.test(key)) {
        Completion = value;
      }
      if (!Property_type) {
        if (/Property type/i.test(key)) {
          Property_type = value;
        }
      }
    });
    let location = "";
    try {
      location = document.querySelector(
        ".property-location__detail-area"
      ).textContent;
    } catch (error) {}
    let agent = "";
    try {
      agent = document.querySelector(
        ".text.text--size3.link.link--underline.property-agent__name"
      ).textContent;
    } catch (error) {}
    temp = Array.from(document.querySelectorAll(".property-amenities__list"));
    let amenities__list = [];
    temp.forEach((e) => {
      try {
        amenities__list.push(e.textContent);
      } catch (error) {}
    });
    let description = "";
    try {
      description = document.querySelector(
        ".text-trim.property-description__text-trim.text-trim--enabled"
      ).textContent;
    } catch (error) {}

    let Reference = "";
    let Trakheesi_Permit = "";
    let Agent_BRN = "";
    let Broker_ORN = "";
    temp = Array.from(
      document.querySelectorAll(".property-page__legal-list-item")
    );
    temp.forEach((e) => {
      let key = e.querySelector(".property-page__legal-list-label").textContent;
      let value = e.querySelector(
        ".property-page__legal-list-content"
      ).textContent;
      if (/Reference/i.test(key)) {
        Reference = value;
      }
      if (/Trakheesi Permit/i.test(key)) {
        Trakheesi_Permit = value;
      }
      if (/Agent BRN/i.test(key)) {
        Agent_BRN = value;
      }

      if (/Broker ORN/i.test(key)) {
        Broker_ORN = value;
      }
    });

    return {
      title: title,
      Property_type: Property_type,
      Property_size: Property_size,
      Bedrooms: Bedrooms,
      Bathrooms: Bathrooms,
      Developer: Developer,
      price: price,
      Down_Payment: Down_Payment,
      Monthly_Payment: Monthly_Payment,
      Pay_Over: Pay_Over,
      Size_range_sqm: Size_range_sqm,
      Starting_price: Starting_price,
      Completion: Completion,
      location: location,
      agent: agent,
      amenities__list: amenities__list,
      description: description,
      Reference: Reference,
      Trakheesi_Permit: Trakheesi_Permit,
      Agent_BRN: Agent_BRN,
      Broker_ORN: Broker_ORN,
    };
  });
  console.log(links);

  await browser.close();
}
run();
