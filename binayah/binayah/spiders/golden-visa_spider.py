import scrapy
from ..items import goldenItem
import requests
from bs4 import BeautifulSoup
import uuid
from .file_downloader import img_downloader
from .helpers2 import methods2
from .helpers import methods




class testingSpider(scrapy.Spider):
    name = 'golden'
    start_urls = ["https://www.binayah.com/golden-visa-dubai/"]
    page_number = 2
    link = ""


    def parse(self,response):
        # items = TestscrapyItem()
        items = goldenItem()
        questions= response.css("section.elementor-section.elementor-top-section.elementor-element.elementor-element-89dd289.elementor-section-boxed.elementor-section-height-default.elementor-section-height-default a.elementor-accordion-title").extract()
        answers=response.css("section.elementor-section.elementor-top-section.elementor-element.elementor-element-89dd289.elementor-section-boxed.elementor-section-height-default.elementor-section-height-default div.elementor-tab-content.elementor-clearfix").extract()
        all=[]
        for i in range(len(questions)):
             all.append({BeautifulSoup(questions[i],"lxml").text.replace("\n","").replace("  ",""):BeautifulSoup(answers[i],"lxml").text.replace("\n","").replace("  ","")})
        titles=response.css("section h2::text").extract()
        content=response.css("section p::text").extract()     

        items['qustions_answers'] = all
        items['titles'] = titles
        items['content'] = content
        yield items


