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
        all_article=""
        soup_article=response.css("section.off-plan-article-content.js-animate-left p").extract()
        for i in range(len(soup_article)):
            one=BeautifulSoup(soup_article[i],"lxml").text.replace("\n","").replace("\t","").replace("  ","")
            all_article+=one
        all_developers_overview=""
        soup_developers_overview=response.css("section.section-off-plan-logos.animate-right div.container").extract()
        for i in range(len(soup_developers_overview)):
            one= BeautifulSoup(soup_developers_overview[i],"lxml").text.replace("\n","").replace("\t","").replace("  ","")
            all_developers_overview+=one       
       
        items["titleHome"]=titleHome
        items["descriptionHome"]=descriptionHome
        items["title_choose_haus"]=title_choose_haus
        items["list_choose_haus"]=list_choose_haus
        items["article"]=all_article
        items["developers_overview"]=all_developers_overview
        yield items
        data = {'message': 'machine 1 | whyoffpllan (;'}
        response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)