import scrapy
from ..items import Second_Citizenship_spiderItem
from bs4 import BeautifulSoup
import requests

class HausspiderSpider(scrapy.Spider):
    name = 'Second_Citizenship_spider'
    start_urls = ['https://www.providentestate.com/second-citizenship.html']
    def parse(self, response ):
        items=Second_Citizenship_spiderItem()
        title=response.css("h1.vc_custom_heading.citizenship-head::text").get().replace("\n","").replace("  ","")
        descriptionHome=response.css("p.vc_custom_heading::text").get().replace("\n","").replace("  ","")
        descriptionHome+=response.css("h4.vc_custom_heading::text").get().replace("\n","").replace("  ","")
        list=response.css(".bcontent.wpb_column.vc_column_container.vc_col-sm-12.vc_hidden-lg.vc_hidden-md .wpb_text_column.wpb_content_element ul li::text").extract()
        des=response.css("h4.vc_custom_heading::text").extract()
        all_des=[]
        for i in range(len(des)-1):
            one=BeautifulSoup(des[i],"lxml").text.replace("\n","").replace("  ","")
            all_des.append(one)
        Why_Plan_B_Advisory_Services=[]
        
        Why_Plan_B_Advisory_Services.append(list)    
        Why_Plan_B_Advisory_Services.append(all_des)    

        items["title"]=title
        items["descriptionHome"]=descriptionHome
        items["Why_Plan_B_Advisory_Services"]=Why_Plan_B_Advisory_Services
        yield items
        data = {'message': 'machine 1 | haus land lord guid done (;'}
        # response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
       