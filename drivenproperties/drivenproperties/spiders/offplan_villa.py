import scrapy
from ..items import ApartmentOffplanItem
import requests
from bs4 import BeautifulSoup
from .helpers import methods
from .helpers2 import methods2
from .file_downloader import img_downloader
import uuid


class testingSpider(scrapy.Spider):
    name = 'offplan_villa'
    start_urls = ["https://www.drivenproperties.com/dubai/off-plan-villas-for-sale?page=1"]
    page_number = 2
    link = ""


    def parse(self,response):
        # items = TestscrapyItem()
        all = response.css(".col-xl-4.col-lg-4.col-md-4.col-sm-4.col-12 a::attr(href)").extract()

        for one in all:
            self.link = one
            yield response.follow('https://www.drivenproperties.com/'+one,callback = self.page)

        next_page = f"https://www.drivenproperties.com/dubai/off-plan-villas-for-sale?page={self.page_number}/"
        if next_page is not None and self.page_number < 3:
            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)
        else:
            # pass
            data = {'message': 'driven offplan villa done'}
            response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = ApartmentOffplanItem()
        title = response.css(".project-header__title::text").get()
        elmnts = response.css('li.as_lits-item').extract()
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
        images = "N/A"
        title = response.css("h1.dpx-headings::text").get().replace("\n","")
        text = response.css(".col-xl-12.col-lg-12.col-md-12.col-sm-12.col-12 .dpx-area-white.dpx-content-area.dpx-content-area-padding p::text").extract()
        description = ''.join(text).replace("\n","")
        highlights_keys = ['price','developer','area','bedrooms']
        highlights = methods2.get_text_from_same_element_multiple_and_seperate_to_key_value(response.css(".col-xl-12.col-lg-12.col-md-12.col-sm-12.col-12 .dpx-area-white.dpx-content-area.dpx-content-area-padding ul li").extract(),{'keys':["Bedrooms",'Developer','Area','Price']})

        for key in highlights_keys:
            if key not in highlights.keys():
                highlights[key] = ""

        amentities = methods2.get_text_as_list_form_simeler_elmnts(response.css(".dpx-project-amenities .col-xl-2.col-lg-2.col-md-2.col-sm-2.col-6").extract())
        images = methods.img_downloader_method_src(response.css(".carousel-inner").get(),signature)

        payment_plan = methods2.get_text_as_list_form_simeler_elmnts(response.css(".dpx-project-payment-section.dpx-area-white.dpx-content-area.dpx-content-area-padding .col-xl-3.col-lg-3.col-md-3.col-sm-3.col-12").extract())
        location = response.css(".dpx-project-privileged-location-area p::text").get()
        near_by_places = methods2.get_text_as_list_form_simeler_elmnts(response.css(".dpx-project-privileged-location-area td").extract())
        if len(near_by_places) == 0:
            near_by_places = methods2.get_text_as_list_form_simeler_elmnts(response.css(".dpx-project-privileged-location-area ul li").extract())
        try:
            table = response.css(".dpx-project-unit-sizes- tr").extract()
            for row in table:
                soup = BeautifulSoup(row,'lxml')
                tds = soup.find_all('td')
                unit_sizes.append({'bedrooms':tds[0].text.replace("\n",""),'size':tds[1].text.replace("\n",""),'price':tds[2].text.replace("\n","")})
        except:
            unit_sizes = "N\A"
        # description = soup.find_all('p')
       
        # images = methods.img_downloader_method(elmnt,signature)

        items['title'] = title
        items['description'] = description
        items['price'] = highlights['price']
        items['developer'] = highlights['developer']
        items['area'] = highlights['area']
        items['bedrooms'] = highlights['bedrooms']
        items['amentities'] = amentities
        items['images'] = images
        items['payment_plan'] = payment_plan
        items['location'] = location
        items['near_by_places'] = near_by_places
        items['unit_sizes'] = unit_sizes
        items['signature'] = signature

        yield items


    def get_text(self,elmnt):
        soup = BeautifulSoup(elmnt,'lxml')
        return soup.get_text()
