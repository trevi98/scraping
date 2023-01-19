import scrapy
from ..items import OffplanItem
import requests
from bs4 import BeautifulSoup
import uuid
from .file_downloader import img_downloader
from .helpers2 import methods2
from .helpers import methods
import json 



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

        images_cont = json.loads(response.css(".vc_grid-container.vc_clearfix.wpb_content_element.vc_media_grid::attr(data-vc-grid-settings)").get())
        page_id = images_cont['page_id']
        short_code = images_cont['shortcode_id']
        payload = "action=vc_get_vc_grid_data&vc_action=vc_get_vc_grid_data&tag=vc_media_grid&data%5Bvisible_pages%5D=5&data%5Bpage_id%5D="+str(page_id)+"&data%5Bstyle%5D=all&data%5Baction%5D=vc_get_vc_grid_data&data%5Bshortcode_id%5D="+str(short_code)+"&data%5Btag%5D=vc_media_grid&vc_post_id=80678&_vcnonce=822b58dfa6"
        headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/110.0',
        'Accept': 'text/html, */*; q=0.01',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://www.binayah.com/dubai-projects/samana-miami-2/',
        'Origin': 'https://www.binayah.com',
        'Connection': 'keep-alive',
        'Cookie': '_gcl_au=1.1.387624197.1674022015; _ga_7TRND0TJ9X=GS1.1.1674127717.3.1.1674127753.0.0.0; _ga=GA1.2.1225947950.1674022016; _ym_uid=1674022117167424547; _ym_d=1674022117; wp-wpml_current_language=en; _gid=GA1.2.691371661.1674127718; _gat_gtag_UA_54276894_1=1; _ym_isad=1; _ym_visorc=w',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'same-origin',
        'TE': 'trailers',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        'Alt-Used': 'www.binayah.com',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache'
        }

        response_images = requests.request("POST", 'https://www.binayah.com/wp-admin/admin-ajax.php', headers=headers, data=payload)
        images = response_images.text

        # try:
        items['images'] = methods.img_downloader_method_src(images,signature)
        # except:
        #     items['images'] = "N\A"
        
       
        # items['content'] = BeautifulSoup(response.css(".dpxi-post-content-2").get(),'lxml').text.replace("\n","").replace("  ","")
        # items['images'] = images
        # items['payment_plan'] = payment_plan
        # items['location'] = location
        # items['near_by_places'] = near_by_places
        # items['unit_sizes'] = unit_sizes
        yield items


