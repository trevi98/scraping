import scrapy
from scrapy.http import FormRequest
from ..items import BayutBuyItem
import requests
from bs4 import BeautifulSoup

class testingSpider(scrapy.Spider):
    name = 'buy'
    start_urls = ["https://www.bayut.com/for-sale/property/dubai"]
    page_number = 2
    link = ""


    def parse(self,response):
        # items = TestscrapyItem()
        all = response.css("article.ca2f5674 div._4041eb80 a._287661cb::attr(href)").extract()

        for one in all:
            try:
                yield response.follow(one,callback = self.page)
            except:
                continue

        next_page = f"https://www.bayut.com/for-sale/property/dubai/page-{self.page_number}"
        if next_page is not None and self.page_number < 2082:
            self.page_number +=1
            self.link = one
            yield response.follow(next_page,callback = self.parse)
        else:
            file = open("bayut_buy.csv", "rb")
            # Create a CSV reader
            # reader = list(csv.reader(file))
            headersx = {'Content-Type': 'application/x-www-form-urlencoded'}
            data = {
                "file_name" : "bayut_buy",
                "site" : "bayut",

            }
            files = {"file": ("bayut_buy.csv", file)}
            response = requests.post("https://notifaier.abdullatif-treifi.com/", data=data,files=files)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = BayutBuyItem()
        title = response.css("h1.fcca24e0::text").get()
        price = response.css("span._105b8a67::text").get()
        area = response.css("div._1f0f1758::text").get()
        # soup = BeautifulSoup(property_facts, 'lxml')
        icons_info = response.css("span.cfe8d274 span::text").extract()
        bathrooms = "N/A"
        bedrooms = "N/A"
        size = "N/A"
        for li in icons_info:
            if (li.find("Beds")) > -1:
                bedrooms = li
            if (li.find("Baths")) > -1:
                bathrooms = li
            if (li.find("sqft")) > -1:
                size = li
        soup = BeautifulSoup(response.css("div._2015cd68 div").get(),'lxml')
        description = soup.get_text()
        property_type = "N/A"
        furnishing = "N/A"
        completion = "N/A"
        lis = response.css("ul._033281ab").get()
        soup = BeautifulSoup(lis,'lxml')
        lis = soup.find_all('li')
        for li in lis:
            try:
                if (li.find_all("span")[0].text.find("Type")) > -1:
                    property_type = li.find_all("span")[1].text
                if (li.find_all("span")[0].text.find("Furnishing")) > -1:
                    furnishing = li.find_all("span")[1].text
                if (li.find_all("span")[0].text.find("Completion")) > -1:
                    completion = li.find_all("span")[1].text
                
            except:
                continue

        developer = "N/A"
        ownership = "N/A"
        plot_area = "N/A"
        builtup_area = "N/A"
        usage = "N/A"
        # aditional_info = 
        if len(response.css("._208d68ae ._7e76939c")) > 0:
            lis = response.css("._208d68ae ._7e76939c").get()
            soup = BeautifulSoup(lis,'lxml')
            lis = soup.find_all('li')
            for li in lis:
                try:
                    if (li.find_all("span")[0].text.find("Developer")) > -1:
                        developer = li.find_all("span")[1].text
                    if (li.find_all("span")[0].text.find("Ownership")) > -1:
                        ownership = li.find_all("span")[1].text
                    if (li.find_all("span")[0].text.find("Plot Area")) > -1:
                        plot_area = li.find_all("span")[1].text
                    if (li.find_all("span")[0].text.find("Built-up Area")) > -1:
                        builtup_area = li.find_all("span")[1].text
                    if (li.find_all("span")[0].text.find("Usage")) > -1:
                        usage = li.find_all("span")[1].text
                    
                except:
                    continue
        amenities = response.css("div._4b64e3bd div._9676c577 ::text").extract()
        # description = soup.get_text()

        # description = response.css(".author-description::text").get()
        items['title'] = title
        items['property_type'] = property_type
        items['price'] = price
        items['size'] = size
        items['bedrooms'] = bedrooms
        items['bathrooms'] = bathrooms
        items['description'] = description
        items['area'] = area
        items['amenities'] = amenities
        items['furnishing'] = furnishing
        items['completion'] = completion
        items['developer'] = developer
        items['ownership'] = ownership
        items['plot_area'] = plot_area
        items['builtup_area'] = builtup_area
        items['usage'] = usage
        items['link'] = self.link
        yield items
