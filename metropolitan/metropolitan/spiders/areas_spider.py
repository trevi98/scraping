import scrapy
from ..items import areaItem
import requests
from bs4 import BeautifulSoup
from .helpers import methods
from .file_downloader import img_downloader
import uuid


class testingSpider(scrapy.Spider):
    name = 'area'
    start_urls = ["https://metropolitan.realestate/areas/"]
    page_number = 2


    def parse(self,response):
        # items = TestscrapyItem()
        all =response.css(".areas_list-details .areas_list-link.guide::attr(href)").extract()

        for one in all:
            yield response.follow("https://metropolitan.realestate/"+one,callback = self.page)

        next_page = f"https://metropolitan.realestate/buy/page/{self.page_number}/"
        if next_page is not None and self.page_number < 1:
            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)
        else:
            # pass
            data = {'message': 'metro area done'}
            # response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = areaItem()
        signature = uuid.uuid1()

        title = "N/A"
        description = "N/A"
        bedrooms = "N/A"
        developer = "N/A"
        area = "N/A"
        price = "N/A"
        near_by_places = "N/A"
        payment_plan = "N/A"
        location = "N/A"
        amentities = "N/A"
        unit_sizes = []
        video = "N/A"
        images = "N/A"
        title=response.css("h1.area-header__title::text").get()
        content=BeautifulSoup(response.css("div.body-mpp.pdd").get(),"lxml").text.replace("\n","").replace("\t","").replace("\r","").replace("  ","")
  

        items['content'] = content
        items['title'] = title
        yield items


   
