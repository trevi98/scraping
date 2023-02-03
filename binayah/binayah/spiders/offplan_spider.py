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
        all = response.css("#module_properties .item-listing-wrap.hz-item-gallery-js.item-listing-wrap-v3.card .listing-image-wrap a.listing-featured-thumb.hover-effect::attr(href)").extract()

        for one in all:
            self.link = one
            yield response.follow(one,callback = self.page)

        next_page = f"https://www.binayah.com/off-plan-properties-dubai/?page={self.page_number}/"
        if next_page is not None and self.page_number < 1:
            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)
        else:
            # pass
            data = {'message': 'binaya offplan done'}
            # response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = OffplanItem()
        signature = uuid.uuid1()

        try:
            type=response.css("div.breadcrumb-wrap nav ol li span::text")[1].get()
        except:
            type="N/A"    

        
        title = response.css(".wpb_column.vc_column_container.vc_col-sm-6 .wpb_wrapper h2.vc_custom_heading::text").get().replace("\n","").replace("  ","")
        property_info_key_soup= response.css("div#property-address-wrap ul li strong").extract()
        property_info_value_soup = response.css("div#property-address-wrap ul li span").extract()
        property_info_key=[]
        property_info_value=[]
        for i in property_info_key_soup:
            property_info_key.append(BeautifulSoup(i,"lxml").text.replace("\n","").replace("  ",""))
        for i in property_info_value_soup:
            property_info_value.append(BeautifulSoup(i,"lxml").text.replace("\n","").replace("  ",""))
            
        property_info=[]
        if len(property_info_key)==len(property_info_key):
            for i in range(len(property_info_key)):
                property_info.append({property_info_key[i]:property_info_value[i]})
        else:
            property_info.append({property_info_key:property_info_value})
        description=""            
        try:
            soup_description=response.css(".wpb_text_column.wpb_content_element .wpb_wrapper").extract()[2]
            for i in soup_description:
                one=BeautifulSoup(i,'lxml').text.replace("\n","").replace("  ","")
                description+= one
                
        except:
            description = BeautifulSoup(response.css(".vc_column-inner").get(),'lxml').text.replace("\n","").replace("  ","")

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

        try:
            items['images'] = methods.img_downloader_method_src(images,signature)
        except:
            items['images'] = "N\A"
        image_location=methods.img_downloader_method(response.css("div.vc_single_image-wrapper.vc_box_border_grey").get(),signature)
        soup_amenities_list=response.css("div.vc_row.wpb_row.vc_inner.vc_row-fluid.lists").extract()
        amenities_list=[]
        for i in soup_amenities_list:
            one=BeautifulSoup(i,"lxml")
            amenities_list.append(one)
        try:
            attractions=[]
            attractions_all=response.css("div.wpb_column.vc_column_container.vc_col-sm-3 div.wpb_single_image.wpb_content_element.vc_align_center + div.wpb_text_column.wpb_content_element strong").extract()
            for i in attractions_all:
                attractions.append(BeautifulSoup(i,"lxml").text.replace("\n","").replace("  ",""))
        except:
            attractions="N/A"
        try:
            payment_plan_all=response.css("div.wpb_text_column.wpb_content_element.paymentplan div.wpb_wrapper").extract() 
            payment_plan=[]
            for i in payment_plan_all:
                payment_plan.append(BeautifulSoup(i,"lxml").text.replace("\n","").replace("  ",""))
        except:
            payment_plan="N/A"        
        try:
            type_size_all=response.css("div.wpb_text_column.wpb_content_element.bedroom div.wpb_wrapper").extract() 
            type_size=[]
            for i in type_size_all:
                type_size.append(BeautifulSoup(i,"lxml").text.replace("\n","").replace("  ",""))
        except:
            type_size="N/A"        
        try:
            floor_plans=response.css("div.wpb_column.vc_column_container.vc_col-sm-4").get()
            images_floor_plan=methods.img_downloader_method(floor_plans,signature)
        except:
            try:
                floor_plans=response.css("div.wpb_column.vc_column_container.vc_col-sm-6 ").get()
                images_floor_plan=methods.img_downloader_method(floor_plans,signature)
            except:
                floor_plans="N/A"
        
        else:
            images_floor_plan="N/A"                
        try:
            video=response.css("div.rll-youtube-player::attr('data-src')").get()
        except:
            video="N/A"        

        # h2=response.css("div.vc_row.wpb_row.vc_row-fluid h2.vc_custom_heading::text").extract()
        # des=response.css("h2.vc_custom_heading + div.wpb_text_column.wpb_content_element").extract()[5]


        

        
       
        # items['content'] = BeautifulSoup(response.css(".dpxi-post-content-2").get(),'lxml').text.replace("\n","").replace("  ","")
       
        items['title'] = title
        items['description'] = description
        items['type'] = type
        items['property_info'] = property_info
        items['image_location'] = image_location
        items['payment_plan'] = payment_plan
        items['amenities'] = amenities_list
        items['attractions'] = attractions
        items['video'] = video
        items['type_size'] = type_size
        items['images_floor_plan'] = images_floor_plan
        items['signature'] = signature
        yield items


