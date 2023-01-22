import scrapy
from scrapy.http import FormRequest
from ..items import PropertyfinderBlogItem
import requests

class testingSpider(scrapy.Spider):
    name = 'blog'
    start_urls = ["https://www.propertyfinder.ae/blog/"]
    page_number = 2


    def parse(self,response):
        # items = TestscrapyItem()
        all = response.css("article a::attr(href)").extract()

        for one in all:
            yield response.follow(one,callback = self.page)

        next_page = f"https://www.propertyfinder.ae/blog/page/{self.page_number}/"
        if next_page is not None and self.page_number < 93:
            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)
        else:
            data = {"message":'property finder blog'}
            response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = PropertyfinderBlogItem()
        title = response.css(".entry-title::text").get().replace("\n","").replace("\t","").replace("\r","").replace("  ","")
        # html = response.css(".entry-content").get()
        temp = response.css(".entry-content ::text").extract()
        content = []
        for i in temp:
            content.append(i.replace("\n","").replace("\t","").replace("\r","").replace("  ",""))
        # description = response.css(".author-description::text").get()
        items['title'] = title
        items['content'] = content
        # items['html'] = html
        yield items
