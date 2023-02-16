import scrapy
from ..items import Real_Estate_spiderItem
from bs4 import BeautifulSoup
import requests

class HausspiderSpider(scrapy.Spider):
    name = 'real_estate_spider'
    start_urls = ['https://www.providentestate.com/partial-ownership-real-estate.html']
    def parse(self, response ):
        items=Real_Estate_spiderItem()
        all=[]
        title=response.css("title::text").get().replace("\n","").replace("  ","")
        all.append({response.css(".title.title1.orange::text").get().replace("\n","").replace("  ",""):response.css(".blue.baner-p::text").get().replace("\n","").replace("  ","")})
        all.append({response.css(".title.blue::text").get().replace("\n","").replace("  ",""):response.css(".blue.baner-p::text").extract()[1].replace("\n","").replace("  ","")})
        all.append({response.css("h2.vc_custom_heading.pad::text").get().replace("\n","").replace("  ",""):response.css(".wpb_text_column.wpb_content_element.txtDes.baner-text p::text").extract()[4].replace("\n","").replace("  ","")})
        all.append({response.css("h2.vc_custom_heading::text").extract()[1].replace("\n","").replace("  ",""):response.css(".wpb_single_image.wpb_content_element.vc_align_center + h4.vc_custom_heading::text").extract()})
        all.append({response.css("h2.vc_custom_heading::text").extract()[2].replace("\n","").replace("  ",""):response.css(".wpb_text_column.wpb_content_element.txtDes.baner-text .wpb_wrapper ul")[0].css("span::text").extract()})
        all.append({response.css("h2.vc_custom_heading::text").extract()[3].replace("\n","").replace("  ",""):response.css(".vc_hidden-sm.vc_hidden-xs .vc_column-inner  h3.vc_custom_heading.process_text::text").extract()})
        all.append({(response.css("h2.vc_custom_heading::text").extract()[5].replace("\n","").replace("  ","")+response.css("h2.vc_custom_heading::text").extract()[6].replace("\n","").replace("  ","")):response.css(".vc_row.wpb_row.vc_inner.vc_row-fluid")[29].css("span::text").extract()})
   

        items["title"]=title
        items["all_content"]=all
        
        yield items
        data = {'message': 'machine 1 | haus land lord guid done (;'}
        # response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
       