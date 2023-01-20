import scrapy
from scrapy.http import FormRequest
from ..items import PropertyfinderProjectItem
import requests
from bs4 import BeautifulSoup


class testingSpider(scrapy.Spider):
    link = ""
    name = 'project'
    start_urls = ["https://www.propertyfinder.ae/en/new-projects?location_id=1&page=1&q=Dubai&sort=-featured"]
    page_number = 2


    def parse(self,response):
        # items = TestscrapyItem()
        all = response.css("a._3CeWVKEE::attr(href)").extract()

        for one in all:
            self.link = one
            yield response.follow(one,callback = self.page)

        next_page = f"https://www.propertyfinder.ae/en/new-projects?location_id=1&page={self.page_number}&q=Dubai&sort=-featured"
        if next_page is not None and self.page_number < 61:

            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)
        else:
            data = {"message":"property_finder project done"}
            response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = PropertyfinderProjectItem()
        title = response.css("._14Az7GMC::text").get()
        developer = response.css("._1KmX3mFx::text").get()
        starting_price = response.css("._1-htALWL::text").extract()[0]
        status = response.css("._1-htALWL::text").extract()[2]
        delivery_date = response.css("._1-htALWL::text").extract()[3]
        bedrooms = response.css("._1-htALWL::text").extract()[5]
        description = response.css("._3RInl69y").get()
        soup = BeautifulSoup(description, 'lxml')
        description = soup.get_text()
        area = response.css("._3XeJbDEl span::text").extract()

            

        # content = response.css(".entry-content ::text").extract()
        # description = response.css(".author-description::text").get()
        items['title'] = title
        items['developer'] = developer
        items['starting_price'] = starting_price
        items['status'] = status
        items['delivery_date'] = delivery_date
        items['bedrooms'] = bedrooms
        items['description'] = description
        items['area'] = area
        items['link'] = self.link

        yield items
