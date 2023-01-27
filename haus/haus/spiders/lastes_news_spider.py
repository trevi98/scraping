import scrapy
from ..items import HausLastesNewsItem
import uuid
from .helpers import methods
from .file_downloader import img_downloader
from .helpers2 import methods2
from bs4 import BeautifulSoup
import requests


class HausspiderSpider(scrapy.Spider):
    name = 'hausLastesNewsspider'
    start_urls = ['https://www.hausandhaus.com/latest-news?start=1']
    link=""
    page_number=13

    def parse(self,response):
        all = response.css("div.container-fluid.news-page div.row.blog-news div.infinite-container.blog-news-items.equalize-items div.col-lg-3.col-md-4.col-sm-6.infinite-item.news-article.js-animate-bottom div.card-image a::attr('href')").extract()

        for one in all:
            self.link = one
            yield response.follow('https://www.hausandhaus.com/'+one,callback = self.page)

        next_page = f"https://www.hausandhaus.com/latest-news?start={self.page_number}/"
        if next_page is not None and self.page_number < 325:
            print("next_page",next_page)
            self.page_number +=13
            yield response.follow(next_page,callback = self.parse)
        else:
            # pass
            data = {'message': 'driven offplan villa done'}
            # response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = HausLastesNewsItem()
        signature = uuid.uuid1()

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
        overview=response.css("div.article-head div.introtext.row.js-animate-right div.col-sm-12 p::text").get()
        all_descriptions=""
        description=response.css("div.article-body.remove-border.js-animate-left div.article-entry div.row div.col-sm-6 p").extract()
        for i in range(len(description)):
            one=BeautifulSoup(description[i],"lxml").text
            all_descriptions+=one
            
        items['title'] = title
        items['description'] = all_descriptions
        items['overview'] = overview


        yield items

