import scrapy
from ..items import HausLandlordsGuideItem
from bs4 import BeautifulSoup
import requests

class HausspiderSpider(scrapy.Spider):
    name = 'hausLandlordsGuideSpider'
    start_urls = ['https://www.hausandhaus.com/property-leasing/landlords-guide']
    def parse(self, response ):
        items=HausLandlordsGuideItem()
        titleHome=response.css("div.article-head h1::text").get().replace("\n","").replace("  ","")
        descriptionHome=response.css("div.article-head div.introtext.row.js-animate-right div.col-sm-12 p::text").get().replace("\n","").replace("  ","")
        all_descriptions=""
        soup=response.css("div.article-body.remove-border.js-animate-left div.article-entry div.row div.col-sm-6 p").extract()
        for i in range(len(soup)):
            one=BeautifulSoup(soup[i],"lxml").text.replace("\n","").replace("  ","")
            all_descriptions+=one
        items["titleHome"]=titleHome
        items["descriptions"]=all_descriptions
        items["descriptionHome"]=descriptionHome
        yield items
        data = {'message': 'machine 1 | haus land lord guid done (;'}
        response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
       