import scrapy
from ..items import buyersCommercialItem
from bs4 import BeautifulSoup
import requests


class HausspiderSpider(scrapy.Spider):
    name = 'buyersCommercial'
    start_urls = ['https://www.hausandhaus.com/commercial/buyers-guide-commercial-property-dubai']
    def parse(self, response ):
        items=buyersCommercialItem()
        titleHome=response.css("div.article-head h1::text").get().replace("\n","").replace("\t","")
        soup_description=response.css("div.article-head p").extract()
        descriptionHome=""
        for i in range(len(soup_description)):
            one=BeautifulSoup(soup_description[i],"lxml").text.replace("\n","").replace("\t","").replace("  ","")
            descriptionHome+=one
        all_article=""
        soup_article=response.css("div.article-body.remove-border.js-animate-left div.row p").extract()
        for i in range(len(soup_article)):
            one=BeautifulSoup(soup_article[i],"lxml").text.replace("\n","").replace("\t","").replace("  ","")
            all_article+=one
             
       
        items["titleHome"]=titleHome
        items["descriptionHome"]=descriptionHome
        items["article"]=all_article
        yield items
        data = {'message': ' haus buyer comm done (;'}
        response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)