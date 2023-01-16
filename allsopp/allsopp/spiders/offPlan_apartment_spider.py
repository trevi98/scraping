import scrapy
from bs4 import BeautifulSoup
from ..items import ApartmentOffplanItem
from .helpers import methods
from .file_downloader import img_downloader
import uuid
class AllsoppspiderSpider(scrapy.Spider):
    name = 'apartment_offplan_item'
    start_urls = ['https://www.allsoppandallsopp.com/dubai/buyers/off-plan']
    page_number=2
    link=""

    def parse(self, response):
        
        all= response.css(" a.new_dev_card::attr('href')").extract()  
        for one in all:
            self.link=one
            yield response.follow('https://www.allsoppandallsopp.com/'+one,callback=self.page)
           
            
        next_page = f"https://www.allsoppandallsopp.com/dubai/buyers/off-plan?page={self.page_number}/"
        if next_page is not None and self.page_number < 1:
            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)
        else:
            # pass
            data = {'message': 'driven offplan apartment done'}
            # response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')
    def page(self ,response):
        items = ApartmentOffplanItem()
        signature = uuid.uuid1()
        # title=response.css(".container .last_content div ")
        #price
        items["area"]=response.css(".offplan_detail_properties .container .first_content span::text").get()
        items["description"]=response.css(".offplan_detail_properties .container .first_content p::text").get() 
        items["developer"]=response.css(".offplan_detail_properties .container .last_content div")[1].css("div p::text").get()
        items["handover_date"]=response.css(".offplan_detail_properties .container .last_content div")[2].css("div p::text").get()
        items['images']=methods.img_downloader_method_src(response.css(".slick-list").get(),signature)
        all_Proximity=[]
        all_palces=  response.css("section.places_in_proximity.container .main_content .places .place_item .place_name") 
        for one_place in all_palces:
            all_Proximity.append(one_place.css("span::text").get())
        items["all_proximity"]=all_Proximity
        all_Payments=[]
        all_payments_plan=response.css("div.payment_plan.container .payment_plan_content .main_content .detail_items .item")
        for one_payment in all_payments_plan:
            all_Payments.append({one_payment.css("div b::text").get().replace("<!-- -->",""):one_payment.css("div::text")[0].get()})
        items["all_payment"]=all_Payments
        yield items          
