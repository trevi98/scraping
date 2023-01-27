import scrapy
from ..items import bitcoinItem
import requests
from bs4 import BeautifulSoup
import uuid
from .file_downloader import img_downloader
from .helpers2 import methods2
from .helpers import methods




class testingSpider(scrapy.Spider):
    name = 'bitcoin'
    start_urls = ["https://www.binayah.com/how-to-get-residence-visa-in-dubai/"]
    page_number = 2
    link = ""


    def parse(self,response):
        # items = TestscrapyItem()
        items = bitcoinItem()        
        subtitles= response.css("h2.elementor-heading-title.elementor-size-default::text").extract()
        subtitles.remove("Make Dubai your new investment home")
        subtitles.remove("Want to get residence visa in Dubai?")
        subtitles.remove("What are the types of property visas available in Dubai? ")
        subtitles.remove("The transaction process consists of three different stages")
        soup_add= response.css("div.elementor-container.elementor-column-gap-default div.elementor-column.elementor-col-50.elementor-inner-column.elementor-element").extract()
        add=""
        for i in soup_add:
            one=BeautifulSoup(i,"lxml").text.replace("\n","").replace("\t","").replace("  ","")
            add+=one
        description=response.css("div.elementor-element.elementor-widget.elementor-widget-text-editor div.elementor-widget-container").extract()
        all_descriptions=[]
        for i in description:
            one=BeautifulSoup(i,"lxml").text.replace("\n","").replace("\t","").replace("\r","").replace("  ","")
            if description.index(i)==len(description)-1:
                one+=add
            all_descriptions.append(one)
        titles_description=[]
        for i in range(len(subtitles)):
            titles_description.append({subtitles[i]:all_descriptions[i]})
        answers=response.css("div.elementor-tab-content.elementor-clearfix").extract()
        questions=response.css("section.elementor-section a.elementor-accordion-title::text").extract()
        questions_answers=[]    
        for i in range(len(questions)):
            questions_answers.append({questions[i]:BeautifulSoup(answers[i],"lxml").text.replace("\n","").replace("\t","").replace("  ","")})
        items['titles_description'] = titles_description
        items['questions_answers'] = questions_answers
        yield items


