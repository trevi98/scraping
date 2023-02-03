import scrapy
from ..items import MetropolitanbuyItem
import requests
from bs4 import BeautifulSoup
from .helpers import methods
from .file_downloader import img_downloader
import uuid


class testingSpider(scrapy.Spider):
    name = 'buy'
    start_urls = ["https://metropolitan.realestate/buy/"]
    page_number = 2


    def parse(self,response):
        # items = TestscrapyItem()
        all =response.css("div.property__listing-page a.listing-title-link::attr(href)").extract()

        for one in all:
            yield response.follow(one,callback = self.page)

        next_page = f"https://metropolitan.realestate/buy/page/{self.page_number}/"
        if next_page is not None and self.page_number < 1:
            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)
        else:
            # pass
            data = {'message': 'metro buy done'}
            # response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = MetropolitanbuyItem()
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

        images= response.css("div.modal__gallery-grid").get()
        title=response.css("div.main-info__col.main-info__col_left div.main-info__title-wrap h1::text").get().replace("\n","")
        location=response.css("div.main-info__col.main-info__col_left div.main-info__location-wrap.info-location a::text").get()
        price=response.css("div.main-info__col.main-info__col_left div.main-info__price-wrap.info-price div.info-price__col.info-price__col_price span::text").get()
        try:
            price_per_sqft=response.css("div.main-info__col.main-info__col_left div.main-info__price-wrap.info-price div.info-price__col.info-price__col_price span.info-price__value-per-sq::text").get()
        except:
            price_per_sqft="N/A"  
        developer=response.css("div.contact-agent__card div.contact-agent__info p.contact-agent__info-name.user::text").get()
        information_value=response.css("div.main-info__details-wrap.info-details div.info-details__row div.info-details__col div.info-details__text-icon span::text").extract()
        information_key=response.css("div.main-info__details-wrap.info-details div.info-details__row div.info-details__col div.info-details__caption  span::text").extract()
        information=[]
        for i in range(len(information_key)):
            information.append({information_key[i]:information_value[i]})
        soup_details=response.css("div.main-info__writeup").extract()
        details=[]
        for i in soup_details:
            one=BeautifulSoup(i,"lxml").text.replace("\n","").replace("\t","").replace("  ","")
            details.append(one)
        project_details=response.css("div.project-details__table.project-table table td::text").extract()
        all_project_details=[]
        i = 0
        while i < len(project_details):
          all_project_details.append({project_details[i]:project_details[i+1]})
          i += 2
        amentities_value= response.css("div.facilities__lists div.facilities__item ul.facilities__item-list.list-facilities").extract()
        amentities_key=response.css("div.facilities__lists div.facilities__item h3::text").extract()
        amentities=[]
        for i in range(len(amentities_key)):
            one=BeautifulSoup(amentities_value[i],"lxml").text.replace("\n","").replace("  ","")
            amentities.append({amentities_key[i]:one})



        
        items['images'] = methods.img_downloader_method_src(images,signature)
        items['signature'] = signature
        items['details'] = details
        items['title'] = title
        items['location'] = location
        items['price'] = price
        items['price_per_sqft'] = price_per_sqft
        items['project_details'] = all_project_details
        items['amentities'] = amentities
        items['developer'] = developer
        items['information'] = information
        yield items


   
