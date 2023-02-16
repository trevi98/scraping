import scrapy
from scrapy.http import FormRequest
from ..items import PropertyfinderBlogItem
from bs4 import BeautifulSoup
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
            # response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = PropertyfinderBlogItem()
        title = response.css(".entry-title::text").get().replace("\n","").replace("\t","").replace("\r","").replace("  ","")
        arr = response.css('.entry-content > *').extract()
        all_titles=[]
        all_des=[]
        for i in range(len(arr)):
            if (arr[i].startswith("<h2") or arr[i].startswith("<h3")):
                title=BeautifulSoup(arr[i],"lxml").text
                all_titles.append(title)
                s=i+1
                result=""
                while s<len(arr):
                    if (arr[s].startswith("<h2") or arr[s].startswith("<h3")):
                        break
                    elif(arr[s].startswith("<figure")):
                        continue
                    else:
                        one=BeautifulSoup(arr[s],"lxml").text
                        result+=one
                        s+=1
                        continue
                result=result.replace("\n","").replace("\t","").replace("  ","").replace("\r","")    
                all_des.append(result)
                i=s    
            else:
                continue
        all_content=[]
        if len(all_des)==len(all_des):        
            for i in range(len(all_titles)):
                all_content.append({all_titles[i]:all_des[i]})    
        
        items['title'] = title
        items['content'] = all_content
        
        yield items
