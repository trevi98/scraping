import scrapy
from scrapy.http import FormRequest
from ..items import PropertyfinderAreaItem
import requests

class testingSpider(scrapy.Spider):
    name = 'area'
    start_urls = ["https://www.propertyfinder.ae/en/community-guides/dubai"]
    page_number = 2


    def parse(self,response):
        # items = TestscrapyItem()
        all = response.css("a.community-guide-landing__community::attr(href)").extract()

        for one in all:
            yield response.follow(one,callback = self.page)

        next_page = f"https://www.propertyfinder.ae/blog/page/{self.page_number}/"
        if next_page is not None and self.page_number < 1:
            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)
        else:
            data = {"message":'property finder area'}
            response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = PropertyfinderAreaItem()
        title = response.css(".community-guide__title::text").get().replace("\n","").replace("\t","").replace("\r","").replace("  ","")
        description = response.css("div.community-guide__description-content p::text").get().replace("\n","").replace("\t","").replace("\r","").replace("  ","")
        temp = response.css("div.accordion .accordion__title ::text").extract()
        questions = []
        for question in temp:
            questions.append(question.replace("\n","").replace("\t","").replace("\r","").replace("  ",""))
        temp = response.css("div.accordion .accordion__content ::text").extract()
        answers = []
        for answer in temp:
            answers.append(answer.replace("\n","").replace("\t","").replace("\r","").replace("  ",""))
        # description = response.css(".author-description::text").get()
        items['title'] = title
        items['description'] = description
        items['questions'] = questions
        items['answers'] = answers
        yield items
