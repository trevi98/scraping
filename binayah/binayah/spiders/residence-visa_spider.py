import scrapy
from ..items import residenceVisaItem
import requests
from bs4 import BeautifulSoup
import uuid
from .file_downloader import img_downloader
from .helpers2 import methods2
from .helpers import methods




class testingSpider(scrapy.Spider):
    name = 'residence-visa'
    start_urls = ["https://www.binayah.com/how-to-get-residence-visa-in-dubai/"]
    page_number = 2
    link = ""


    def parse(self,response):
        # items = TestscrapyItem()
        items = residenceVisaItem()
        title=response.css("div.elementor-element.elementor-element-86d0dea.elementor-widget.elementor-widget-heading h1::text").get()
        description=''.join(response.css("div.elementor-element.elementor-element-fc7121d.elementor-widget.elementor-widget-text-editor p::text").extract())
        
        questions= response.css("h2.elementor-heading-title.elementor-size-default::text").extract()
        questions.remove("Make Dubai your new investment home")
        questions.remove("Want to get residence visa in Dubai?")
        questions.remove("What are the types of property visas available in Dubai? ")
        answers=response.css("div.elementor-element.elementor-widget.elementor-widget-text-editor div.elementor-widget-container").extract()
        answers[4]+=answers[5]
        del answers[0]
        del answers[5]
        all_answers=[]
        for i in answers:
            one=BeautifulSoup(i,"lxml").text.replace("\n","").replace("\t","").replace("\r","").replace("  ","")
            all_answers.append(one)
        questions_answers=[]
        for i in range(len(questions)-1):
            questions_answers.append({questions[i]:all_answers[i]})  
        items['qustions_answers'] = questions_answers
        items['title'] = title
        items['description'] = description
        yield items


