import scrapy
from ..items import developersItem
import requests
from bs4 import BeautifulSoup
from .helpers import methods
from .helpers2 import methods2
from .file_downloader import img_downloader
import uuid


class testingSpider(scrapy.Spider):
    name = 'developers'
    start_urls = ["https://www.drivenproperties.com/dubai/real-estate-developers"]
    page_number = 2
    link = ""


    def parse(self,response):
        # items = TestscrapyItem()
        all =response.css("main.dpx-main div.col-xl-6.col-lg-6.col-md-6.col-sm-6.col-12 a::attr('href')").extract()

        for one in all:
            self.link = one
            yield response.follow('https://www.drivenproperties.com/'+one,callback = self.page)

        next_page = f"https://www.drivenproperties.com/dubai/real-estate-developers?page={self.page_number}/"
        if next_page is not None and self.page_number < 1:
            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)
        else:
            # pass
            data = {'message': 'driven developers done'}
            # response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = developersItem()
        title = response.css(".project-header__title::text").get()
        elmnts = response.css('li.as_lits-item').extract()
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
        year_ceo=''.join(response.css("div.dpx-developer-vdo div.col-xl-4.col-lg-4.col-md-4.col-sm-4.col-12 div.dpx-developer-summery p::text")[0].get().split(":")).strip()
        name_ceo=''.join(response.css("div.dpx-developer-vdo div.col-xl-4.col-lg-4.col-md-4.col-sm-4.col-12 div.dpx-developer-summery p::text")[1].get().split(":")).strip()
        ceo=[]
        ceo.append({name_ceo:year_ceo})
        soup_about=BeautifulSoup(response.css("div.dpx-developer-body-content").get(),"lxml").text.replace("\n","").replace("\t","").replace("  ","")
        # about=""
        # for i in soup_about:
        #     one=BeautifulSoup(i,"lxml").text.replace("\n","").replace("\t","").replace("  ","")
        #     about+=one

        items['about'] = soup_about
        items['CEO'] = ceo


        yield items

