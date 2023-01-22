import scrapy
from ..items import TallestItem
import requests
from bs4 import BeautifulSoup
from .helpers import methods
from .helpers2 import methods2
from .file_downloader import img_downloader
import uuid


class testingSpider(scrapy.Spider):
    name = 'tallest_buildings'
    start_urls = ["https://famproperties.com/tallest-buildings-in-dubai"]
    page_number = 1
    link = ""


    def parse(self,response):
        # items = TestscrapyItem()
        signature = uuid.uuid1()
        items = TallestItem()
        rows = response.css("#R12544144335359955583 tr").extract()
        items['row'] = []
        i = 1
        for row in rows:
            if i == 1:
                i+=1
                continue
            items['row'].append(methods2.handle_table_rows(row))
        yield items
           
        data = {'message': 'machine 1 | fam blog done (;'}
        # response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)

