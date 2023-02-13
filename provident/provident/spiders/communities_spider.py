import scrapy
from ..items import provCoomItem
import uuid
from .helpers import methods
from .file_downloader import img_downloader
from .helpers2 import methods2
from bs4 import BeautifulSoup
import requests


class HausspiderSpider(scrapy.Spider):
    name = 'communities'
    
    start_urls = ['https://www.providentestate.com/dubai-developments.html']
    link=""
    page_number=2

    def parse(self,response):
        all =response.css("div.row.blog-masonry div.element-item.devPage div.post-item.post_bg a::attr('href')").extract()

        for one in all:
            self.link = one
            yield response.follow(one,callback = self.page)

        next_page = f"https://www.providentestate.com/dubai-developments.html/page/{self.page_number}/"
        if next_page is not None and self.page_number <7:
            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)
        else:
            # pass
            data = {'message': 'prov comm done (;'}
            # response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = provCoomItem()
        signature = uuid.uuid1()

        title = "N/A"
        description = "N/A"
        bedrooms = "N/A"
        developer = "N/A"
        area = "N/A"
        price = "N/A"
        near_by_places = "N/A"
        payment_plan = "N/A"
        location = "N/A"
        amentities = "N/A"
        unit_sizes = []
        video = "N/A"
        features = "N/A"
        images = "N/A"

        title= response.css("div.col-sm-12.col-xs-12.col-lg-9.col-md-9.container-contentbar h1.development-header::text").get()   
        arr=response.css('div.wpb_text_column.wpb_content_element  div.wpb_wrapper .DB_content *').extract()
        if len(arr)==0:
            arr=response.css('div.wpb_text_column.wpb_content_element  div.wpb_wrapper *').extract()   
        all_titles=[]
        all_des=[]
        for i in range(len(arr)):
            if (arr[i].startswith("<h3") or arr[i].startswith("<h5")) and "<img" not in arr[i]:
                title1=BeautifulSoup(arr[i],"lxml").text
                all_titles.append(title1)
                s=i+1
                result=""
                while s<len(arr):
                    if ((arr[s].startswith("<h3") or arr[s].startswith("<h5")) and "<img" not in arr[s]):
                        break
                    else:
                        try:
                            one=BeautifulSoup(arr[s],"lxml").text
                        except:
                            one=""    
                        result+=one
                        s+=1
                        continue
                result=result.replace("\n","").replace("\t","").replace("  ","").replace("\r","")    
                all_des.append(result)
                i=s    
            else:
                continue
        all_content=[]
        if len(all_titles)==len(all_des) and len(all_des)>0:        
            for i in range(len(all_titles)):
                all_content.append({all_titles[i]:all_des[i]})
        else:
            article=BeautifulSoup(response.css("article.dubai-developments.type-dubai-developments.status-publish.has-post-thumbnail.hentry .entry-content").get(),"lxml").text.replace("\n","").replace("\t","").replace("  ","").replace("\r","")   
            if(len(article)>0):
                all_content.append(article)
                          


        
       
      
         

       
        items['title'] = title
        items['all_content'] = all_content

        yield items

# https://www.providentestate.com/dubai-developments/al-badaa-218.html
# https://www.providentestate.com/dubai-developments/al-garhoud-231.html