import scrapy
from ..items import land_saleItem
import requests
from bs4 import BeautifulSoup
import uuid
from .file_downloader import img_downloader
from .helpers2 import methods2
from .helpers import methods
import json 



class testingSpider(scrapy.Spider):
    name = 'land_sale'
    start_urls = ["https://www.binayah.com/land-for-sale-in-dubai-uae/"]
    page_number = 2
    link = ""


    def parse(self,response):
        # items = TestscrapyItem()
        all = response.css("div.item-body ul.item-amenities.item-amenities-with-icons ~  a::attr('href')").extract()

        for one in all:
            self.link = one
            yield response.follow(one,callback = self.page)

        next_page = f"https://www.binayah.com/land-for-sale-in-dubai-uae/{self.page_number}/"
        if next_page is not None and self.page_number < 1:
            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)
        else:
            # pass
            data = {'message': 'binaya land_sale done'}
            response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = land_saleItem()
        signature = uuid.uuid1()
        title="N/A"
        location="N/A"
        price="N/A"
        amenities="N/A"
        category="N/A"
        images="N/A"
        floor_plan_2d="N/A"
        floor_plan_3d="N/A"
        bedrooms="N/A"
        size="N/A"
        parking="N/A"
        porpuse="N/A"
        developer="N/A"
        bathrooms="N/A"
        area="N/A"
        description="N/A"
        type="N/A"
        
        title=response.css("div.page-title-wrap div.container div.d-flex.align-items-center.property-title-price-wrap div.page-title h1::text").get()
        porpuse=response.css("div.property-labels-wrap a::text").get().replace("\n","")
        type=response.css("div.breadcrumb-wrap nav ol li span::text")[1].get()
        price=response.css("div.page-title-wrap div.container div.d-flex.align-items-center.property-title-price-wrap ul li::text").get()
        location= response.css("div.page-title-wrap div.container address.item-address::text").get()
        description=BeautifulSoup(response.css("div.property-description-wrap.property-section-wrap div.block-wrap div.block-content-wrap").get()).text.replace("\n","").replace("  ","")
        amenities=BeautifulSoup(response.css("div.property-description-wrap.property-section-wrap div.block-wrap div.block-content-wrap p")[-1].get(),"lxml").text.replace("\n","").replace("  ","").replace("\r","").replace("\t","")  
        details_key=response.css("div.detail-wrap ul li strong::text").extract()
        details_value=response.css("div.detail-wrap ul li span::text").extract()
        details=[] 
        for i in range(len(details_key)):
            details.append({details_key[i]+":":details_value[i]})

        
       
        items['title'] =title
        items['price'] = price
        items['location'] = location
        items['description'] = description
        items['amenities'] = amenities
        items['type'] = type
        items['porpuse'] = porpuse
        items['details'] = details
        yield items


