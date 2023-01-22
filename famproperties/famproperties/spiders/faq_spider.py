import scrapy
from ..items import faqtItem
import requests
from bs4 import BeautifulSoup
from .helpers import methods
from .helpers2 import methods2
from .file_downloader import img_downloader
import uuid


class testingSpider(scrapy.Spider):
    name = 'faq'
    start_urls = ["https://famproperties.com/advice"]
    page_number = 2
    link = ""


    def parse(self,response):
        # items = TestscrapyItem()
        all = response.css("#RESULT_report a::attr(href)").extract()

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
        items = faqtItem()
        
        items['question'] = response.css("#R12520461108108937973 .t-Region-body h1::text").get().replace("\n","").replace("\t","").replace("  ","").replace("\r","")
        items['answer'] = BeautifulSoup(response.css("#R12520461108108937973 .t-Region-body").get(),'lxml').text.replace("\n","").replace("\t","").replace("  ","").replace("\r","").replace(response.css("#R12520461108108937973 .t-Region-body h1::text").get(),"")

        yield items

