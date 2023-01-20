import scrapy
from ..items import HauswhyoffplanItem
from bs4 import BeautifulSoup
import requests


class HausspiderSpider(scrapy.Spider):
    name = 'whyoffpllan'
    start_urls = ['https://www.hausandhaus.com/new-developments/why-off-plan-in-dubai']
    def parse(self, response ):
        items=HauswhyoffplanItem()
        titleHome=response.css("h1.h2::text").get().replace("\n","").replace("\t","")
        descriptionHome=response.css("div.article-head p::text").get()
        title_choose_haus= response.css("section.section-off-plan-service.animate-right h2::text").get()
        list_choose_haus= response.css("section.section-off-plan-service.animate-right p::text").extract()
        # article=BeautifulSoup(response.css("section.off-plan-article-content.js-animate-left p").extract(),"lxml").text.replace("\n","").replace("\t","").replace("  ","")
        # developers_overview=BeautifulSoup(response.css("section.section-off-plan-logos.animate-right div.container").extract(),"lxml").text.replace("\n","").replace("\t","").replace("  ","")
        
       
        items["titleHome"]=titleHome
        items["descriptionHome"]=descriptionHome
        items["title_choose_haus"]=title_choose_haus
        items["list_choose_haus"]=list_choose_haus
        # items["article"]=article
        # items["developers_overview"]=developers_overview
        yield items