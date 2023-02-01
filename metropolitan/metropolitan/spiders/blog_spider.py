import scrapy
from ..items import MetropolitanBlogItem
import requests
from bs4 import BeautifulSoup

class testingSpider(scrapy.Spider):
    name = 'blog'
    start_urls = ["https://metropolitan.realestate/blog/"]
    page_number = 2


    def parse(self,response):
        # items = TestscrapyItem()
        all = response.css(".categoryBlogPostContent__head a::attr(href)").extract()

        for one in all:
            yield response.follow(one,callback = self.page)

        next_page = f"https://metropolitan.realestate/blog/page/{self.page_number}/"
        if next_page is not None and self.page_number < 9:
            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)
        else:
            # pass
            data = {'message': 'metro blog done'}
            # response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = MetropolitanBlogItem()
        title = response.css(".postHead h1::text").get()
        html = response.css(".postMain").get()
        content = self.get_text(html)
        # description = response.css(".author-description::text").get()
        items['title'] = title
        items['content'] = content
        # items['html'] = html
        yield items


    def get_text(self,elmnt):
        soup = BeautifulSoup(elmnt,'lxml')
        return soup.get_text()
