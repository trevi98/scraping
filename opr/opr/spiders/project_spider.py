import scrapy
from ..items import OprProjectItem
import requests
from scrapy.http import FormRequest
from bs4 import BeautifulSoup
from .helpers import methods
from .file_downloader import img_downloader
import uuid


class testingSpider(scrapy.Spider):
    name = 'project'
    start_urls = ["https://api.opr.ae/offplan"]
    page_number = 2


    def start_requests(self):
        # page = 1    
        for page in range(1,2):
            yield FormRequest(url=self.start_urls[0], callback=self.parse, method='POST', formdata={"action":"getList","city":"Dubai","onlyVR":"false","target":"_self","page":str(page),"language":"EN","project_name":"","type":"*","ls":"*","minPrice":"*","maxPrice":"*","developer":"*","area":"*","iop":"30"},headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0","Accept": "*/*","Accept-Language": "en-US,en;q=0.5","Accept-Encoding": "gzip, deflate, br","Referer": "https://opr.ae/","Origin": "https://opr.ae","Connection": "keep-alive","Sec-Fetch-Dest": "empty","Sec-Fetch-Mode": "no-cors","Sec-Fetch-Site": "same-site","TE": "trailers","Content-Type": "application/x-www-form-urlencoded; charset=UTF-8","Pragma": "no-cache","Cache-Control": "no-cache"})
        else:
            data = {'message': 'opr project done'}
            # response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)


    def parse(self,response):
        # items = TestscrapyItem()


        all = response.css("div.offPlanListing a.offPlanListing__item-blockLink::attr(href)").extract()
        for one in all:
            # yield response.follow(one,callback = self.page)
            yield FormRequest(url=one, callback=self.page, method='GET',headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0","Accept": "*/*","Accept-Language": "en-US,en;q=0.5","Accept-Encoding": "gzip, deflate, br","Referer": "https://opr.ae/","Origin": "https://opr.ae","Connection": "keep-alive","Sec-Fetch-Dest": "empty","Sec-Fetch-Mode": "no-cors","Sec-Fetch-Site": "same-site","TE": "trailers","Content-Type": "application/x-www-form-urlencoded; charset=UTF-8","Pragma": "no-cache","Cache-Control": "no-cache"})
            # print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            # print(one)
            # print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        # for i in 16:
        #     return FormRequest.from_response(
        #     response,
        #     formdata={'username': 'myusername', 'password': 'mypassword'},
        #     callback=self.parse_logged_in
        #     )
        # else:
        #     data = {'message': 'metro project done'}
        #     # response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)

        # next_page = f"https://metropolitan.realestate/projects/page/{self.page_number}/"
        # if next_page is not None and self.page_number < 170:
        #     self.page_number +=1
        #     yield response.follow(next_page,callback = self.parse)
        # else:
        #     # pass
        #     data = {'message': 'metro project done'}
            # response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = OprProjectItem()

        print("//////////////////////////_________________////////////////")
        print(response)
        # items['title'] = response.text
        print("//////////////////////////_________________////////////////")
        # soup = BeautifulSoup(response.css('html').get(),'lxml')
        # try:
        # x = soup.find('h1',class_='textable css144').get_text()
        # try:
        #     x = response.css("body").get()
        #     soup = BeautifulSoup(x,'lxml')
        #     x = soup.find('div',class_='node widget-grid widget lg-hidden css132').get_text()
        #     print("////////////////////__________________//////////////////")
        #     print(x)
        #     print("////////////////////__________________//////////////////")
        #     items['title'] = x
        # except:
        #     print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        #     print(response)
        #     print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        #     items['title'] = 'NA'
        # title = response.css("div.css135::text").get()
        # elmnts = response.css('li.as_lits-item').extract()
        signature = uuid.uuid1()
       
        yield items


    def get_text(self,elmnt):
        soup = BeautifulSoup(elmnt,'lxml')
        return soup.get_text()
