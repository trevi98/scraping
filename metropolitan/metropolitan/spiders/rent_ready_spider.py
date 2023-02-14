import scrapy
from ..items import MetropolitanbuyItem
import requests
from bs4 import BeautifulSoup
from .helpers import methods
# from .helpers2 import methods2
from .file_downloader import img_downloader
import uuid


class testingSpider(scrapy.Spider):
    name = 'buy_ready_metro'
    start_urls = ["https://metropolitan.realestate/ajax-listing.php"]
    page_number = 1
    link = ""


    def parse(self,response):
        for i in range(1,59,1):
            payload = "action=listing&type=buy&page="+str(i)+"&ln=en"
            headers = {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/110.0',
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'utf_8',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
            'Origin': 'https://metropolitan.realestate',
            'Alt-Used': 'metropolitan.realestate',
            'Connection': 'keep-alive',
            'Referer': 'https://metropolitan.realestate/buy/?type=buy',
            'Cookie': 'filter_currency=AED; geo_details=AE%2C%20Dubai; filter_area=ft; filter_mode=auto; user_group=2; _ga=GA1.2.644520284.1669030340; c2d_utm={}; _gcl_au=1.1.1954369952.1675433953; _scid=8a6015da-354e-45df-b51b-35b1939febd2; rngst=%7B%22clientId%22%3A%2259abddd5-47df-41b7-9d48-b7a541e25caf%22%7D; tmr_lvid=c4a39b134446bb41c713d3decbd89761; tmr_lvidTS=1669030340364; _ym_uid=1669030340737546394; _ym_d=1675433957; rngst2=%7B%22utmz%22%3A%7B%22utm_source%22%3A%22codebeautify.org%22%2C%22utm_medium%22%3A%22referral%22%2C%22utm_campaign%22%3A%22(direct)%22%2C%22utm_content%22%3A%22(not%20set)%22%2C%22utm_term%22%3A%22(none)%22%7D%2C%22sl%22%3A%22e7191e53-7f3c-4afd-95e9-825db461f39c%22%7D; marquiz__url_params={}; cto_bundle=aXWhcl9Rck12bXMlMkIzJTJCJTJGZUZpT0VLSEMxJTJCRVk5YlBCZHhKaWV0blMzOGJqMSUyQm5PQkpkRFV5Tk1WVVh3eUlHY0lwcnNLYUVSbVpkbFFOSEhVaDJzeDdTN0Q1MmcwT0NZdWNoT0t6c05MOERQWVVSV2oyc0pYTjFGVUh5dWpuMGFLWnNvVURqdWF0Z1NvS3NTMVVjejB1QlZHRWJnJTNEJTNE; _sctr=1|1675368000000; _gid=GA1.2.1682074182.1675661965; tmr_detect=1%7C1675837624571; marquiz__count-opened_614361ea5b39ad004f375728=1; wp-wpml_current_language=en; _ym_isad=1; _ym_visorc=w; pup_mailchimp=closed; marquiz__count-opened_5fff398bf5a793004603d73d=1; _uetsid=9d15e780a5e011edb772794ff1d6c65d; _uetvid=28ba3020699011ed816eefdddc16314b; rngst_callback=%7B%22callbackNumber%22%3Afalse%2C%22inactive_project%22%3Afalse%2C%22ip_is_blocked%22%3Afalse%2C%22recaptcha%22%3A0%7D; rngst1=%7B%22%22%3A%5B0%2C1%2C2%2C3%2C4%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C17%2C23%5D%2C%22callMe%22%3A%5B5%2C16%2C18%2C19%2C20%2C21%2C22%2C24%2C25%5D%2C%22numbers%22%3Atrue%7D; _gat_UA-159948526-17=1; filter_area=ft; filter_currency=AED; filter_mode=auto',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'TE': 'trailers'
            }

            response_api = requests.request("POST",self.start_urls[0], headers=headers, data=payload)

            soup = BeautifulSoup(response_api.text,'lxml')
           
            links = soup.select(".property .property__link.property__link_title")
            for link in links:
                one = link['href']
                # print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                # print(one)
                # print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                yield response.follow(one,callback = self.page)

            data = {'message': 'machine 1 | fam blog done (;'}
            # response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)

    def page(self,response):
        signature = uuid.uuid1()
        items = MetropolitanbuyItem()
        items['title'] = self.sanitize(response.css('.main-info__title::text').get())
        items['price'] = self.sanitize(response.css(".info-price__value::text").get())
        items['description'] = self.get_text_from_large_elmnt(response.css(".main-info__writeup").get())
        area = self.sanitize(response.css(".info-location__text.info-location__text_link::text").get())
        if not area:
            area = self.sanitize(response.css('.info-location__text.info-location__text_span::text').get())
        items['area'] = area
        items['price_per_sqft'] = self.sanitize(response.css(".info-price__value-per-sq::text").get())
        items['bedrooms'] = self.sanitize(self.get_text_from_pares(response.css('.info-details__item').extract(),'Bedrooms','span'))
        items['bathrooms'] = self.sanitize(self.get_text_from_pares(response.css('.info-details__item').extract(),'Baths','span'))
        items['size'] = self.sanitize(self.get_text_from_pares(response.css('.info-details__item').extract(),'Square','span'))
        items['parking'] = self.sanitize(self.get_text_from_pares(response.css('.info-details__item').extract(),'Parking','span'))
        items['status'] = self.get_text_from_pares__get_entire_elmnt_text_and_delete_key_text(response.css('.project-details__table.project-table tr').extract(),'Status')
        items['amenities'] = self.make_list(response.css('.facilities__col.facilities__col_list .facilities__item-list.list-facilities li').extract())
        items['images'] = methods.img_downloader_method(response.css("#gallery").get(),signature)
        # info = BeautifulSoup(response.css('.padding-top-none.padding-bottom-lg.col.col-8.dflex.flex-row').get(),'lxml').find_all('div',class_='highlight-option')
        # items['info'] = []
        # for i in info:
        #     items['info'].append(i.text.replace('\n','').replace('  ','').replace("\t","").replace("\r",""))
        # items['overview'] = BeautifulSoup(response.css('#overview').get(),'lxml').text.replace("\n","").replace("  ","").replace("\t","").replace("\r","")
        # items["answers"] = []
        # items["questions"] = []
        # q = response.css("#R23553218534876868012_report .dflex.flex-col h3::text").extract()
        # for i in q:
        #     items['questions'].append(i.replace("\n","").replace("\t","").replace("\r","").replace("  ",""))
        # q = response.css("#R23553218534876868012_report .dflex.flex-col div::text").extract()
        # for i in q:
        #     items['answers'].append(i.replace("\n","").replace("\t","").replace("\r","").replace("  ",""))
        
        yield items



    def sanitize(self,text):
        try:
            return text.replace("\n","").replace("\t","").replace("\r","").replace("  ","")
        except:
            return text

    def get_text_from_pares(self,elmnts,key,value_selector):
        result = ""
        for elmnt in elmnts:
            try:
                soup = BeautifulSoup(elmnt,'lxml')
                txt = soup.text
                if key in txt:
                    result = soup.find(value_selector).text
            except:
                pass
        return result


    def get_text_from_pares__get_entire_elmnt_text_and_delete_key_text(self,elmnts,key):
        result = ""
        for elmnt in elmnts:
            try:
                soup = BeautifulSoup(elmnt,'lxml')
                txt = soup.text
                if key in txt:
                    result = soup.text.replace(key,'')
            except:
                pass
        return self.sanitize(result)



    def make_list(self,elmnts):
        results = []
        for elmnt in elmnts:
            try:
                results.append(self.sanitize(BeautifulSoup(elmnt,'lxml').text))
            except:
                pass
        return results

    def get_text_from_large_elmnt(self,elmnt):
        try:
            return self.sanitize(BeautifulSoup(elmnt,'lxml').text)
        except:
            return BeautifulSoup(elmnt,'lxml').text
