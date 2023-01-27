import scrapy
from ..items import TallestItem
import requests
from bs4 import BeautifulSoup
from .helpers import methods
from .helpers2 import methods2
from .file_downloader import img_downloader
import uuid


class testingSpider(scrapy.Spider):
    name = 'new_dev'
    start_urls = ["https://famproperties.com/wwv_flow.ajax?p_context=dubai/new-developments/12387459421362"]
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
        for i in range(1,500,250):
            payload = "p_flow_id=115&p_flow_step_id=50&p_instance=8269974743048&p_debug=&p_request=PLUGIN%3DUkVHSU9OIFRZUEV-fjEyODk3NDg1MjgxNDkyMTUzNDMw%2FYyuQyoKy9epoHXhJwwt6gfpszVn8n9GS59Os7XNJZGI&p_widget_action=paginate&p_pg_min_row="+str(i)+"&p_pg_max_rows=500&p_pg_rows_fetched=500&x01=12897485281492153430&p_json=%7B%22pageItems%22%3A%7B%22itemsToSubmit%22%3A%5B%7B%22n%22%3A%22P50_DEV_URL%22%2C%22v%22%3A%22%22%7D%5D%2C%22protected%22%3A%22UDBfU0VBUkNIX0xBQkVMOlAwX0VOUVVJUkVfTEFCRUw%2FGrCEfQFjHZneeTO6pPELFcQB618bSZCpUkuLmHxyig4%22%2C%22rowVersion%22%3A%22%22%2C%22formRegionChecksums%22%3A%5B%5D%7D%2C%22salt%22%3A%22232388085963739213028140329872758923501%22%7D"
            headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/110.0',
            'Accept': 'text/html, */*; q=0.01',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Referer': 'https://famproperties.com/list-of-new-development-projects-in-dubai',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
            'Origin': 'https://famproperties.com',
            'Connection': 'keep-alive',
            'Cookie': 'CUSTOM_COOKIE_ID=4633652932077; _gcl_au=1.1.1906389347.1672265186; _ga_3RRTXWHSW6=GS1.1.1674441273.48.1.1674443138.0.0.0; _ga=GA1.2.597841303.1672265186; _clck=s62wzb|1|f8i|0; _hjSessionUser_2666275=eyJpZCI6IjY5MjQxMGY4LTIxMDMtNTQzMS1iOWNmLWYyOGQ3ODkzOGQ2MCIsImNyZWF0ZWQiOjE2NzIyNjUxODgzMzksImV4aXN0aW5nIjp0cnVlfQ==; intercom-id-ipmidsv4=7c6a4867-9051-4008-a377-274d6debd9d7; intercom-device-id-ipmidsv4=9806e6ba-8b7a-4919-a492-ff90453c9340; _fbp=fb.1.1674110364716.746202708; _gid=GA1.2.1502634684.1674309217; _clsk=hwscvt|1674443042442|5|1|f.clarity.ms/collect; FAMWEB=ORA_WWV-etkhk6jxFnxQyynnXVyolrsx; _hjIncludedInSessionSample=0; _hjSession_2666275=eyJpZCI6IjY1ZDkzMWM0LWNjMjktNGU1NS05ODBkLTdlMDczZGFlNDU3MSIsImNyZWF0ZWQiOjE2NzQ0NDEyNzQxNzIsImluU2FtcGxlIjpmYWxzZX0=; _hjIncludedInPageviewSample=1; _hjAbsoluteSessionInProgress=0',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin'
            }

            response_api = requests.request("POST",self.start_urls[0], headers=headers, data=payload)
            soup = BeautifulSoup(response_api.text,'lxml')
            # print(";;;;;;;;;;;;;;;;;;;;;;;;;;;;;________________;;;;;;;;;;;;;")
            # print(soup)
            # print(";;;;;;;;;;;;;;;;;;;;;;;;;;;;;________________;;;;;;;;;;;;;"



            items = TallestItem()
            rows = soup.find('div',{"id":"report_12897485281492153430_catch"}).find_all('tr')
            items['row'] = []
            i = 1
            for row in rows:

                items['row'] = methods2.handle_table_rows_w_precent(row)
                yield items
            # yield items




            data = {'message': 'machine 1 | fam blog done (;'}
            # response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)

