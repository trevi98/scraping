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
        for i in range(len(questions)):
            all.append({BeautifulSoup(questions[i],"lxml").text.replace("\n","").replace("  ",""):BeautifulSoup(answers[i],"lxml").text.replace("\n","").replace("  ","")})
        soup_titles=response.css("div.elementor-widget-heading div.elementor-widget-container").extract()
        sub_titles=[]
        for i in soup_titles: 
            one=BeautifulSoup(i,"lxml").text.replace("\n","").replace("  ","")
            sub_titles.append(one)
        content=""
        content_soup=response.css("div.elementor-widget-text-editor").extract()
        for i in content_soup:  
            one=BeautifulSoup(i,"lxml").text.replace("\n","").replace("  ","")
            content+=one  

        items['qustions_answers'] = all
        items['titles'] = sub_titles
        items['content'] = content
        yield items


