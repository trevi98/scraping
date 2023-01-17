import scrapy
from ..items import HausOffPlanItem
import uuid
from .helpers import methods
from .file_downloader import img_downloader
from .helpers2 import methods2
from bs4 import BeautifulSoup
import requests


class HausspiderSpider(scrapy.Spider):
    name = 'hausspider'
    start_urls = ['https://www.hausandhaus.com/new-developments/developments-of-properties-in-dubai']
    link=""
    page_number=2

    def parse(self,response):
        all = response.css("div.card.card-primary.property.results-property div.col-sm-6.col-xs-12.card-content.box.box-2 div.content-wrapper a.btn.btn-black.btn-details.btn-animate::attr('href')").extract()

        for one in all:
            self.link = one
            yield response.follow('https://www.hausandhaus.com/'+one,callback = self.page)

        next_page = f"https://www.hausandhaus.com/new-developments/developments-of-properties-in-dubai/page-{self.page_number}/"
        if next_page is not None and self.page_number < 6:
            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)
        else:
            # pass
            data = {'message': 'driven offplan villa done'}
            response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
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
        title = response.css("div.intro-content div.titile::text").get()
        overview=response.css("div.main section.section-developments-details div.section-body section.section-header div.container header div.heading h2::text").get()
        brochure_link=response.css("div.main section.section-developments-details div.section-body section.section-header div.container header div.btn-group a::attr('href')")[1].get()
        brochure=img_downloader.download(brochure_link,signature,99)
        location=response.css("div.main section.section-developments-details div.section-body section.section-header div.container section.details.clearfix div.row.wrapper div.col-xs-12.contents div.item-details div.item-location::text").get()
        developer=response.css("div.main section.section-developments-details div.section-body section.section-header div.container section.details.clearfix div.row.wrapper div.col-xs-12.contents div.item-details div.item-developer::text").get()
        develpment_type=response.css("div.main section.section-developments-details div.section-body section.section-header div.container section.details.clearfix div.row.wrapper div.col-xs-12.contents div.item-details div.item-building::text").get()
        completion_date=response.css("div.main section.section-developments-details div.section-body section.section-header div.container section.details.clearfix div.row.wrapper div.col-xs-12.contents div.item-details div.item-date::text").get()
        price=response.css("div.main section.section-developments-details div.section-body section.section-header div.container section.details.clearfix div.row.wrapper div.col-xs-12.contents div.item-details div.item-price::text").get()
        description_details =response.css("div.section-description div.container div.description.col-md-12 div.item-description div.col-md-6 p::text").extract()
        description =response.css("div.section-description div.container div.description.col-md-12 div.item-description div.col-md-6 strong::text").extract()
        if "Amenities" in description:
            description.remove("Amenities")
        for i in range(len(description)-1):
            description[i]+=description_details[i]
        description=','.join([str(i) for i in description]).replace("\n","")
        payments=[]
        key_payments=response.css("section.payment-details.pay-margin-top div.container ul.payment-list.list-inline li strong::text").extract()
        for i in range(len(key_payments)-1):
            key_payments[i]=key_payments[i].split()[-1]
        value_payments=response.css("section.payment-details.pay-margin-top div.container ul.payment-list.list-inline li::text").extract()
        for i in range(len(value_payments)-1):
            payments.append({key_payments[i]:value_payments[i]})     

       
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


        yield items

