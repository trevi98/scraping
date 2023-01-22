import scrapy
from ..items import guidetItem
import requests
from bs4 import BeautifulSoup
from .helpers import methods
from .helpers2 import methods2
from .file_downloader import img_downloader
import uuid


class testingSpider(scrapy.Spider):
    name = 'guides'
    start_urls = ["https://famproperties.com/dubai-real-estate-guides"]
    page_number = 2
    link = ""


    def parse(self,response):
        # items = TestscrapyItem()
        all = response.css("#R12922312436520619951 a::attr(href)").extract()

        for one in all:
            self.link = one
            yield response.follow(one,callback = self.page)

        next_page = f"https://www.drivenproperties.com/dubai/properties-for-sale?page={self.page_number}/"
        if next_page is not None and self.page_number < 1:
            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)
        else:
            # pass
            data = {'message': 'driven buy done'}
            # response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = guidetItem()
        
        items['content'] = BeautifulSoup(response.css("#R12844459103898735154").get(),'lxml').text.replace("\n","").replace("\t","").replace("  ","").replace("\r","")

        yield items

