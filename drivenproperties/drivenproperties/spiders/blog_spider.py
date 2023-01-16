import scrapy
from ..items import BlogItem
import requests
from bs4 import BeautifulSoup



class testingSpider(scrapy.Spider):
    name = 'blog'
    start_urls = ["https://www.drivenproperties.com/blog?page=1"]
    page_number = 2
    link = ""


    def parse(self,response):
        # items = TestscrapyItem()
        all = response.css(".dpxi-blog-post.shadow a::attr(href)").extract()

        for one in all:
            self.link = one
            yield response.follow(one,callback = self.page)

        next_page = f"https://www.drivenproperties.com/blog?page={self.page_number}/"
        if next_page is not None and self.page_number < 11:
            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)
        else:
            # pass
            data = {'message': 'driven blog done'}
            response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = BlogItem()

        items['title'] = BeautifulSoup(response.css(".dpxi-post-area-2 h1").get(),"lxml").text.replace("\n","")
        items['content'] = BeautifulSoup(response.css(".dpxi-post-content-2").get(),'lxml').text.replace("\n","").replace("  ","")
        # items['images'] = images
        # items['payment_plan'] = payment_plan
        # items['location'] = location
        # items['near_by_places'] = near_by_places
        # items['unit_sizes'] = unit_sizes
        yield items


    def get_text(self,elmnt):
        soup = BeautifulSoup(elmnt,'lxml')
        return soup.get_text()
