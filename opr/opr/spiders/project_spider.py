import scrapy
from ..items import OprProjectItem
import requests
from bs4 import BeautifulSoup
from .helpers import methods
from .helpers2 import methods2
from .file_downloader import img_downloader
import uuid


class testingSpider(scrapy.Spider):
    name = 'project'
    start_urls = ["https://api.opr.ae/offplan/"]
    page_number = 1
    link = ""
    titles = ""
    developer = ""

    def parse(self,response):
        # items = TestscrapyItem()
        for i in range(1,17,1):
            payload = "action=getList&city=Dubai&onlyVR=false&target=_self&page="+str(i)+"&language=EN&project_name=&type=*&ls=*&minPrice=*&maxPrice=*&developer=*&area=*&iop=30"
            headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/110.0',
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Referer': 'https://opr.ae/',
            'Origin': 'https://opr.ae',
            'Connection': 'keep-alive',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'no-cors',
            'Sec-Fetch-Site': 'same-site',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache',
            'TE': 'trailers'
            }

            response_api = requests.request("POST",self.start_urls[0], headers=headers, data=payload)
            soup = BeautifulSoup(response_api.text,'lxml')
            # print(";;;;;;;;;;;;;;;;;;;;;;;;;;;;;________________;;;;;;;;;;;;;")
            # print(soup)
            # print(";;;;;;;;;;;;;;;;;;;;;;;;;;;;;________________;;;;;;;;;;;;;")
            links = soup.find_all('div',class_="offPlanListing__item")
            # print('??????????????????????????/')
            # print(links)
            # print('??????????????????????????/')
            tracker = 0
            for link in links:
                tracker +=1
                if tracker <= 30:
                    one = link.a['href']
                    self.link = one
                    self.title = link.find('a',class_="offPlanListing__item-titleLink").text.replace("\n","").replace("\t","").replace("\r","").replace("  ","")
                    self.developer = link.find('div',class_="offPlanListing__item-developer").text.replace("\n","").replace("\t","").replace("\r","").replace("  ","")
                    # print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                    # print(one)
                    # print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                    yield response.follow(one,callback = self.page)
                else:
                    break
            data = {'message': 'machine 1 | fam blog done (;'}
            # response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)

    def page(self,response):
        signature = uuid.uuid1()
        items = OprProjectItem()
        # items['title'] = self.title.replace("  ","").replace("\t","").replace("\r","")
        items['title'] = self.title
        try:
            items['details'] = BeautifulSoup(response.css(".css139 .textable.css136").get(),'lxml').text.replace("\n","").replace("  ","").replace("\t","").replace("\r","")
        except:
            # items['details'] = BeautifulSoup(response.css(".css142 .textable.css143").get(),'lxml').text.replace("\n","").replace("  ","").replace("\t","").replace("\r","")
            print("/////////////////__________________/////////////////////////////")
            print(self.link)
            print("/////////////////__________________/////////////////////////////")
        # items['price'] = BeautifulSoup(response.css(".textable.css130 strong").get(),'lxml').text.replace("\n","").replace("  ","").replace("Price from AED","").replace("\t","").replace("\r","")
        # items['area'] = BeautifulSoup(response.css(".textable.css212 strong").get(),'lxml').text.replace("\n","").replace("  ","").replace("Price from AED","").replace("\t","").replace("\r","")
        # items['location_details'] = BeautifulSoup(response.css(".css224 .textable.css155").get(),'lxml').text.replace("\n","").replace("  ","").replace("Price from AED","").replace("\t","").replace("\r","")

        items['developer'] = self.developer
        items['brochour'] = img_downloader.download("https://cdn.opr.ae/brochures/"+self.title.replace(" ","-").lower()+".pdf",signature,99)

        temp = response.css(".node.widget-element.widget.css196").extract()
        items['amenities'] = []
        for i in temp:
            items['amenities'].append(BeautifulSoup(i,'lxml').text.replace("\n","").replace("  ","").replace("\t","").replace("\r",""))
        temp = response.css(".node.widget-element.widget.css228").extract()
        items['nearby'] = []
        for i in temp:
            items['nearby'].append(BeautifulSoup(i,'lxml').text.replace("\n","").replace("  ","").replace("\t","").replace("\r",""))
        temp = response.css(".node.widget-element.widget.css259").extract()
        items['payment_plan'] = []
        for i in temp:
            items['payment_plan'].append(BeautifulSoup(i,'lxml').text.replace("\n","").replace("  ","").replace("\t","").replace("\r",""))
        yield items
