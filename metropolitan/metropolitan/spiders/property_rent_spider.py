import scrapy
from ..items import propertRentItem
from bs4 import BeautifulSoup
import requests


class HausspiderSpider(scrapy.Spider):
    name = 'propertyRent'
    start_urls = ['https://metropolitan.realestate/services/rent/']
    def parse(self, response ):
        items=propertRentItem()
        titleHome=response.css("h1::text").get()
        descriptionHome=response.css("div.headText__view p::text").extract()
        market_analysis=response.css("div.textBlock.pd30.full ul")[0].css("li::text").extract()    
        costs_renting=response.css("div.fwDesc ul li").extract()
        all_costs_renting=[]
        for i in costs_renting:
            one=BeautifulSoup(i,"lxml").text.replace("\n","").replace("  ","") 
            all_costs_renting.append(one)
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
        Rental_Process_Going=[]
        for i in range(len(help_value)-1):
            Rental_Process_Going.append({help_key[i]:help_value[i]})  
        Rental_Process_Going_description=response.css("section.contentSection.featureProjects div.textBlock.pd30.full p").extract()
        all_Rental_Process_Going_description=""
        for i in range(len(Rental_Process_Going_description)-1):
            one=BeautifulSoup(Rental_Process_Going_description[i],"lxml").text.replace("\n","").replace("  ","")
            all_Rental_Process_Going_description+=one
              
        
        items["titleHome"]=titleHome
        items["descriptions"]=descriptionHome
        items["market_analysis"]=market_analysis
        items["Rental_Process_Going"]=Rental_Process_Going
        items["costs_renting"]=all_costs_renting
        items["description_Rental_Process_Going"]=all_Rental_Process_Going_description
        yield items
        
       