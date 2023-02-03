import scrapy
from ..items import MetropolitanProjectItem
import requests
from bs4 import BeautifulSoup
from .helpers import methods
from .file_downloader import img_downloader
import uuid


class testingSpider(scrapy.Spider):
    name = 'project'
    start_urls = ["https://metropolitan.realestate/projects"]
    page_number = 2


    def parse(self,response):
        # items = TestscrapyItem()
        all = response.css(".project__image-wrap a::attr(href)").extract()

        for one in all:
            yield response.follow(one,callback = self.page)

        next_page = f"https://metropolitan.realestate/projects/page/{self.page_number}/"
        if next_page is not None and self.page_number < 178:
            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)
        else:
            # pass
            data = {'message': 'metro project done'}
            # requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        items = MetropolitanProjectItem()
        title = response.css(".offplan__header-title::text").get()
        elmnts = response.css('li.as_lits-item').extract()
        signature = uuid.uuid1()

        property_info = []
        additional_info = []
        text = []
        pares = []
        payments = []
        location_details = []
        details = []
        floor_planes = []

        property_info = methods.get_nabor_elmnt(elmnts,[
            {'name':'location','target_selector':'as_lits-params','nabor_selector':'as_lits-title','nabor_value':'Location','target_element':'span','nabor_element':'span'},

            {'name':'developer','target_selector':'as_lits-params','nabor_selector':'as_lits-title','nabor_value':'Developer','target_element':'span','nabor_element':'span'},

            {'name':'status','target_selector':'as_lits-params','nabor_selector':'as_lits-title','nabor_value':'Status of Project','target_element':'span','nabor_element':'span'},

            {'name':'units','target_selector':'as_lits-params','nabor_selector':'as_lits-title','nabor_value':'Units','target_element':'span','nabor_element':'span'},

            {'name':'total_units','target_selector':'as_lits-params','nabor_selector':'as_lits-title','nabor_value':'Total Amount of Units','target_element':'span','nabor_element':'span'},

            {'name':'type','target_selector':'as_lits-params','nabor_selector':'as_lits-title','nabor_value':'Type of Project','target_element':'span','nabor_element':'span'},

            {'name':'starting_area','target_selector':'as_lits-params','nabor_selector':'as_lits-title','nabor_value':'Area from','target_element':'span','nabor_element':'span'},
            ])
        elmnts = response.css("div.as_grid-item").extract()
        additional_info = methods.get_nabor_elmnt(elmnts,[
            {'name':'starting_price','target_selector':'as_grid-params','nabor_selector':'as_grid-title','nabor_value':'Starting Price from','target_element':'span','nabor_element':'span'},
            {'name':'handover','target_selector':'as_grid-params','nabor_selector':'as_grid-title','nabor_value':'Handover','target_element':'span','nabor_element':'span'},
        ])
        elmnts = response.css('section.contentSection').extract()
        pares = methods.get_pares_from_elmnt(elmnts,[
            {'title_elmnt':'div','title_selector':'projectHeading','content_elmnt':'div','content_selector':'textBlock'},
            {'title_elmnt':'div','title_selector':'projectHeading','content_elmnt':'div','content_selector':'textBlock'}
        ])
        elmnts = response.css('div.as_grid-item').extract()
        payments = methods.get_pares_from_elmnt_if_contains(elmnts,[
            {'title_elmnt':'span','title_selector':'as_grid-params','content_elmnt':'span','content_selector':'as_grid-title','title_value':'%'},
            {'title_elmnt':'span','title_selector':'as_grid-params','content_elmnt':'span','content_selector':'as_grid-title','title_value':'%'}
        ])
        elmnts = response.css('section.contentSection').extract()
        location_details = methods.scrape_element_if_contains_extact(elmnts,[
            {'name':'location_details','checker_selector':'projectHeading','checker_value':'Location','checker_element':'div'},

        ])
        elmnts = response.css('section.contentSection').extract()
        details = methods.scrape_element_if_contains_target(elmnts,[
            {'target_selector':'projectHeading','target_element':'div'},

        ])
        elmnts = response.css('.fp__slider').extract()
        floor_planes = methods.get_img_with_content(elmnts,[
            {'target_selector':'fpSlider__desc-head','target_element':'div','signature':signature}
        ])
        dat = response.css(".gallerySlider").get()
        soup = BeautifulSoup(dat,'lxml')
        dat = soup.find('img',class_='owl-lazy')['data-src'].split('uploads/')[1].split('/')[0]+'/'+soup.find('img',class_='owl-lazy')['data-src'].split('uploads/')[1].split('/')[1]
        brochour = ""
        try:
            try:
                brochour = "https://metropolitan.realestate/wp-content/uploads/" + str(dat) + '/' + response.css(".breadcrumbs__current::text").get().replace(" ", "-") + '.pdf'
            except:
                brochour = "https://metropolitan.realestate/wp-content/uploads/" + str(dat) + '/' + response.css(".breadcrumbs__current::text").get() + '.pdf'
            brochour = img_downloader.download(brochour,signature,99)
        except:
            print("//////////________________/////////////////////")
            print(response)
            print(dat)
            print(title)
            print(title.replace(" ", "-") + '.pdf')
            print("//////////________________/////////////////////")
            pass
        elmnt = response.css('.gallerySlider').get()
        images = methods.img_downloader_method(elmnt,signature)
        items['property_info'] = property_info
        items['additional_info'] = additional_info
        items['property_prices'] = response.css(".container .row.advRow.as_grid .as_grid-cell.col-2 .as_grid-item .as_grid-params::text").get()
        items['paragraphs'] = pares
        items['payments'] = payments
        items['location_details'] = location_details
        items['details'] = details
        items['floor_planes'] = floor_planes
        items['title'] = title
        items['signature'] = signature
        items['brochour'] = brochour
        items['images'] = images
        yield items


    def get_text(self,elmnt):
        soup = BeautifulSoup(elmnt,'lxml')
        return soup.get_text()
