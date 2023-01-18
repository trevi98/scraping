import scrapy
from ..items import HausAreaQuidesItem
import uuid
from .helpers import methods
from .file_downloader import img_downloader
from .helpers2 import methods2
from bs4 import BeautifulSoup
import requests


class HausspiderSpider(scrapy.Spider):
    name = 'area'
    start_urls = ['https://www.hausandhaus.com/living-in-dubai/area-guides?start=1']
    link=""
    page_number=10

    def parse(self,response):
        all = response.css("div.category-items div.container div.card-wrapper.infinite-item div.areaguide-item.card.card-secondary-alt.col-xs-12.col-md-6.js-animate-bottom div.card-image.image-hover-zoom a::attr('href')").extract()

        for one in all:
            self.link = one
            yield response.follow('https://www.hausandhaus.com/'+one,callback = self.page)

        next_page = f"https://www.hausandhaus.com/property-sales/properties-available-for-sale-in-dubai/page-{self.page_number}/"
        if next_page is not None and self.page_number < 20:
            print("next_page",next_page)
            self.page_number +=10
            yield response.follow(next_page,callback = self.parse)
        else:
            # pass
            data = {'message': 'machine 2 | haus areae done (;'}
            response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = HausAreaQuidesItem()
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
        title = response.css("div.intro-content h1::text").get().replace("\n","").replace("  ","")
        about = response.css(" div.article-head div.introtext.row.js-animate-right div.col-sm-12 p::text").get().replace("\n","").replace("  ","")
        soup=response.css(" div.article-entry div.row div.col-sm-6 p").extract()
        description=[]
        for i in range(len(soup)):
            one=BeautifulSoup(soup[i],"lxml").text.replace("\n","").replace("  ","")
            description.append(one)
    
        items['title'] = title
        items['about'] = about
        items['description'] = description
        yield items

