import scrapy
from ..items import expoItem
import requests
from bs4 import BeautifulSoup
import uuid
from .file_downloader import img_downloader
from .helpers2 import methods2
from .helpers import methods
import json 



class testingSpider(scrapy.Spider):
    name = 'expo'
    start_urls = ["https://www.binayah.com/expo-2020-dubai/"]
    page_number = 2
    link = ""


    def parse(self,response):
        # items = TestscrapyItem()
        items = expoItem()
        title=response.css("div.elementor-element.elementor-element-86d0dea.elementor-widget.elementor-widget-heading h1::text").get()
        description=''.join(response.css("div.elementor-element.elementor-element-fc7121d.elementor-widget.elementor-widget-text-editor p::text").extract())
        
        questions= response.css("h2.elementor-heading-title.elementor-size-default::text").extract()
        questions.remove("Virtual Tour To Expo 2020 Dubai")
        questions.remove("Want to invest your Bitcoins in Dubai Real Estate?")
        answers=response.css("div.elementor-element.elementor-widget.elementor-widget-text-editor div.elementor-widget-container").extract()
        del answers[0]
        del answers[4]
        del answers[5]
        all_answers=[]
        for i in answers:
            one=BeautifulSoup(i,"lxml").text.replace("\n","").replace("\t","").replace("\r","").replace("  ","")
            all_answers.append(one)
        questions_answers=[]
        for i in range(len(questions)-1):
            questions_answers.append({questions[i]:all_answers[i]})
        questions2=response.css("h3 span::text").extract()
        answers2=response.css("p.elementor-icon-box-description::text").extract()
        for i in range(len(questions2)-1):
            questions_answers.append({questions2[i].replace("\n",""):answers2[i]})    
        items['qustions_answers'] = questions_answers
        items['title'] = title
        items['description'] = description
        yield items


