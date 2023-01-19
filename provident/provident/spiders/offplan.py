import scrapy
from ..items import ProvidentOffplanItem
import uuid
from .helpers import methods
from .file_downloader import img_downloader
from .helpers2 import methods2
from bs4 import BeautifulSoup
import requests


class OffplanSpider(scrapy.Spider):
    name = 'offplan'
    start_urls = ['https://www.providentestate.com/dubai-off-plan-properties.html']
    link=""

    def parse(self, response):
        all = response.css("div.row div.item-col.col-lg-4.col-md-4.col-sm-6.col-xs-12 div.item-post.offplan_girdbg div.item-post__image a::attr('href')").extract() 

        for one in all:
            self.link = one
            print("one  : ",one)
            yield response.follow(one,callback = self.page)

        

    def page(self,response):
        items = ProvidentOffplanItem()
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
        # images=response.css("section.section-developments-details div.section-body div.section-slider div.container div.prop-slider-wrapper.prop-slider div.slider.slider-developments-details").get()
        try:
            title =response.css("div.wpb_wrapper .vc_custom_heading::text").get()
        except:
            title=""     
        soup_overview=response.css("div.wpb_wrapper div.vc_row.wpb_row.vc_inner.vc_row-fluid.vc_custom_1548935033331.vc_row-has-fill div.vc_column-inner div.wpb_wrapper div.wpb_text_column.wpb_content_element div.wpb_wrapper p").extract()
        overview=""
        for i in range(len(soup_overview)):
            one=BeautifulSoup(soup_overview[i],"lxml").text
            overview+=one
        amentities=[]
        try:
            amentities_description=response.css("div.wpb_wrapper h3.vc_custom_heading.vc_custom_1609242357676  ~ div.vc_separator.wpb_content_element.vc_separator_align_center.vc_sep_width_10.vc_sep_pos_align_left.vc_separator_no_text ~ div.wpb_text_column.wpb_content_element div.wpb_wrapper p span::text").get()
        except:
            amentities_description=""
        try:        
            amentities_list=response.css("div.wpb_column.vc_column_container.vc_col-sm-6 li::text").extract()
        except:
            amentities_list=[]
        amentities.append({amentities_description:amentities_list})        
        features=response.css("div.wpb_wrapper h3.vc_custom_heading.vc_custom_1609239901325 ~ div.vc_separator.wpb_content_element.vc_separator_align_center.vc_sep_width_10.vc_sep_pos_align_left.vc_separator_no_text ~ div.wpb_text_column.wpb_content_element div.wpb_wrapper ul li::text").extract()
        try:
            location=response.css("div#locationmap  div.wpb_column.vc_column_container.vc_col-sm-12 div.vc_column-inner div.wpb_wrapper div.wpb_text_column.wpb_content_element div.wpb_wrapper p::text").get()
        except:
            location=""    
        units=[]
        description_units=response.css("div.wpb_wrapper h3.vc_custom_heading.vc_custom_1671452651672 ~ div.wpb_text_column.wpb_content_element div.wpb_wrapper p::text").get()
        try:
            list_units=response.css("div.wpb_wrapper h3.vc_custom_heading.vc_custom_1671452651672 ~ div.wpb_text_column.wpb_content_element div.wpb_wrapper ul li::text").extract()
        except:
            list_units=[] 
        units.append({description_units:list_units})              
        try:
            payments=response.css("div.wpb_wrapper h3.vc_custom_heading.vc_custom_1609242466340 ~ div.wpb_text_column.wpb_content_element ul li::text").extract()
        except:
            payments="N/A"        

       
        # items['images'] = methods.img_downloader_method_src(images,signature)
        items['title'] = title
        items['overview'] = overview
        items['features'] = features
        items['location'] = location
        items['amentities'] = amentities
        items['payments'] = payments
        items['units'] = units
        # items['signature'] = signature
        yield items
