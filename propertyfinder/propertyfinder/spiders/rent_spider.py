import scrapy
from scrapy.http import FormRequest
from ..items import PropertyfinderBuyItem
import requests
from bs4 import BeautifulSoup


class testingSpider(scrapy.Spider):
    link = ""
    name = 'rent_y'
    start_urls = ["https://www.propertyfinder.ae/en/search?c=2&l=1&ob=mr&page=1&rp=y"]
    page_number = 2


    def parse(self,response):
        # items = TestscrapyItem()
        all = response.css("a.card__link::attr(href)").extract()

        for one in all:
            self.link = one
            yield response.follow(one,callback = self.page)

        next_page = f"https://www.propertyfinder.ae/en/search?c=2&l=1&ob=mr&page={self.page_number}&rp=y"
        if next_page is not None and self.page_number < 1301:

            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)
        else:
            file = open("propertyfinder_rent_y.csv", "rb")
            # Create a CSV reader
            # reader = list(csv.reader(file))
            headersx = {'Content-Type': 'application/x-www-form-urlencoded'}
            data = {
                "file_name" : "propertyfinder_rent_y",
                "site" : "property_finder",

            }
            files = {"file": ("propertyfinder_rent_y.csv", file)}
            response = requests.post("https://notifier.abdullatif-treifi.com/", data=data,files=files)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = PropertyfinderBuyItem()
        title = response.css("h2.property-page__sub-title::text").get()
        tags = response.css("h1.property-page__title::text").get()
        property_facts = response.css("ul.property-facts").get()
        soup = BeautifulSoup(property_facts, 'lxml')

        # property_type = property_facts[0].css(".property-facts__value::text").get()
        lis = soup.find_all("li")
        bedrooms = "N/A"
        bathrooms = "N/A"
        property_type = "N/A"
        size = "N/A"
        for li in lis:
            if (li.find_all("div")[0].text.find("Bedrooms")) > -1:
                bedrooms = li.find_all("div")[1].text
            if (li.find_all("div")[0].text.find("Bathrooms")) > -1:
                bathrooms = li.find_all("div")[1].text
            if (li.find_all("div")[0].text.find("Property type")) > -1:
                property_type = li.find_all("div")[1].text
            if (li.find_all("div")[0].text.find("Property size")) > -1:
                size = li.find_all("div")[1].text
        price = response.css(".property-price__price").getall()[1]
        soup = BeautifulSoup(price,'lxml')
        price = soup.text
        description = response.css(".property-description__text-trim").get()
        soup = BeautifulSoup(description, 'lxml')
        description = soup.get_text()
        link = self.link
        area = response.css(".property-location__tower-name::text").get()
        amenities = response.css(".property-amenities__list::text").extract()

            

        # content = response.css(".entry-content ::text").extract()
        # description = response.css(".author-description::text").get()
        items['title'] = title
        items['tags'] = tags
        items['property_type'] = property_type
        items['bedrooms'] = bedrooms
        items['bathrooms'] = bathrooms
        items['price'] = price
        items['description'] = description
        items['area'] = area
        items['link'] = link
        items['amenities'] = amenities
        items['size'] = size
        yield items
