import scrapy
from ..items import HausTenantsGuideItem
from bs4 import BeautifulSoup
import requests

class HausspiderSpider(scrapy.Spider):
    name = 'hausTenantsGuideSpider'
    start_urls = ['https://www.hausandhaus.com/property-leasing/tenants-guide']
    def parse(self, response ):
        items=HausTenantsGuideItem()
        titleHome=response.css("div.article-head h1::text").get().replace("\n","").replace("  ","")
        descriptionHome=response.css("div.article-head div.introtext.row.js-animate-right div.col-sm-12 p::text").get().replace("\n","").replace("  ","")
        all_descriptions=[]
        soup=response.css("div.article-body.remove-border.js-animate-left div.article-entry div.row div.col-sm-6 p").extract()
        delete="For more information about renting a property in Dubai, contact the haus & haus team on +971 4 302 5800 or register your interest here."
        for i in range(len(soup)):
            one=BeautifulSoup(soup[i],"lxml").text.replace("\n","").replace("  ","")
            if delete in one:
                one.replace(delete,"")
            all_descriptions.append(one)
        items["titleHome"]=titleHome
        items["descriptions"]=all_descriptions
        items["descriptionHome"]=descriptionHome
        yield items
        data = {'message': 'machine 2 | haus tenant guid done (;'}
        response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
       