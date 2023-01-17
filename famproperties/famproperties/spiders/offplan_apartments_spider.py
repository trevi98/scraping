import scrapy
from ..items import BlogItem
import requests
from bs4 import BeautifulSoup
from .helpers import methods
from .helpers2 import methods2
from .file_downloader import img_downloader
import uuid


class testingSpider(scrapy.Spider):
    name = 'blog'
    start_urls = ["https://famproperties.com/wwv_flow.ajax?p_context=dubai/blog/2999029875927"]
    page_number = 2
    link = ""


    def start_requests(self):
        data = {'p_flow_id': 115,
                'p_flow_step_id': 83,
                'p_instance': 2999029875927,
                'p_debug': '',
                'p_request': 'PLUGIN=UkVHSU9OIFRZUEV-fjEzMzg3MTU2Mzc3NzM4MTcyNjM5%2FJiK6LfMIvrTplbwVIxCR-Zc9Gik8ynLFkTdO6ww9zhs',
                'p_widget_action': 'paginate',
                'p_pg_min_row': 31,
                'p_pg_max_rows': 15,
                'p_pg_rows_fetched': 15,
                'x01': 13387156377738172639,
                'p_json': {"pageItems":{"itemsToSubmit":[{"n":"P83_BLOG_TAG","v":""}],
                            "protected":"UDBfU0VBUkNIX0xBQkVMOlAwX0VOUVVJUkVfTEFCRUw6UDgzX1BBR0VfVElUTEU6.,UDgzX1BBR0VfSU5UUk8/LwJIcRJ_6uG-BD1Jt-xFb2MCWEli0CIoIX7cMJj1Rfo",
                            "rowVersion":"","formRegionChecksums":[]},
                            "salt":"2778054051538403860208466185672077057"}}
        for key, value in data.items():
            if isinstance(value, int):
                data[key] = str(value)
        yield scrapy.FormRequest(url=self.start_urls[0], formdata=data, callback=self.parse)


    def parse(self,response):
        # items = TestscrapyItem()
        print("//////////////////////____________////////////////////////")
        print(response.text)
        print("//////////////////////____________////////////////////////")