import scrapy
from scrapy.http import FormRequest
from ..items import PropertyfinderBlogItem
import requests
from bs4 import BeautifulSoup


class testingSpider(scrapy.Spider):
    name = 'buy_guide'
    start_urls = ["https://www.propertyfinder.ae/guides/buy-in-dubai/"]
    page_number = 2


    def parse(self,response):
        # items = TestscrapyItem()
        all = response.css(".gpost a::attr(href)").extract()

        for one in all:
            yield response.follow(one,callback = self.page)

        next_page = f"https://www.propertyfinder.ae/blog/page/{self.page_number}/"
        if next_page is not None and self.page_number < 1:
            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)
        else:
            data = {"message":'property finder buy guid'}
            response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = PropertyfinderBlogItem()
        title = response.css(".main-title::text").get().replace("\n","").replace("\t","").replace("\r","").replace("  ","")
        # html = response.css(".entry-content").get()

        # description = response.css(".author-description::text").get()
        items['title'] = title
        items['content'] = BeautifulSoup(response.css(".content-area").get(),'lxml').text.replace("\n","").replace("\t","").replace("\r","").replace("  ","")
        # items['html'] = html
        yield items
