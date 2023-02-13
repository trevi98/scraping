import scrapy
from ..items import Premier_Finance_spiderItem
from bs4 import BeautifulSoup
import requests

class HausspiderSpider(scrapy.Spider):
    name = 'Premier_Finance_spider'
    start_urls = ['https://www.providentestate.com/premier-finance.html']
    def parse(self, response ):
        items=Premier_Finance_spiderItem()
        title=response.css("h1.vc_custom_heading.premier-head::text").get().replace("\n","").replace("  ","")
        descriptionHome=response.css("p.vc_custom_heading::text").get().replace("\n","").replace("  ","")
        descriptionHome+=response.css(".headingTxt.jstTxt.wpb_column.vc_column_container.vc_col-sm-12.vc_hidden-sm.vc_hidden-xs p::text").get().replace("\n","").replace("  ","")
        services=response.css(".wpb_text_column.wpb_content_element .wpb_wrapper ul li span::text").extract()
        items["title"]=title
        items["descriptionHome"]=descriptionHome
        items["services"]=services
        yield items
        data = {'message': 'machine 1 | haus land lord guid done (;'}
        # response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
       