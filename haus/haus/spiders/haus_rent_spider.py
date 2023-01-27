import scrapy
from ..items import HausRentItem
import uuid
from .helpers import methods
from .file_downloader import img_downloader
from .helpers2 import methods2
from bs4 import BeautifulSoup
import requests


class HausspiderSpider(scrapy.Spider):
    name = 'rent'
    start_urls = ['https://www.hausandhaus.com/property-leasing/properties-available-for-rent-in-dubai']
    link=""
    page_number=2

    def parse(self,response):
        all = response.css("div.properties.map-properties.equalize-items div.col.col-property.col-sm-6.col-xs-6.col-xs-custom.js-animate-bottom div.card.card-white.card-primary.card-property.property.results-property div.card-image div.img-wrapper a::attr('href')").extract()

        for one in all:
            self.link = one
            yield response.follow('https://www.hausandhaus.com/'+one,callback = self.page)

        next_page = f"https://www.hausandhaus.com/property-sales/properties-available-for-sale-in-dubai/page-{self.page_number}/"
        if next_page is not None and self.page_number < 6:
            print("next_page",next_page)
            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)
        else:
            # pass
            data = {'message': 'machine 2 | haus rent done (;'}
            # response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = HausRentItem()
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
        features =response.css("div.main section.section-details.section-details-1 div.section-body.section-body-wrapper div.container div.row.row-wrapper div.col-wrapper div.section-tabs div.tabs-details.slider-multiple-filters div.tab-content div.active.sub-section div.item-features ul li::text").extract()
        bedrooms=response.css("div.main section.section-details.section-details-1 div.section-body.section-body-wrapper div.container div.row.row-wrapper div.col-wrapper ul.list-icons li span::text").get().replace("\n","").replace("  ","")
        bathrooms=response.css("div.main section.section-details.section-details-1 div.section-body.section-body-wrapper div.container div.row.row-wrapper div.col-wrapper ul.list-icons li span::text").extract()[2].replace("\n","").replace("  ","")
        size=response.css("div.main section.section-details.section-details-1 div.section-body.section-body-wrapper div.container div.row.row-wrapper div.col-wrapper ul.list-icons li span::text").extract()[4].replace("\n","").replace("  ","")
        images=response.css("div.section-gallery.js-animate-top").get()
        title = response.css("div.main section.section-details.section-details-1 div.section-body.section-body-wrapper div.container div.row.row-wrapper div.col-wrapper h1.h3.item-heading::text").get().replace("\n","").replace("  ","")
        brochure_link=response.css("div.main section.section-details.section-details-1 div.section-body.section-body-wrapper div.container div.row.row-wrapper div.col-wrapper div.section-tabs div.tabs-details.slider-multiple-filters ul.tabs-list li a::attr('href')")[2].get()
        if "pdf" in brochure_link:
            brochure=img_downloader.download(brochure_link,signature,99)
        else:
            brochure=brochure_link    
        price=response.css("div.main section.section-details.section-details-1 div.section-body.section-body-wrapper div.container div.row.row-wrapper div.col-wrapper h6.item-price::text").get().replace("\n","").replace("  ","")
        overview =response.css("div.main section.section-details.section-details-1 div.section-body.section-body-wrapper div.container div.row.row-wrapper div.col-wrapper div.section-tabs div.tabs-details.slider-multiple-filters div.tab-content div.active.sub-section div.item-intro-text::text").get().replace("\n","").replace("  ","").replace("\r","").replace("\t","")
    


        items['images'] = methods.img_downloader_method_src(images,signature)
        items['title'] = title
        items['bedrooms'] = bedrooms
        items['bathrooms'] = bathrooms
        items['size'] = size
        items['brochure'] = brochure
        items['signature'] = signature
        items['price'] = price
        items['overview'] = overview
        items['features'] = features


        yield items

