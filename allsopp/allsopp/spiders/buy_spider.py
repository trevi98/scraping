import scrapy
from ..items import BuyplanItem
import requests
from bs4 import BeautifulSoup
from .helpers import methods
from .helpers2 import methods2
from .file_downloader import img_downloader
import uuid
import json


class testingSpider(scrapy.Spider):
    name = 'buy'
    start_urls = ["https://api.allsoppandallsopp.com/dubai/properties/residential/sales/page-1"]
    page_number = 2
    link = ""


    def parse(self,response):
        # items = TestscrapyItem()
        # links = response.css(".results_cards .lazyload-wrapper .results_card_desc div a::attr(href)").extract()
        res = json.loads(response.text)
        all = []
        for i in res['data']['hits']:
            all.append(i['fields']['pba__broker_s_listing_id__c'])
            

        for one in all:
            self.link = one
            yield response.follow("https://api.allsoppandallsopp.com/dubai/property/sales/"+one[0],callback = self.page)

        next_page = f"https://api.allsoppandallsopp.com/dubai/properties/residential/sales/page-{self.page_number}/"
        if next_page is not None and self.page_number < 99:
            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)

        else:
            # pass
            data = {'message': 'allsop buy done (;'}
            response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = BuyplanItem()
        # title = response.css(".project-header__title::text").get()
        # elmnts = response.css('li.as_lits-item').extract()
        signature = uuid.uuid1()
        res = json.loads(response.text)


        # title = "N/A"
        # description = "N/A"
        # bedrooms = "N/A"
        # developer = "N/A"
        # area = "N/A"
        # price = "N/A"
        # near_by_places = "N/A"
        # payment_plan = "N/A"
        # location = "N/A"
        # amentities = "N/A"
        # unit_sizes = []
        # video = "N/A"
        # images = "N/A"
        title = str(res['data']['listingDetails']['hits']['hits'][0]['fields']['name'][0]).replace("\n","").replace("  ","")
        description = str(res['data']['listingDetails']['hits']['hits'][0]['fields']['pba__description_pb__c'][0]).replace("\n","").replace("  ","")
        bathrooms = str(res['data']['listingDetails']['hits']['hits'][0]['fields']['pba__fullbathrooms_pb__c'][0]).replace("\n","").replace("  ","")
        lot_size = str(res['data']['listingDetails']['hits']['hits'][0]['fields']['pba__lotsize_pb__c'][0]).replace("\n","").replace("  ","")
        category = str(res['data']['listingDetails']['hits']['hits'][0]['fields']['business_type_aa__c'][0]).replace("\n","").replace("  ","")
        amentities = str(res['data']['listingDetails']['hits']['hits'][0]['fields']['pba_uaefields__private_amenities__c'][0]).replace("\n","").replace("  ","")
        area = str(res['data']['listingDetails']['hits']['hits'][0]['fields']['listing_area'][0]).replace("\n","").replace("  ","")
        price = str(res['data']['listingDetails']['hits']['hits'][0]['fields']['pba__listingprice_pb__c'][0]).replace("\n","").replace("  ","")
        # text = response.css(".col-xl-12.col-lg-12.col-md-12.col-sm-12.col-12 .dpx-area-white.dpx-content-area.dpx-content-area-padding p::text").extract()
        # description = ''.join(text).replace("\n","")
        # highlights_keys = ['price','developer','area','bedrooms']
        # highlights = methods2.get_text_from_same_element_multiple_and_seperate_to_key_value(response.css(".col-xl-12.col-lg-12.col-md-12.col-sm-12.col-12 .dpx-area-white.dpx-content-area.dpx-content-area-padding ul li").extract(),{'keys':["Bedrooms",'Developer','Area','Price']})

        # for key in highlights_keys:
        #     if key not in highlights.keys():
        #         highlights[key] = ""

        # amentities = methods2.get_text_as_list_form_simeler_elmnts(response.css(".dpx-project-amenities .col-xl-2.col-lg-2.col-md-2.col-sm-2.col-6").extract())
        # images = methods.img_downloader_method_src(response.css(".carousel-inner").get(),signature)

        # payment_plan = methods2.get_text_as_list_form_simeler_elmnts(response.css(".dpx-project-payment-section.dpx-area-white.dpx-content-area.dpx-content-area-padding .col-xl-3.col-lg-3.col-md-3.col-sm-3.col-12").extract())
        # location = response.css(".dpx-project-privileged-location-area p::text").get()
        # near_by_places = methods2.get_text_as_list_form_simeler_elmnts(response.css(".dpx-project-privileged-location-area td").extract())
        # if len(near_by_places) == 0:
        #     near_by_places = methods2.get_text_as_list_form_simeler_elmnts(response.css(".dpx-project-privileged-location-area ul li").extract())
        # try:
        #     table = response.css(".dpx-project-unit-sizes- tr").extract()
        #     for row in table:
        #         soup = BeautifulSoup(row,'lxml')
        #         tds = soup.find_all('td')
        #         unit_sizes.append({'bedrooms':tds[0].text.replace("\n",""),'size':tds[1].text.replace("\n",""),'price':tds[2].text.replace("\n","")})
        # except:
        #     unit_sizes = "N\A"
        # # description = soup.find_all('p')
       
        # # images = methods.img_downloader_method(elmnt,signature)

        items['title'] = title
        items['description'] = description
        items['bathrooms'] = bathrooms
        items['lot_size'] = lot_size
        items['category'] = category
        items['amentities'] = amentities
        items['area'] = area
        items['price'] = price


        yield items

