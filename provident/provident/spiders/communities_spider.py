import scrapy
from ..items import HausCoomItem
import uuid
from .helpers import methods
from .file_downloader import img_downloader
from .helpers2 import methods2
from bs4 import BeautifulSoup
import requests


class HausspiderSpider(scrapy.Spider):
    name = 'communities'
    
    start_urls = ['https://www.providentestate.com/dubai-developments.html']
    link=""
    page_number=2

    def parse(self,response):
        all =response.css("div.row.blog-masonry div.element-item.devPage div.post-item.post_bg a::attr('href')").extract()

        for one in all:
            self.link = one
            yield response.follow(one,callback = self.page)

        next_page = f"https://www.providentestate.com/dubai-developments.html/page/{self.page_number}/"
        if next_page is not None and self.page_number <6:
            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)
        else:
            # pass
            data = {'message': 'prov comm done (;'}
            response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = HausCoomItem()
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
        features = "N/A"
        images = "N/A"

        title= response.css("div.col-sm-12.col-xs-12.col-lg-9.col-md-9.container-contentbar h1.development-header::text").get()   
        soup_description=response.css("div.vc_column-inner div.wpb_wrapper div.wpb_text_column.wpb_content_element div.wpb_wrapper").get().replace("\n","")
        description=BeautifulSoup(soup_description,"lxml").text
       

         

       
        items['title'] = title
        items['description'] = description

        yield items

