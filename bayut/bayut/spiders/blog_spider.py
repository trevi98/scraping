import scrapy
from scrapy.http import FormRequest
from ..items import BayutBlogItem
import requests
from bs4 import BeautifulSoup

class testingSpider(scrapy.Spider):
    name = 'blog'
    start_urls = ["https://www.bayut.com/mybayut"]
    page_number = 2
    link = ""


    def parse(self,response):
        # items = TestscrapyItem()
        all = response.css(".post_header .entry-title a::attr(href)").extract()

        for one in all:
            yield response.follow(one,callback = self.page)

        next_page = f"https://www.bayut.com/mybayut/page/{self.page_number}/"
        if next_page is not None and self.page_number < 520:
            self.page_number +=1
            self.link = one
            yield response.follow(next_page,callback = self.parse)
        else:
            file = open("bayut_blog.csv", "rb")
            # Create a CSV reader
            # reader = list(csv.reader(file))
            headersx = {'Content-Type': 'application/x-www-form-urlencoded'}
            data = {
                "file_name" : "bayut_blog",
                "site" : "bayut",
            }
            files = {"file": ("bayut_blog.csv", file)}
            # response = requests.post("https://notifaier.abdullatif-treifi.com/", data=data,files=files)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = BayutBlogItem()
        title = response.css(".post_header_single h1.entry-title::text").get()
        html = response.css(".blog_post_text").get()
        content = response.css(".blog_post_text").get()
        soup = BeautifulSoup(content, 'lxml')
        content = soup.get_text()
        # description = response.css(".author-description::text").get()
        items['title'] = title
        items['content'] = content
        items['html'] = html
        items['link'] = self.link
        yield items
