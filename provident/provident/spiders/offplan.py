import scrapy
from ..items import ProvidentOffplanItem
import uuid
from .helpers import methods
from .file_downloader import img_downloader
from .helpers2 import methods2
from bs4 import BeautifulSoup
import requests
import json 


class OffplanSpider(scrapy.Spider):
    name = 'offplan'
    start_urls = ['https://www.providentestate.com/dubai-off-plan-properties.html']
    link=""

    def parse(self, response):
        all = response.css("div.row div.item-col.col-lg-4.col-md-4.col-sm-6.col-xs-12 div.item-post.offplan_girdbg div.item-post__image a::attr('href')").extract() 

        for one in all:
            self.link = one
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
        try:
            title =response.css("div.wpb_wrapper .vc_custom_heading::text").get().replace("\n","").replace("  ","")
        except:
            title=""
        sub_titles=response.css("div.wpb_wrapper h3::text").extract()
        soup_description=response.css("div.vc_row.wpb_row.vc_row-fluid.vc_custom_1548935055607.vc_row-has-fill").extract()
        description=[]
        for i in soup_description:
            one=BeautifulSoup(i,"lxml").text.replace("\n","").replace("  ","")
            description.append(one)
      
        images_cont = json.loads(response.css(".vc_grid-container.vc_clearfix.wpb_content_element.vc_media_grid::attr(data-vc-grid-settings)").get())
        page_id = images_cont['page_id']
        short_code = images_cont['shortcode_id']
        payload = "action=vc_get_vc_grid_data&vc_action=vc_get_vc_grid_data&tag=vc_media_grid&data%5Bvisible_pages%5D=5&data%5Bpage_id%5D="+str(page_id)+"&data%5Bstyle%5D=all&data%5Baction%5D=vc_get_vc_grid_data&data%5Bshortcode_id%5D="+str(short_code)+"&data%5Btag%5D=vc_media_grid&vc_post_id=36550&_vcnonce=36ef433d9a"
        headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/110.0',
        'Accept': 'text/html, */*; q=0.01',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        'Origin': 'https://www.providentestate.com',
        'Connection': 'keep-alive',
        'Referer': 'https://www.providentestate.com/dubai-offplan/damac-chic-tower.html',
        'Cookie': '_ga_VTTZT0CG7Y=GS1.1.1674113863.1.1.1674116108.0.0.0; _ga=GA1.1.1272521174.1674113863; _gid=GA1.2.195706321.1674113865; cto_bundle=vQ8nJ19YbTBKblFiQmo1SlV5RFVySG5JYWtDZnQ1VEZFbktYRUVzanc3WFdYcTFIQmNQNHBUa2VsV0djMXozcWtlaFl5VXZqaEJIMWd2Z2ZwMTRya1VHTHAlMkJHUFliTlo5RGw4OHYlMkJCOGNmUHN2NkYlMkJqeGZjMmZ3dnp0dmUydUpVMlFkQ1dzc3UlMkJvdUVZekw5TEJPT0RFU0FOUSUzRCUzRA; _cmg_csstYfiWG=1674113866; _comagic_idYfiWG=52063802.67410786.1674113867; scbsid_old=1344357979; sma_session_id=1528274486; sma_index_activity=41184; SCBnotShow=-1; SCBporogAct=80000; SCBindexAct=17667; smFpId_old_values=%5B%2257aa85821df5673883d25e3ead12399c%22%5D; PHPSESSID=b9811c0064c6a8d8155a4dd010ee0b76; handl_original_ref=https%3A%2F%2Fwww.providentestate.com%2Fdubai-developments.html; handl_landing_page=https%3A%2F%2Fwww.providentestate.com%2Fsecond-citizenship.html; handl_ip=5.194.35.85; handl_ref=https%3A%2F%2Fwww.providentestate.com%2Fwp-admin%2Fadmin-ajax.php; handl_url=https%3A%2F%2Fwww.providentestate.com%2Ffavicon.ico; SCBopenCount=5; SCBlastOpen=1674115128990; _gcl_au=1.1.1990602955.1674114293; SCBstart=1674115768586; SCB_scenario=YES',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'TE': 'trailers'
        }

        response_images = requests.request("POST", 'https://www.providentestate.com/wp-admin/admin-ajax.php', headers=headers, data=payload)
        images = response_images.text
        # images = soup.find("div",class_="vc_grid vc_row vc_grid-gutter-5px vc_pageable-wrapper vc_hook_hover")

       
        items['images'] = methods.img_downloader_method_src(images,signature)
        items['title'] = title
        items['sub_titles'] = sub_titles
        items['description'] = description
        items['signature'] = signature
        yield items
        data = {'message': 'prov all (;'}
        response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
