import scrapy
from ..items import buyItem
import requests
from bs4 import BeautifulSoup
import uuid
from .file_downloader import img_downloader
from .helpers2 import methods2
from .helpers import methods
import json 



class testingSpider(scrapy.Spider):
    name = 'buy'
    start_urls = ["https://www.binayah.com/dubai-properties-for-sale/"]
    page_number = 2
    link = ""


    def parse(self,response):
        # items = TestscrapyItem()
        all = response.css("div.listing-view.list-view.card-deck div.item-listing-wrap.hz-item-gallery-js.card ul.item-amenities.item-amenities-with-icons ~ a::attr('href')").extract()

        for one in all:
            self.link = one
            yield response.follow(one,callback = self.page)

        next_page = f"https://www.binayah.com/dubai-properties-for-sale/page/{self.page_number}/"
        if next_page is not None and self.page_number < 29:
            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)
        else:
            # pass
            data = {'message': 'binaya buy done'}
            response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = buyItem()
        signature = uuid.uuid1()
        
        title=response.css("div.page-title-wrap div.container div.d-flex.align-items-center.property-title-price-wrap div.page-title h1::text").get()
        price=response.css("div.page-title-wrap div.container div.d-flex.align-items-center.property-title-price-wrap ul li::text").get()
        location= response.css("div.page-title-wrap div.container address.item-address::text").get()
        description=BeautifulSoup(response.css("div.property-description-wrap.property-section-wrap div.block-wrap div.block-content-wrap").get()).text.replace("\n","").replace("  ","")
        id=response.css("div.property-overview-wrap.property-section-wrap div.block-wrap div.block-title-wrap.d-flex.justify-content-between.align-items-center div::text").get()
        property_key=response.css("div.property-overview-wrap.property-section-wrap div.block-wrap div.d-flex.property-overview-data ul li.hz-meta-label::text").extract()
        property_value=response.css("div.property-overview-wrap.property-section-wrap div.block-wrap div.d-flex.property-overview-data ul li strong::text").extract()
        property=[]
        property.append({"Property ID:",id})
        for i in range(len(property_key)-1):
            property.append({property_key[i]+":":property_value[i]})
        

        
       
        items['title'] =title
        items['price'] = price
        items['location'] = location
        items['description'] = description
        items['property'] = property
        yield items


