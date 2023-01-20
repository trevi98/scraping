import scrapy
from ..items import ejariItem
import requests
from bs4 import BeautifulSoup
import uuid
from .file_downloader import img_downloader
from .helpers2 import methods2
from .helpers import methods
import json 



class testingSpider(scrapy.Spider):
    name = 'ejari'
    start_urls = ["https://www.binayah.com/what-is-ejari-dubai-online/"]
    page_number = 2
    link = ""


    def parse(self,response):
        # items = TestscrapyItem()
        items = ejariItem()
        questions= response.css("a.elementor-accordion-title").extract()
        answers=response.css("div.elementor-tab-content.elementor-clearfix").extract()
        all=[]
        for i in range(len(questions)-1):
            all.append({BeautifulSoup(questions[i],"lxml").text.replace("\n","").replace("  ",""):BeautifulSoup(answers[i],"lxml").text.replace("\n","").replace("  ","")})
        titles=BeautifulSoup(response.css("div.elementor-widget-heading div.elementor-widget-container").extract(),"lxml").text.replace("\n","").replace("  ","")
        content=BeautifulSoup(response.css("div.elementor-widget-text-editor").extract(),"lxml").text.replace("\n","").replace("  ","")   

        items['qustions_answers'] = all
        items['titles'] = titles
        items['content'] = content
        yield items


