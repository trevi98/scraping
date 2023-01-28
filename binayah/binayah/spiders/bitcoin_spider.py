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
        description=response.css("div.elementor-element.elementor-widget.elementor-widget-text-editor div.elementor-widget-container").extract()  
        all_descriptions=[]
        for i in description:
            one=BeautifulSoup(i,"lxml").text.replace("\n","").replace("\t","").replace("\r","").replace("  ","")
            all_descriptions.append(one)
        items['description'] = all_descriptions
        items['sub_titles'] = all_descriptions
        
        yield items


