import scrapy
from ..items import luxury_saleItem
import requests
from bs4 import BeautifulSoup
import uuid
from .file_downloader import img_downloader
from .helpers2 import methods2
from .helpers import methods
import json 



class testingSpider(scrapy.Spider):
    name = 'luxury_sale'
    start_urls = ["https://www.binayah.com/dubai/luxury-properties/"]
    page_number = 2
    link = ""


    def parse(self,response):
        # items = TestscrapyItem()
        all = response.css("div.item-body ul.item-amenities.item-amenities-with-icons ~  a::attr('href')").extract()

        for one in all:
            self.link = one
            yield response.follow(one,callback = self.page)

        next_page = f"https://www.binayah.com/dubai/luxury-properties/{self.page_number}/"
        if next_page is not None and self.page_number < 1:
            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)
        else:
            # pass
            data = {'message': 'binaya luxury_sale done'}
            response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = luxury_saleItem()
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
        porpuse="sale"
        developer="N/A"
        bathrooms="N/A"
        area="N/A"
        description="N/A"
        type="N/A"
        
        title=response.css("div.elementor-element.elementor-element-88435ff.elementor-widget.elementor-widget-text-editor p span::text").get()
        type=response.css("div.elementor-element.elementor-element-88435ff.elementor-widget.elementor-widget-text-editor h3 span::text").get()
        try:
            price_number=response.css("div.elementor-element.elementor-element-88435ff.elementor-widget.elementor-widget-text-editor h3")[1].css("span")[1].css("span b::text").get()
            price="AED "+price_number
        except:
            price_number=response.css("div.elementor-element.elementor-element-88435ff.elementor-widget.elementor-widget-text-editor h3")[1].css("span strong::text").get()
            price=price_number    
        project_details=[]
        project_details_key=response.css("section.elementor-section.elementor-inner-section.elementor-element.elementor-element-e24b7d1.elementor-section-boxed.elementor-section-height-default.elementor-section-height-default ul li span strong::text").extract()
        project_details_value=response.css("section.elementor-section.elementor-inner-section.elementor-element.elementor-element-e24b7d1.elementor-section-boxed.elementor-section-height-default.elementor-section-height-default ul li span::text").extract()
        if len(project_details_key)==len(project_details_value):
            for i in range(len(project_details_key)):
                project_details.append({project_details_key[i]:project_details_value[i]})
        else:
            project_details.append({project_details_key:project_details_value})        
        about=BeautifulSoup(response.css("div.elementor-element.elementor-element-192f9cb.elementor-widget.elementor-widget-text-editor").get(),"lxml").text.replace("\n","").replace("  ","").replace("\t","").replace("\r","")
        images=response.css("div.elementor-element.elementor-element-3461482.gallery-spacing-custom.elementor-widget.elementor-widget-image-gallery").get()        
        amenities_description=BeautifulSoup(response.css("div.elementor-element.elementor-element-76cc3b5.elementor-widget.elementor-widget-text-editor").get(),"lxml").text.replace("\n","").replace("  ","").replace("\t","").replace("\r","") 
        amenities=response.css("section.elementor-section.elementor-inner-section.elementor-element.elementor-element-ae774b7.elementor-section-boxed.elementor-section-height-default.elementor-section-height-default ul li::text").extract()
        life_at=BeautifulSoup(response.css("div.elementor-element.elementor-element-a83a448.elementor-widget.elementor-widget-text-editor").get(),"lxml").text.replace("\n","").replace("  ","").replace("\t","").replace("\r","")

        

        
       
        items['images'] =methods.img_downloader_method(images,signature)
        items['title'] =title
        items['price'] = price
        items['project_details'] = project_details
        items['about'] = about
        items['amenities'] = amenities
        items['type'] = type
        items['amenities_description'] = amenities_description
        items['life_at'] = life_at
        items['signature'] = signature
        yield items


