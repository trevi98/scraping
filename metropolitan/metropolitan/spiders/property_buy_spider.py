import scrapy
from ..items import propertyBuyItem
from bs4 import BeautifulSoup
import requests


class HausspiderSpider(scrapy.Spider):
    name = 'buy_guide'
    start_urls = ['https://metropolitan.realestate/services/buy/']
    def parse(self, response ):
        items=propertyBuyItem()
        titleHome=response.css("h1::text").get()
        descriptionHome=response.css("div.headText__view p::text").extract()
        buying_kye=response.css("section.contentSection.featureProjects div.row.abtRow.bwi div.col-md-6 div.abtRowTR h3::text").extract()
        buying_value=response.css("section.contentSection.featureProjects div.row.abtRow.bwi div.col-md-6 p::text").extract()
        buying=[]
        for i in range(len(buying_kye)):
            buying.append({buying_kye[i]:buying_value[i]})
        buying_on_the_secondary_market=response.css("div.textBlock.pd30.full ul")[0].css("li::text").extract()    
        buying_off_plan_properties=response.css("div.textBlock.pd30.full ul")[1].css("li::text").extract()
        Off_plan_purchase_explained=''.join(response.css("div.col-md-8.fWbContent p::text").extract())
        soup_help_key=response.css("div.servicesWrp div.servicesItem div.projectHeading.left").extract()
        help_key=[]
        for i in range(len(soup_help_key)):
            one=BeautifulSoup(soup_help_key[i],"lxml").text.replace("\n","").replace("  ","") 
            help_key.append(one)
        soup_help_value=response.css("div.servicesWrp div.servicesItem div.servicesText").extract() 
        help_value=[]
        for i in range(len(soup_help_value)):
            one=BeautifulSoup(soup_help_value[i],"lxml").text.replace("\n","").replace("  ","") 
            help_value.append(one) 
        help=[]
        for i in range(len(help_value)):
            help.append({help_key[i]:help_value[i]})         
        
        items["titleHome"]=titleHome
        items["descriptions"]=descriptionHome
        items["buying_property"]=buying
        items["helping"]=help
        items["buying_on_the_secondary_market"]=buying_on_the_secondary_market
        items["buying_property"]=buying
        items["buying_off_plan_properties"]=buying_off_plan_properties
        items["Off_plan_purchase_explained"]=Off_plan_purchase_explained
        yield items
        
       