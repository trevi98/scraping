import scrapy
from ..items import AreaItem
import requests
from bs4 import BeautifulSoup



class testingSpider(scrapy.Spider):
    name = 'area'
    start_urls = ["https://www.drivenproperties.com/dubai-properties-areas?page=1"]
    page_number = 2
    link = ""


    def parse(self,response):
        # items = TestscrapyItem()
        all = response.css(".col-xl-4.col-lg-4.col-md-4.col-sm-4.col-12 a::attr(href)").extract()

        for one in all:
            self.link = one
            yield response.follow("https://www.drivenproperties.com/"+one,callback = self.page)

        next_page = f"https://www.drivenproperties.com/dubai-properties-areas?page={self.page_number}/"
        if next_page is not None and self.page_number < 5:
            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)
        else:
            # pass
            data = {'message': 'driven area done'}
            response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = AreaItem()

        items['title'] = BeautifulSoup(response.css(".col-xl-12.col-lg-12.col-md-12.col-sm-12.col-12 h1.dpx-headings").get(),"lxml").text.replace("\n","")
        items['about'] = BeautifulSoup(response.css(".dpx-area-grey.dpx-content-area.dpx-content-area-padding.dpx-projects-areas-detail").get(),'lxml').text.replace("\n","").replace("  ","")
        items['questions'] = response.css(".col-xl-12.col-lg-12.col-md-12.col-sm-12.col-12 h3.dpxi-accordion::text").extract()
        items['answers'] = response.css(".col-xl-12.col-lg-12.col-md-12.col-sm-12.col-12 div.dpxi-panel p::text").extract()

        # items['images'] = images
        # items['payment_plan'] = payment_plan
        # items['location'] = location
        # items['near_by_places'] = near_by_places
        # items['unit_sizes'] = unit_sizes
        yield items


    def get_text(self,elmnt):
        soup = BeautifulSoup(elmnt,'lxml')
        return soup.get_text()
