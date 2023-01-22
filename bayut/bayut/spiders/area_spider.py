import scrapy
from scrapy.http import FormRequest
from ..items import BayutAreaItem
import requests
from bs4 import BeautifulSoup

class testingSpider(scrapy.Spider):
    name = 'area'
    start_urls = ["https://www.bayut.com/area-guides/dubai"]
    page_number = 2
    link = ""


    def parse(self,response):
        # items = TestscrapyItem()
        all = response.css("article.blog_post_container figure a::attr(href)").extract()

        for one in all:
            try:
                yield response.follow(one,callback = self.page)
            except:
                continue

        next_page = f"https://www.bayut.com/area-guides/dubai/page/{self.page_number}"
        if next_page is not None and self.page_number < 92:
            self.page_number +=1
            self.link = one
            yield response.follow(next_page,callback = self.parse)
        else:
            data = {"message":'bayut area'}
            response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = BayutAreaItem()
        title = response.css(".entry-title::text").get().replace("\n","").replace("\t","").replace("\r","").replace("  ","")
        # html = response.css(".blog_post_text").get().replace("\n","").replace("\t","").replace("\r","").replace("  ","")
        # soup = BeautifulSoup(html, 'lxml')
        soup = BeautifulSoup(response.css("#highlights").get(),'lxml')
        highlights = soup.get_text().replace("\n","").replace("\t","").replace("\r","").replace("  ","")
        property = ""
        try:
            soup = BeautifulSoup(response.css("#property").get(),'lxml')
            property = soup.get_text().replace("\n","").replace("\t","").replace("\r","").replace("  ","")
        except:
            property = "N\A"
        payment = ""
        try:
            soup = BeautifulSoup(response.css("#paymentplan").get(),'lxml')
            payment = soup.get_text().replace("\n","").replace("\t","").replace("\r","").replace("  ","")
        except:
            payment = "N\A"
        soup = BeautifulSoup(response.css("#location").get(),'lxml')
        location = soup.get_text().replace("\n","").replace("\t","").replace("\r","").replace("  ","")
        # description = soup.get_text()
        
        # description = response.css(".author-description::text").get()
        items['title'] = title
        items['highlights'] = highlights
        items['property'] = property
        items['payment'] = payment
        items['location'] = location
        # items['html'] = html
        # items['link'] = self.link
        yield items
