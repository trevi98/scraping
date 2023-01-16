import scrapy
from scrapy.http import FormRequest
from ..items import BayutBuildingItem
import requests
from bs4 import BeautifulSoup

class testingSpider(scrapy.Spider):
    name = 'building'
    start_urls = ["https://www.bayut.com/buildings/dubai"]
    page_number = 2
    link = ""


    def parse(self,response):
        # items = TestscrapyItem()
        all = response.css("div.listItem a::attr(href)").extract()

        for one in all:
            yield response.follow(one,callback = self.page)

        next_page = f"https://www.bayut.com/buildings/dubai/page/{self.page_number}"
        if next_page is not None and self.page_number < 242:
            self.page_number +=1
            self.link = one
            yield response.follow(next_page,callback = self.parse)
        else:
            file = open("bayut_building.csv", "rb")
            # Create a CSV reader
            # reader = list(csv.reader(file))
            headersx = {'Content-Type': 'application/x-www-form-urlencoded'}
            data = {
                "file_name" : "bayut_building",
                "site" : "bayut",

            }
            files = {"file": ("bayut_building.csv", file)}
            response = requests.post("https://notifaier.abdullatif-treifi.com/", data=data,files=files)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = BayutBuildingItem()
        title = response.css("h1.title::text").get()
        # soup = BeautifulSoup(html, 'lxml')
        soup = BeautifulSoup(response.css("#highlights").get(),'lxml')
        highlights = soup.get_text()
        soup = BeautifulSoup(response.css("#details").get(),'lxml')
        details = soup.get_text()
        soup = BeautifulSoup(response.css("#amenities").get(),'lxml')
        amenities = soup.get_text()

        # description = soup.get_text()
        
        # description = response.css(".author-description::text").get()
        items['title'] = title
        items['highlights'] = highlights
        items['details'] = details
        items['amenities'] = amenities
        items['link'] = self.link
        yield items
