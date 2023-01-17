import scrapy
from ..items import HausOffPlanItem
import uuid
from .helpers import methods
from .file_downloader import img_downloader
from .helpers2 import methods2
from bs4 import BeautifulSoup
import requests


class HausspiderSpider(scrapy.Spider):
    name = 'hausspider'
    start_urls = ['https://www.hausandhaus.com/new-developments/developments-of-properties-in-dubai']
    link=""
    page_number=2

    def parse(self,response):
        # items = TestscrapyItem()
        all = response.css("div.card.card-primary.property.results-property div.col-sm-6.col-xs-12.card-content.box.box-2 div.content-wrapper a.btn.btn-black.btn-details.btn-animate::attr('href')").extract()

        for one in all:
            self.link = one
            yield response.follow('https://www.hausandhaus.com/'+one,callback = self.page)

        next_page = f"https://www.hausandhaus.com/new-developments/developments-of-properties-in-dubai/page-{self.page_number}/"
        if next_page is not None and self.page_number < 6:
            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)
        else:
            # pass
            data = {'message': 'driven offplan villa done'}
            response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = HausOffPlanItem()
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
        title = response.css("div.intro-content div.titile::text").get()
        overview=response.css("div.main section.section-developments-details div.section-body section.section-header div.container header div.heading h2::text").get()
        brochure_link=response.css("div.main section.section-developments-details div.section-body section.section-header div.container header div.btn-group a::attr('href')")[1].get()
        brochure=img_downloader.download(brochure_link,signature,99)
        location=response.css("div.main section.section-developments-details div.section-body section.section-header div.container section.details.clearfix div.row.wrapper div.col-xs-12.contents div.item-details div.item-location::text").get()
        developer=response.css("div.main section.section-developments-details div.section-body section.section-header div.container section.details.clearfix div.row.wrapper div.col-xs-12.contents div.item-details div.item-developer::text").get()
        develpment_type=response.css("div.main section.section-developments-details div.section-body section.section-header div.container section.details.clearfix div.row.wrapper div.col-xs-12.contents div.item-details div.item-building::text").get()
        completion_date=response.css("div.main section.section-developments-details div.section-body section.section-header div.container section.details.clearfix div.row.wrapper div.col-xs-12.contents div.item-details div.item-date::text").get()
        price=response.css("div.main section.section-developments-details div.section-body section.section-header div.container section.details.clearfix div.row.wrapper div.col-xs-12.contents div.item-details div.item-price::text").get()
        # text = response.css(".col-xl-12.col-lg-12.col-md-12.col-sm-12.col-12 .dpx-area-white.dpx-content-area.dpx-content-area-padding p::text").extract()
        # description = response.css("div.main section.section-developments-details div.section-body section.section-header div.container h1.project-title::text").get()
        # highlights_keys = ['price','developer','area','bedrooms']
        # highlights = methods2.get_text_from_same_element_multiple_and_seperate_to_key_value(response.css(".col-xl-12.col-lg-12.col-md-12.col-sm-12.col-12 .dpx-area-white.dpx-content-area.dpx-content-area-padding ul li").extract(),{'keys':["Bedrooms",'Developer','Area','Price']})

        # for key in highlights_keys:
        #     if key not in highlights.keys():
        #         highlights[key] = ""

        # amentities = methods2.get_text_as_list_form_simeler_elmnts(response.css(".dpx-project-amenities .col-xl-2.col-lg-2.col-md-2.col-sm-2.col-6").extract())
        # images = methods.img_downloader_method_src(response.css(".carousel-inner").get(),signature)

        # payment_plan = methods2.get_text_as_list_form_simeler_elmnts(response.css(".dpx-project-payment-section.dpx-area-white.dpx-content-area.dpx-content-area-padding .col-xl-3.col-lg-3.col-md-3.col-sm-3.col-12").extract())
        # location = response.css(".dpx-project-privileged-location-area p::text").get()
        # near_by_places = methods2.get_text_as_list_form_simeler_elmnts(response.css(".dpx-project-privileged-location-area td").extract())
        # if len(near_by_places) == 0:
        #     near_by_places = methods2.get_text_as_list_form_simeler_elmnts(response.css(".dpx-project-privileged-location-area ul li").extract())
        # try:
        #     table = response.css(".dpx-project-unit-sizes- tr").extract()
        #     for row in table:
        #         soup = BeautifulSoup(row,'lxml')
        #         tds = soup.find_all('td')
        #         unit_sizes.append({'bedrooms':tds[0].text.replace("\n",""),'size':tds[1].text.replace("\n",""),'price':tds[2].text.replace("\n","")})
        # except:
        #     unit_sizes = "N\A"
        # description = soup.find_all('p')
       
        items['images'] = methods.img_downloader_method_src(response.css("section.section-developments-details div.section-body div.section-slider div.container div.prop-slider-wrapper.prop-slider div.slider.slider-developments-details").get(),signature)
        items['title'] = title
        items['overview'] = overview
        items['brochure'] = brochure
        items['location'] = location
        items['developer'] = developer
        items['develpment_type'] = develpment_type
        items['completion_date'] = completion_date
        items['signature'] = signature
        items['price'] = price
        # items['description'] = description
        # items['price'] = highlights['price']
        # items['developer'] = highlights['developer']
        # items['area'] = highlights['area']
        # items['bedrooms'] = highlights['bedrooms']
        # items['amentities'] = amentities
        # items['images'] = images
        # items['payment_plan'] = payment_plan
        # items['near_by_places'] = near_by_places
        # items['unit_sizes'] = unit_sizes
        # items['signature'] = signature

        yield items
#for images
