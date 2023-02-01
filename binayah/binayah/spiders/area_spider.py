import scrapy
from ..items import AreaItem
import requests
from bs4 import BeautifulSoup
import uuid
from .file_downloader import img_downloader



class testingSpider(scrapy.Spider):
    name = 'area'
    start_urls = ["https://www.binayah.com/dubai-communities/"]
    page_number = 2
    link = ""


    def parse(self,response):
        # items = TestscrapyItem()
        all = response.css(".listing-thumb a::attr(href)").extract()

        for one in all:
            self.link = one
            yield response.follow(one,callback = self.page)

        next_page = f"https://www.drivenproperties.com/blog?page={self.page_number}/"
        if next_page is not None and self.page_number < 1:
            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)
        else:
            # pass
            data = {'message': 'binaya area done'}
            response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = AreaItem()
        signature = uuid.uuid1()
        
        items["coverImage"]=img_downloader.download(response.css("div.banner-inner.parallax::attr('data-parallax-bg-image')").get(),signature,111)
        items['signature'] = signature
        items['title'] = response.css("title::text").get().replace("\n","").replace("  ","")
        try:
            description = BeautifulSoup(response.css("div.wpb_text_column.wpb_content_element div.wpb_wrapper").get(),'lxml').text.replace("\n","").replace("  ","")
        except:
            description=""
            description_soup= response.css("div.elementor-widget-container").extract()[3]
            for i in description_soup:
                description+=BeautifulSoup(i,"lxml").text.replace("\n","").replace("  ","")

        try:
            items['map_plan'] = img_downloader.download(BeautifulSoup(response.css("div.mega_wrap").get(),'lxml').find('img')['data-src'],signature,99)
        except:
            items['map_plan'] = "N\A"
        amenities=[]    
        try:
            amenities_soup=response.css("div.vc_info_list_outer li").extract()
            for i in amenities_soup:
                one=BeautifulSoup(i,"lxml").text.replace("\n","").replace("  ","")
                amenities.append(one)
        except:
            amenities="N/A"
        items["amenities"]=amenities
        items["description"]=description
                        
       
        yield items


