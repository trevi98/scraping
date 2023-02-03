import scrapy
from ..items import WhyDubaiItem
import requests
from bs4 import BeautifulSoup


class testingSpider(scrapy.Spider):
    name = 'why_dubai'
    start_urls = ["https://www.drivenproperties.com/why-dubai"]
    page_number = 2
    link = ""


    def parse(self,response):
        # items = TestscrapyItem()
        content = BeautifulSoup(response.css(".dpx-services-content-inner").get(),'lxml').text.replace("\n","").replace("  ","")
        items = WhyDubaiItem()
        items['content'] = content
        yield items
        data = {'message': 'why_dubao  done'}
        response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)

   