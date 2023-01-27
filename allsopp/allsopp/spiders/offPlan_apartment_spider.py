import scrapy
from bs4 import BeautifulSoup
from ..items import ApartmentOffplanItem
from .helpers import methods
from scrapy.http import FormRequest
import json
import requests


# from .file_downloader import img_downloader
import uuid
class AllsoppspiderSpider(scrapy.Spider):
    name = 'offplan'
    start_urls = ['https://api.allsoppandallsopp.com/dubai/buyers/off-plan']
    page_number=2
    link=""

    def start_requests(self):
    # page = 1    
        # for page in range(1,2):
        yield FormRequest(url=self.start_urls[0], callback=self.parse, method='GET', formdata={},headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0","Accept": "*/*","Accept-Language": "en-US,en;q=0.5","Accept-Encoding": "gzip, deflate, br","Referer": "https://opr.ae/","Origin": "https://opr.ae","Connection": "keep-alive","Sec-Fetch-Dest": "empty","Sec-Fetch-Mode": "no-cors","Sec-Fetch-Site": "same-site","TE": "trailers","Content-Type": "application/x-www-form-urlencoded; charset=UTF-8","Pragma": "no-cache","Cache-Control": "no-cache"})
        # else:
            # data = {'message': 'opr project done'}
            # response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)


    def parse(self, response):
        items = ApartmentOffplanItem()
        signature = uuid.uuid1()
        res = json.loads(response.text)
        for project in res['data']['data']:
            items['title'] = project['attributes']['name']
            items['area'] = project['attributes']['area']
            items['priceFrom'] = project['attributes']['priceFrom']
            items['priceTo'] = project['attributes']['priceTo']
            items['description'] = project['attributes']['description'].replace("\n","")
            items['handoverDate'] = project['attributes']['handoverDate'].replace("\n","")
            try:
                items['location'] = project['attributes']['location'].replace("\n","")
            except:
                items['location'] = "N\A"
            items['featuredImage'] = methods.img_downloader_method_from_list([project['attributes']['featuredImage']['data']['attributes']['url']],signature)
            try:
                items['brochure'] = project['attributes']['Brochure']['data']['url']
            except:
                items['brochure'] = "N\A"
            items['property_developers'] = project['attributes']['property_developers']['data'][0]['attributes']['name'].replace("\n","")
            floor_plans = []
            try:
                for i in project['attributes']['floorPlan']['data']:
                    floor_plans.append(i['attributes']['url'])
            except:
                floor_plans = []
            items['floor_plans'] = methods.img_downloader_method_from_list(floor_plans,signature)
            yield items
        data = {'message': 'allsop offplan done (;'}
        response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
     