import scrapy
from ..items import Prism_Conveyance_spiderItem
from bs4 import BeautifulSoup
import requests

class HausspiderSpider(scrapy.Spider):
    name = 'Prism_Conveyance_spider'
    start_urls = ['https://www.providentestate.com/conveyance.html']
    def parse(self, response ):
        items=Prism_Conveyance_spiderItem()
        title=response.css("h1.vc_custom_heading.prism-head::text").get().replace("\n","").replace("  ","")
        descriptionHome=response.css("p.vc_custom_heading::text").get().replace("\n","").replace("  ","")
        descriptionHome+=response.css("h4.vc_custom_heading::text").get().replace("\n","").replace("  ","")
        t=response.css("h2.vc_custom_heading.font-bold::text").extract()
        des=response.css(".wpb_text_column.wpb_content_element ").extract()
        all_des=[]
        for i in range(len(des)-1):
            one=BeautifulSoup(des[i],"lxml").text.replace("\n","").replace("  ","")
            all_des.append(one)
        services=[]
        for i in range(len(t)):
            services.append({t[i]:all_des[i]})    
        brochure=response.css("a.vc_general.vc_btn3.vc_btn3-size-lg.vc_btn3-shape-round.vc_btn3-style-custom.vc_btn3-icon-left::attr(href)").get()    

        items["title"]=title
        items["descriptionHome"]=descriptionHome
        items["services"]=services
        items["brochure"]=brochure
        yield items
        data = {'message': 'machine 1 | haus land lord guid done (;'}
        # response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
       