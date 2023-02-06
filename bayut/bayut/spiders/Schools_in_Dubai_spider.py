import scrapy
from scrapy.http import FormRequest
from ..items import schools_dubaiItem
import requests
from bs4 import BeautifulSoup
from .file_downloader import img_downloader
from .helpers import methods
import uuid

class testingSpider(scrapy.Spider):
    name = 'schools'
    start_urls = ["https://www.bayut.com/schools/dubai/"]
    page_number = 2
    link = ""


    def parse(self,response):

        all = response.css("div.relative.inline.h-full.w-full.rounded.border.border-gray-100 > a::attr(href)").extract() 

        for one in all:
            self.link = one
            
            yield response.follow("https://www.bayut.com"+one,callback = self.page)
            

        next_page = f"https://www.bayut.com/schools/dubai/page/{self.page_number}"
        if next_page is not None and self.page_number < 21:
            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)
        else:
            data = {"message":'bayut new area ready DONE'}
            # response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = schools_dubaiItem()
        signature = uuid.uuid1()

        try:
            title = response.css("div.container h1::text").get().replace("\n","").replace("\r","").replace("\t","").replace("  ","")
        except:
            title="N/A"

        #cover_img    
        cover_image = img_downloader.download(response.css("div.container div.relative img::attr(src)").get(),signature,99)

        arr=response.css("div.post.container.text-base.leading-9 div").extract()
        all_titles=[]
        all_des=[]
        for i in range(len(arr)):
            if arr[i].startswith("<div id"):
                title=BeautifulSoup(arr[i],"lxml").text
                all_titles.append(title)
                s=i+1
                result=""
                while s<len(arr):
                    if (arr[s].startswith("<div id")):
                        break
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

        #images
        # all_images=[]
        images=response.css("div.mt-6.mb-5 img::attr(src)").extract()
        # count=1
        # for i in images:
        #     all_images.append(img_downloader.download(i,signature,count))
        #     count+=1               




        
        items["all_content"]=all_content
        items["cover_image"]=cover_image
        items["images"]=images
        items["title"]=title
           
        yield items     




    