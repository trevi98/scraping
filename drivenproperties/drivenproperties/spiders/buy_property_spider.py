import scrapy
from ..items import BuyItem
import requests
from bs4 import BeautifulSoup
from .helpers import methods
from .helpers2 import methods2
from .file_downloader import img_downloader
import uuid


class testingSpider(scrapy.Spider):
    name = 'buy'
    start_urls = ["https://www.drivenproperties.com/dubai/properties-for-sale?page=1"]
    page_number = 2
    link = ""


    def parse(self,response):
        # items = TestscrapyItem()
        all = response.css(".col-xl-5.col-lg-5.col-md-5.col-sm-5.col-12.dpx-property-status-tag a::attr(href)").extract()

        for one in all:
            self.link = one
            yield response.follow(one,callback = self.page)

        next_page = f"https://www.drivenproperties.com/dubai/properties-for-sale?page={self.page_number}/"
        if next_page is not None and self.page_number < 129:
            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)
        else:
            # pass
            data = {'message': 'driven all done'}
            response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = BuyItem()
        signature = uuid.uuid1()

        title = "N/A"
        type = "N\A"
        description = "N/A"
        bedrooms = "N/A"
        developer = "N/A"
        area = "N/A"
        price = "N/A"
        amentities = "N/A"
        video = "N/A"
        images = "N/A"
        title = response.css("h2.dpx-headings::text").get().replace("\n","")
        type = response.css(".dpx-headings-2.dpx-headings-2j::text").get().split(" ",1)[0].replace("\n","")
        try:
            area = response.css(".dpx-headings-2.dpx-headings-2j::text").get().split("-",1)[1].replace("\n","")
        except:
            area = "N\A"
        prop_info = response.css("ul.nav.nav-pills.nav-justified.dpx-listings-detail-facts div").extract()
        prop_info = methods2.get_text_from_same_element_multiple_and_seperate_to_custom_key_value(prop_info,{"keys":{"AED":"price","Bed":"bedrooms","Bath":"bathrooms","Sq.Ft.":"size"}})

        amentities = response.css(".dpx-content-block.dpx-listings-detail-overview .row div span::text").extract()
        description = response.css(".dpx-listings-detail-content").get()
        description = BeautifulSoup(description,'lxml').text.replace("\n","").replace("  ","")
        
        # description = soup.find_all('p')
       
        images = methods.img_downloader_method_src(response.css(".carousel-inner").get(),signature)

        items['title'] = title
        items['type'] = type
        items['price'] = prop_info['price']
        items['size'] = prop_info['size']
        items['bedrooms'] = prop_info['bedrooms']
        items['bathrooms'] = prop_info['bathrooms']
        items['signature'] = signature
        items['description'] = description
        items['area'] = area
        items['images'] = images
        items['amentities'] = amentities
        # items['images'] = images
        # items['payment_plan'] = payment_plan
        # items['location'] = location
        # items['near_by_places'] = near_by_places
        # items['unit_sizes'] = unit_sizes
        yield items


    def get_text(self,elmnt):
        soup = BeautifulSoup(elmnt,'lxml')
        return soup.get_text()
