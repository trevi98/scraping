import scrapy
from ..items import OffplanItem
import requests
from bs4 import BeautifulSoup
import uuid
from .file_downloader import img_downloader
from .helpers2 import methods2
from .helpers import methods



class testingSpider(scrapy.Spider):
    name = 'offplan'
    start_urls = ["https://www.binayah.com/off-plan-properties-dubai/"]
    page_number = 2
    link = ""


    def parse(self,response):
        # items = TestscrapyItem()
        all = response.css(" #module_properties .item-listing-wrap.hz-item-gallery-js.item-listing-wrap-v3.card .listing-image-wrap a.listing-featured-thumb.hover-effect::attr(href)").extract()

        for one in all:
            self.link = one
            yield response.follow(one,callback = self.page)

        next_page = f"https://www.drivenproperties.com/blog?page={self.page_number}/"
        if next_page is not None and self.page_number < 1:
            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)
        else:
            # pass
            data = {'message': 'driven blog done'}
            # response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = OffplanItem()
        signature = uuid.uuid1()

        items['signature'] = signature
        items['title'] = response.css(".wpb_column.vc_column_container.vc_col-sm-6 .wpb_wrapper h2.vc_custom_heading::text").get().replace("\n","").replace("  ","")
        property_info = methods2.get_text_from_same_element_multiple_and_seperate_to_key_value(response.css(".property-address-wrap .block-wrap .block-content-wrap ul li").extract(),{'keys':['Property Type','Unit Type','Size','Area','Title type','Downpayment','Payment Plan','Completion date','Developer','Starting price']})
        try:
            items['description'] = BeautifulSoup(response.css(".wpb_text_column.wpb_content_element .wpb_wrapper").extract()[2],'lxml').text.replace("\n","").replace("  ","")
        except:
            items['description'] = BeautifulSoup(response.css(".vc_column-inner").get(),'lxml').text.replace("\n","").replace("  ","")
        print("/////////////__________//////////////////")
        print(response.css('.vc_grid-container-wrapper.vc_clearfix.vc_grid-animation-fadeIn').get())
        print("/////////////__________//////////////////")
        # try:
        #     items['images'] = methods.img_downloader_method_a(response.css('.vc_row.wpb_row.vc_inner.vc_row-fluid.vc_custom_1646995290277').get(),signature)
        # except:
        #     items['images'] = "N\A"
        
       
        # items['content'] = BeautifulSoup(response.css(".dpxi-post-content-2").get(),'lxml').text.replace("\n","").replace("  ","")
        # items['images'] = images
        # items['payment_plan'] = payment_plan
        # items['location'] = location
        # items['near_by_places'] = near_by_places
        # items['unit_sizes'] = unit_sizes
        yield items


