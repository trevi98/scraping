import scrapy
from ..items import HausOffPlanItem
import uuid
from .helpers import methods
from .file_downloader import img_downloader
from .helpers2 import methods2
from bs4 import BeautifulSoup
import requests


class HausspiderSpider(scrapy.Spider):
    name = 'offplan'
    start_urls = ['https://www.hausandhaus.com/new-developments/developments-of-properties-in-dubai']
    link=""
    page_number=2

    def parse(self,response):
        all = response.css("div.card.card-primary.property.results-property div.col-sm-6.col-xs-12.card-content.box.box-2 div.content-wrapper a.btn.btn-black.btn-details.btn-animate::attr('href')").extract()


        for one in all:
            self.link = one
            yield response.follow('https://www.hausandhaus.com/'+one,callback = self.page)

        next_page = f"https://www.hausandhaus.com/new-developments/developments-of-properties-in-dubai/page-{self.page_number}/"
        if next_page is not None and self.page_number <23:
            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)
        else:
            # pass
            data = {'message': 'machine 2 | haus all done (;'}
            # response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = HausOffPlanItem()
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
        images=response.css("section.section-developments-details div.section-body div.section-slider div.container div.prop-slider-wrapper.prop-slider div.slider.slider-developments-details").get()
        title = response.css("div.intro-content div.titile::text").get().replace("\n","").replace("  ","")
        try:
            overview=response.css("div.main section.section-developments-details div.section-body section.section-header div.container header p.lead::text").get().replace("\n","").replace("  ","").replace("\r","").replace("\t","")
        except:
            overview="N/A"    
        try:
            brochure_link=response.css("div.main section.section-developments-details div.section-body section.section-header div.container header div.btn-group a::attr('href')")[1].get()
            brochure=img_downloader.download(brochure_link,signature,99)
        except:
            brochure="N/A"    
        try:
            floorplan_link=response.css("ul.list-inline.btnulli li a::attr('href')")[2].get()
            floorplan=img_downloader.download(floorplan_link,signature,99)
        except:
            floorplan="N/A"
        try:        
            location=response.css("div.main section.section-developments-details div.section-body section.section-header div.container section.details.clearfix div.row.wrapper div.col-xs-12.contents div.item-details div.item-location::text").get().replace("\n","").replace("  ","")
        except:
            location="N/A"
        try:        
            developer=response.css("div.main section.section-developments-details div.section-body section.section-header div.container section.details.clearfix div.row.wrapper div.col-xs-12.contents div.item-details div.item-developer::text").get().replace("\n","").replace("  ","")
        except:
            developer="N/A"
        try:        
            develpment_type=response.css("div.main section.section-developments-details div.section-body section.section-header div.container section.details.clearfix div.row.wrapper div.col-xs-12.contents div.item-details div.item-building::text").get().replace("\n","").replace("  ","")
        except:
            develpment_type="N/A"
        try:        
            completion_date=response.css("div.main section.section-developments-details div.section-body section.section-header div.container section.details.clearfix div.row.wrapper div.col-xs-12.contents div.item-details div.item-date::text").get().replace("\n","").replace("  ","")
        except:
            completion_date="N/A"

        price_name=response.css("div.main section.section-developments-details div.section-body section.section-header div.container section.details.clearfix div.row.wrapper div.col-xs-12.contents div.item-details div.item-price::text").get().replace("\n","").replace("  ","")
        price_number=response.css("div.main section.section-developments-details div.section-body section.section-header div.container section.details.clearfix div.row.wrapper div.col-xs-12.contents div.item-details div.item-price span::text").get()
        try:
            price=price_name+price_number
        except:
            price = price_name
        description=BeautifulSoup(response.css("div.description.col-md-12").get(),"lxml").text.replace("\n","").replace("  ","")
        payments=[]
        key_payments=response.css("section.payment-details.pay-margin-top div.container ul.payment-list.list-inline li strong::text").extract()
        value_payments=response.css("section.payment-details.pay-margin-top div.container ul.payment-list.list-inline li::text").extract()
        for i in range(len(value_payments)):
            payments.append({key_payments[i]:value_payments[i]})
        try: 
            video=response.css("div.embed-video-top iframe::attr('src')").get() 
        except:
            video="N/A"

            
        items['images'] = methods.img_downloader_method_src(images,signature)
        items['title'] = title
        items['overview'] = overview
        items['brochure'] = brochure
        items['location'] = location
        items['developer'] = developer
        items['develpment_type'] = develpment_type
        items['completion_date'] = completion_date
        items['signature'] = signature
        items['price'] = price
        items['description'] = description
        items['payments'] = payments
        items['video'] = video
        items['floorplan'] = floorplan
        yield items

