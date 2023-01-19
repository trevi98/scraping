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
            data = {'message': 'driven blog done'}
            # response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = AreaItem()
        signature = uuid.uuid1()

        items['signature'] = signature
        items['title'] = response.css("title::text").get().replace("\n","").replace("  ","")
        try:
            items['description'] = BeautifulSoup(response.css(".elementor-section-wrap").get(),'lxml').text.replace("\n","").replace("  ","")
        except:
            items['description'] = BeautifulSoup(response.css(".vc_column-inner").get(),'lxml').text.replace("\n","").replace("  ","")
        try:
            items['map_plan'] = img_downloader.download(BeautifulSoup(response.css("div.mega_wrap").get(),'lxml').find('img')['data-src'],signature,99)
        except:
            items['map_plan'] = "N\A"
       
        # items['content'] = BeautifulSoup(response.css(".dpxi-post-content-2").get(),'lxml').text.replace("\n","").replace("  ","")
        # items['images'] = images
        # items['payment_plan'] = payment_plan
        # items['location'] = location
        # items['near_by_places'] = near_by_places
        # items['unit_sizes'] = unit_sizes
        yield items


