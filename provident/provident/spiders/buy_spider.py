import scrapy
from ..items import ProvBuyItem
import uuid
from .helpers import methods
from .file_downloader import img_downloader
from .helpers2 import methods2
from bs4 import BeautifulSoup
import requests


class HausspiderSpider(scrapy.Spider):
    name = 'buy'
    start_urls = ['https://www.providentestate.com/all-properties-for-sale.html']
    link=""
    page_number=2

    def parse(self,response):
        all =response.css("div.iw-property-content.grid-1 div.content-top a::attr('href')").extract()

        for one in all:
            self.link = one
            yield response.follow(one,callback = self.page)

        next_page = f"https://www.providentestate.com/all-properties-for-sale.html/page/{self.page_number}/"
        if next_page is not None and self.page_number <101:
            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)
        else:
            # pass
            data = {'message': 'prov buy (;'}
            # response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = ProvBuyItem()
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

        # images=methods.img_downloader_method_src(response.css("div.iwp-flexslider").get(),signature)
        try:
            type=''.join(response.css("div.iwp-item.supt::text").extract()).replace("\n","").replace("  ","") 
        except:
            type="N/A"    
        title=response.css("div.page-title div.iw-heading-title h1::text").get()
        try:
            location=response.css("div.page-title div.iw-heading-title h2 span::text").get().split('in')[-1].replace("  ","")
        except:
            location="N/A"  
        try:      
            price=response.css("div.property-price  div::text").get().replace("\n","").replace("\t","")
        except:
            price=self.link    
        developer=response.css("aside#iwp-property-author-infomation-2 div.agent-info .agent-name::text").get()
        property_details=[]
        property_value=response.css("div.iwp-single-property-detail div.iwp-property-block-content div.row div.col-sm-6.col-xs-12.col-lg-6.col-md-6 div.iwp-items div.iwp-item").extract()
        for i in range(len(property_value)):
            one=BeautifulSoup(property_value[i],"lxml").text.replace("\n","").replace("  ","")
            property_details.append(one)
        try:    
            soup_description=response.css("div.iwp-single-property-description").get()
        except:
            soup_description="hassan"+self.link    
        description=BeautifulSoup(soup_description,"lxml").text.replace("\n","").replace("  ","")
        features=response.css("div.iwp-single-property-features div.iwp-property-block-content ul li::text").extract()  

       
        # items['images'] = images
        items['title'] = title
        items['type'] = type
        items['location'] = location
        items['price'] = price
        items['developer'] = developer
        items['property'] = property_details
        items['signature'] = signature
        items['description'] = description
        items['features'] = features
        yield items

