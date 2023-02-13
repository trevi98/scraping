import scrapy
from ..items import Primestay_Holiday_spiderItem
from bs4 import BeautifulSoup
import requests

class HausspiderSpider(scrapy.Spider):
    #.vc_row.wpb_row.vc_inner.vc_row-fluid.bcontent .vc_column-inner  .wpb_text_column.wpb_content_element  .wpb_wrapper ul li
    name = 'Primestay_Holiday_spider'
    start_urls = ['https://www.providentestate.com/primestay-holiday-homes.html']
    def parse(self, response ):
        items=Primestay_Holiday_spiderItem()
        title=response.css("h1.vc_custom_heading.primestay-head::text").get().replace("\n","").replace("  ","")
        descriptionHome=response.css("p.vc_custom_heading::text").get().replace("\n","").replace("  ","")
        In_just_5_steps_you_can_start_earning_great_returns_with_short_term_rentals_of_your_property_investment=response.css(".vc_row.wpb_row.vc_inner.vc_row-fluid.bcontent .vc_column-inner  .wpb_text_column.wpb_content_element  .wpb_wrapper ul li::text").extract()
        in_holiday=response.css(".vc_row.wpb_row.vc_row-fluid.vc_row-o-content-middle.vc_row-flex")[4].css("li::text").extract()
        items["title"]=title
        items["descriptionHome"]=descriptionHome
        items["in_holiday"]=in_holiday
        items["In_just_5_steps_you_can_start_earning_great_returns_with_short_term_rentals_of_your_property_investment"]=In_just_5_steps_you_can_start_earning_great_returns_with_short_term_rentals_of_your_property_investment
        yield items
        data = {'message': 'machine 1 | haus land lord guid done (;'}
        # response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
       