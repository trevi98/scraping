import scrapy
from ..items import HausBlogInformationsItem
from .helpers import methods
from .file_downloader import img_downloader
from .helpers2 import methods2
from bs4 import BeautifulSoup
import requests


class HausspiderSpider(scrapy.Spider):
    name = 'hausBlogInformationspider'
    start_urls = ['https://www.hausandhaus.com/living-in-dubai/legal-information?start=1']
    link=""
    page_number=6

   

    def parse(self,response):
        all = response.css("div.row.blog-news div.col-sm-12.col-md-8.infinite-container.blog-news-items.equalize-items div.infinite-item.news-article.js-animate-bottom div.row div.col-sm-8.col-xs-8.item-contents a::attr('href')").extract()
        for one in all:
            self.link = one
            yield response.follow('https://www.hausandhaus.com/'+one,callback = self.page)
   
        next_page = f"https://www.hausandhaus.com/living-in-dubai/legal-information?start={self.page_number}/"
        if next_page is not None and self.page_number < 18:
            self.page_number +=6
            yield response.follow(next_page,callback = self.parse)
        else:
            # pass
            data = {'message': 'driven offplan villa done'}
            response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = HausBlogInformationsItem()

        title = "N/A"
        description = "N/A"
        bedrooms = "N/A"
        developer = "N/A"
        area = "N/A"
        price = "N/A"
        near_by_places = "N/A"
        payment_plan = "N/A"
        location = "N/A"
        amentities = "N/A"
        unit_sizes = []
        video = "N/A"
        images = "N/A"
        title=response.css("div.article-head h1::text").get().replace("\n","").replace("  ","")
        all_overview=""
        overview =response.css("div.article-head div.introtext.row.js-animate-right div.col-sm-12 p").extract()
        for i in range(len(overview)):
            one=BeautifulSoup(overview[i],"lxml").text
            all_overview+=one
        all_description=""
        description=response.css("div.article-entry div.row div.col-sm-6 p").extract()
        for i in range(len(description)-1):
                one=BeautifulSoup(description[i],"lxml").text
                all_description+=one

    


        items['title'] = title        
        items['description'] = all_description
        items['overview'] = all_overview
        


        yield items
       

