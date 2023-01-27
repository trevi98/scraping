import scrapy
from bs4 import BeautifulSoup
from ..items import AreaItem
from .helpers import methods
from scrapy.http import FormRequest
import json
import requests


# from .file_downloader import img_downloader
import uuid
class AllsoppspiderSpider(scrapy.Spider):
    name = 'area'
    start_urls = ['https://api.allsoppandallsopp.com/dubai/dubai-communities']
    page_number=2
    link=""

    def start_requests(self):
    # page = 1    
        # for page in range(1,2):
        yield FormRequest(url=self.start_urls[0], callback=self.parse, method='GET', formdata={},headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0","Accept": "*/*","Accept-Language": "en-US,en;q=0.5","Accept-Encoding": "gzip, deflate, br","Referer": "https://opr.ae/","Origin": "https://opr.ae","Connection": "keep-alive","Sec-Fetch-Dest": "empty","Sec-Fetch-Mode": "no-cors","Sec-Fetch-Site": "same-site","TE": "trailers","Content-Type": "application/x-www-form-urlencoded; charset=UTF-8","Pragma": "no-cache","Cache-Control": "no-cache"})
        # else:
        data = {'message': 'allsopp area done'}
        response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)


    def parse(self, response):
        items = AreaItem()
        signature = uuid.uuid1()
        res = json.loads(response.text)
        for project in res['data']['communities']['data']:
            items['title'] = project['attributes']['communityName'].replace("\n","")
            items['description'] = project['attributes']['contentVisible'].replace("\n","")
            faqs = {}
            for faq in project['attributes']['FAQ']:
                faqs[faq['question']] = faq['answer']
            items['faqs'] = faqs
            yield items
        data = {'message': 'machine 1 | allsop areae done (;'}
        response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
     