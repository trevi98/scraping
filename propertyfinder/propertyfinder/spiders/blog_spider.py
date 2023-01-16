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
            file = open("propertyfinder_blog.csv", "rb")
            # Create a CSV reader
            # reader = list(csv.reader(file))
            headersx = {'Content-Type': 'application/x-www-form-urlencoded'}
            data = {
                "file_name" : "propertyfinder_blog",
                "site" : "property_finder",

            }
            files = {"file": ("propertyfinder_blog.csv", file)}
            response = requests.post("https://notifier.abdullatif-treifi.com/", data=data,files=files)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = PropertyfinderBlogItem()
        title = response.css(".entry-title::text").get()
        html = response.css(".entry-content").get()
        content = response.css(".entry-content ::text").extract()
        # description = response.css(".author-description::text").get()
        items['title'] = title
        items['content'] = content
        items['html'] = html
        yield items
