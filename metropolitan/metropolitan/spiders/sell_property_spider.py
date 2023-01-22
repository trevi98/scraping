import scrapy
from ..items import propertSellItem
from bs4 import BeautifulSoup
import requests


class HausspiderSpider(scrapy.Spider):
    name = 'sell_guide'
    start_urls = ['https://metropolitan.realestate/services/buy/']
    def parse(self, response ):
        items=propertSellItem()
        titleHome=response.css("h1::text").get()
        soup_help_key=response.css("div.servicesWrp div.servicesItem div.projectHeading.left").extract()
        help_key=[]
        for i in range(len(soup_help_key)-1):
            one=BeautifulSoup(soup_help_key[i],"lxml").text.replace("\n","").replace("  ","") 
            help_key.append(one)
        soup_help_value=response.css("div.servicesWrp div.servicesItem div.servicesText").extract() 
        help_value=[]
        for i in range(len(soup_help_value)-1):
            one=BeautifulSoup(soup_help_value[i],"lxml").text.replace("\n","").replace("  ","") 
            help_value.append(one) 
        help=[]
        for i in range(len(help_value)-1):
            help.append({help_key[i]:help_value[i]})         
       


        items["titleHome"]=titleHome
        items["marketing"]=help

        yield items
        
       