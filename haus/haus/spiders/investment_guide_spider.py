import scrapy
from ..items import HausinvestmentItem
from bs4 import BeautifulSoup
import requests


class HausspiderSpider(scrapy.Spider):
    name = 'investment'
    start_urls = ['https://www.hausandhaus.com/dubai-real-estate-free-guide']
    def parse(self, response ):
        items=HausinvestmentItem()
        titleHome=response.css("div.main article.article.general-purpose-page div.container h1.h2::text").get().replace("\n","").replace("\t","")
        descriptionHome=BeautifulSoup(response.css("div.main article.article.general-purpose-page div.container div.introtext.row").get(),"lxml").text.replace("\n","").replace("\t","")
       
        items["title"]=titleHome
        items["description"]=descriptionHome
        yield items
        data = {'message': 'machine 1 | investment done (;'}
        # response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)