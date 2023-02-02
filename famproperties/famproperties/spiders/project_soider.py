import scrapy
from ..items import ProjectItem
import requests
from bs4 import BeautifulSoup
from .helpers import methods
from .helpers2 import methods2
from .file_downloader import img_downloader
import uuid


class testingSpider(scrapy.Spider):
    name = 'project'
    start_urls = ["https://famproperties.com/wwv_flow.ajax?p_context=dubai/towers/5498150147240"]
    page_number = 1
    link = ""


    # def start_requests(self):
    #     headers = {
    #     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0",
    #     "Accept": "text/html, */*; q=0.01",
    #     "Accept-Language": "en-US,en;q=0.5",
    #     "Accept-Encoding": "gzip, deflate, br",
    #     "Referer": "https://famproperties.com/blog",
    #     "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    #     "X-Requested-With": "XMLHttpRequest",
    #     "Origin": "https://famproperties.com",
    #     "Connection": "keep-alive",
    #     "Cookie": "CUSTOM_COOKIE_ID=4633652932077; _gcl_au=1.1.1906389347.1672265186; _ga_3RRTXWHSW6=GS1.1.1673997863.30.0.1673997912.0.0.0; _ga=GA1.2.597841303.1672265186; _clck=s62wzb|1|f8c|0; _hjSessionUser_2666275=eyJpZCI6IjY5MjQxMGY4LTIxMDMtNTQzMS1iOWNmLWYyOGQ3ODkzOGQ2MCIsImNyZWF0ZWQiOjE2NzIyNjUxODgzMzksImV4aXN0aW5nIjp0cnVlfQ==; intercom-id-ipmidsv4=7c6a4867-9051-4008-a377-274d6debd9d7; intercom-session-ipmidsv4=; intercom-device-id-ipmidsv4=9806e6ba-8b7a-4919-a492-ff90453c9340; _clsk=cm4ufe|1673997870679|1|1|f.clarity.ms/collect; FAMWEB=ORA_WWV-p-8QN6e3IOWkQS-eZr6NQjDa; _hjIncludedInSessionSample=0; _hjSession_2666275=eyJpZCI6Ijg2MGJjM2NlLTYwNGMtNGVlZi1iYzk1LTMxOGQ4NThlZWIwYyIsImNyZWF"}

    #     formdata = {
    #                 "p_flow_id": "115",
    #                 "p_flow_step_id": "83",
    #                 "p_instance": "1968482249759",
    #                 "p_debug": "",
    #                 "p_request": "PLUGIN=UkVHSU9OIFRZUEV-fjEzMzg3MTU2Mzc3NzM4MTcyNjM5/_2dnggAruVFY-sT4sP9-MDSIZpYKIoR2fWgqLU5kgKY",
    #                 "p_widget_action": "paginate",
    #                 "p_pg_min_row": "16",
    #                 "p_pg_max_rows": "15",
    #                 "p_pg_rows_fetched": "15",
    #                 "x01": "13387156377738172639",
    #                 "p_json": '{"pageItems":{"itemsToSubmit":[{"n":"P83_BLOG_TAG","v":""}],"protected":"UDBfU0VBUkNIX0xBQkVMOlAwX0VOUVVJUkVfTEFCRUw6UDgzX1BBR0VfVElUTEU6.,UDgzX1BBR0VfSU5UUk8/28zvvYEskG55slRz0PNRsqxIBH9Vk1KjoJs4jy3kxAw","rowVersion":"","formRegionChecksums":[]},"salt":"285891478776056900738339417705195178360"}'
    #             }

    #     yield scrapy.FormRequest(url=self.start_urls[0], method='POST', headers=headers, formdata=formdata, callback=self.parse)


    def parse(self,response):
        # items = TestscrapyItem()
        for i in range(1,501,25):
            payload = "p_flow_id=115&p_flow_step_id=29&p_instance=1929486615519&p_debug=&p_request=PLUGIN%3DUkVHSU9OIFRZUEV-fjIwODkyNDM4MjcxNzc5Njk1OTUw%2FFI93kyV0cGLVWm844qntF9-esjbhdtdZiZp06JxqkoY&p_widget_action=paginate&p_pg_min_row="+str(i)+"&p_pg_max_rows=26&p_pg_rows_fetched=26&x01=20892438271779695950&p_json=%7B%22pageItems%22%3A%7B%22itemsToSubmit%22%3A%5B%7B%22n%22%3A%22P29_PROPERTY_TYPE%22%2C%22v%22%3A%22%22%7D%2C%7B%22n%22%3A%22P29_PROJECT%22%2C%22v%22%3A%22%22%7D%2C%7B%22n%22%3A%22P29_AREA%22%2C%22v%22%3A%22%22%7D%2C%7B%22n%22%3A%22P29_DEVELOPER%22%2C%22v%22%3A%22%22%7D%2C%7B%22n%22%3A%22P29_IS_OFFPLAN%22%2C%22v%22%3A%22%22%7D%2C%7B%22n%22%3A%22P29_LIFE_STYLE%22%2C%22v%22%3A%22%22%7D%5D%2C%22protected%22%3A%22UDBfU0VBUkNIX0xBQkVMOlAwX0VOUVVJUkVfTEFCRUw6UDI5X0RFVkVMT1BFUl9P.%2CTkxZ%2FL3e2jIoxsTREfCY0ofAz4qPgJuYGJsPeufDRzbdKcsI%22%2C%22rowVersion%22%3A%22%22%2C%22formRegionChecksums%22%3A%5B%5D%7D%2C%22salt%22%3A%22129064879188340507083470318607087196926%22%7D"
            headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/110.0',
            'Accept': 'text/html, */*; q=0.01',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Referer': 'https://famproperties.com/real-estate-projects-dubai',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
            'Origin': 'https://famproperties.com',
            'Connection': 'keep-alive',
            'Cookie': 'CUSTOM_COOKIE_ID=4633652932077; _gcl_au=1.1.1906389347.1672265186; _ga_3RRTXWHSW6=GS1.1.1674833286.50.1.1674835337.0.0.0; _ga=GA1.2.597841303.1672265186; _clck=s62wzb|1|f8m|0; _hjSessionUser_2666275=eyJpZCI6IjY5MjQxMGY4LTIxMDMtNTQzMS1iOWNmLWYyOGQ3ODkzOGQ2MCIsImNyZWF0ZWQiOjE2NzIyNjUxODgzMzksImV4aXN0aW5nIjp0cnVlfQ==; intercom-id-ipmidsv4=7c6a4867-9051-4008-a377-274d6debd9d7; intercom-device-id-ipmidsv4=9806e6ba-8b7a-4919-a492-ff90453c9340; _fbp=fb.1.1674110364716.746202708; _gid=GA1.2.1559244980.1674823502; _clsk=3enuvi|1674835211988|4|1|f.clarity.ms/collect; FAMWEB=ORA_WWV-eMKZU3UGEaoO1crsb3sNgBNl; _hjIncludedInSessionSample=0; _hjSession_2666275=eyJpZCI6IjUxY2I1YTI3LWViOGEtNDU5Ni1iMWFiLTEyMTk4NmIwNzExMSIsImNyZWF0ZWQiOjE2NzQ4MzUxNjI5MDAsImluU2FtcGxlIjpmYWxzZX0=; _hjIncludedInPageviewSample=1; _hjAbsoluteSessionInProgress=0',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin'
            }

            response_api = requests.request("POST",self.start_urls[0], headers=headers, data=payload)
            soup = BeautifulSoup(response_api.text,'lxml')
            # print(";;;;;;;;;;;;;;;;;;;;;;;;;;;;;________________;;;;;;;;;;;;;")
            # print(soup)
            # print(";;;;;;;;;;;;;;;;;;;;;;;;;;;;;________________;;;;;;;;;;;;;")
            links = soup.find_all('a',class_="t-Button u-color-10 t-Button--simple t-Button--primary t-Button--icon t-Button--large t-Button--iconRight")
            # print('??????????????????????????/')
            # print(links)
            # print('??????????????????????????/')
            for link in links:
                one = link['href']
                print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                print(one)
                print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                # page = requests.request("GET",'https://famproperties.com'+one, headers=headers)
                yield response.follow('https://famproperties.com'+one,callback = self.page)
                # page = BeautifulSoup(page.text,'lxml')
                # title = page.find(id="project").find('h1').text
                # print("////////////____________/////////////////")
                # print(title)
                # print("////////////____________/////////////////")
            data = {'message': 'machine 1 | fam blog done (;'}
            # response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)

    def page(self,response):
        signature = uuid.uuid1()
        # print("////////////_______________////////////////////////")
        items = ProjectItem()
        items['title'] = response.css("title::text").get().replace("\n","").replace("  ","").replace("\t","").replace("\r","")
        items['price'] = BeautifulSoup(response.css(".sub-heading.padding-top-lg.padding-bottom-lg.u-textLeft.padding-left-md").get(),'lxml').text.replace("\n","").replace("  ","").replace("Starting price","").replace("\t","").replace("\r","")
        info = BeautifulSoup(response.css('.padding-top-none.padding-bottom-lg.col.col-8.dflex.flex-row').get(),'lxml').find_all('div',class_='highlight-option')
        items['info'] = []
        for i in info:
            items['info'].append(i.text.replace('\n','').replace('  ','').replace("\t","").replace("\r",""))
        # amenities = response.css("#R22528583529857287712_Cards .a-CardView-headerBody::text").extract()
        # items['amenities'] = []
        # for i in amenities:
        #     items['amenities'].append(i)
        #     print("///////////////////////////////______________/////////////////////////")
        #     print(i )
        #     print("///////////////////////////////______________/////////////////////////")
        # views = ""
        # try:
        #     views = response.css("##R28304969147843077156_Cards li::text").exract()
        #     items['views'] = []
        #     for i in views:
        #         items['views'].append(i.text.replace('\n','').replace('  ','').replace("\t","").replace("\r",""))
        # except:
        #     pass
        items['overview'] = BeautifulSoup(response.css('#overview').get(),'lxml').text.replace("\n","").replace("  ","").replace("\t","").replace("\r","")
        # temp = response.css("#building-types_Cards li::text").extract()
        # items['buildings'] = []
        # for building in temp:
        #     items['buildings'].append(building.replace("\n","").replace("\t","").replace("\r","").replace("  ",""))
        # items['description'] = BeautifulSoup(response.css("#R5729311864314920614").get(),'lxml').text.replace("\n","").replace("  ","").replace("","-")
        items['images'] = methods.img_downloader_method(response.css("#R23240284213309688160").get(),signature)
        items["answers"] = []
        items["questions"] = []
        q = response.css("#R23553218534876868012_report .dflex.flex-col h3::text").extract()
        for i in q:
            items['questions'].append(i.replace("\n","").replace("\t","").replace("\r","").replace("  ",""))
        q = response.css("#R23553218534876868012_report .dflex.flex-col div::text").extract()
        for i in q:
            items['answers'].append(i.replace("\n","").replace("\t","").replace("\r","").replace("  ",""))
        yield items
        # print("////////////_______________////////////////////////")