import scrapy
from scrapy.http import FormRequest
from ..items import PropertyfinderProjectItem
import requests
from bs4 import BeautifulSoup
from .helpers import methods
from .helpers2 import methods2
from .file_downloader import img_downloader
import uuid


class testingSpider(scrapy.Spider):
    link = ""
    name = 'project'
    start_urls = ["https://www.propertyfinder.ae/en/new-projects?location_id=1&page=1&q=Dubai&sort=-featured"]
    page_number = 2


    def parse(self,response):
        # items = TestscrapyItem()
        all = response.css("a._3CeWVKEE::attr(href)").extract()

        for one in all:
            self.link = one
            yield response.follow(one,callback = self.page)

        next_page = f"https://www.propertyfinder.ae/en/new-projects?location_id=1&page={self.page_number}&q=Dubai&sort=-featured"
        if next_page is not None and self.page_number < 61:

            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)
        else:
            data = {"message":"property_finder project done"}
            response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        signature = uuid.uuid1()
        items = PropertyfinderProjectItem()
        title = response.css("._14Az7GMC::text").get().replace("\n","").replace("  ","")
        developer = response.css("._1KmX3mFx::text").get().replace("\n","").replace("  ","")
        # starting_price = response.css("._1-htALWL::text").extract()[0].replace("\n","").replace("  ","")
        # status = response.css("._1-htALWL::text").extract()[2].replace("\n","").replace("  ","")
        # delivery_date = response.css("._1-htALWL::text").extract()[3].replace("\n","").replace("  ","")
        # bedrooms = response.css("._1-htALWL::text").extract()[5].replace("\n","").replace("  ","")
        description = response.css("._3RInl69y").get().replace("\n","").replace("  ","")
        soup = BeautifulSoup(description, 'lxml')
        description = soup.get_text().replace("\n","").replace("  ","")
        area = ""
        try:
            area = response.css("._3XeJbDEl span::text").get().replace("\n","").replace("  ","")
        except:
            area = "N\A"
        amenities = methods2.get_text_as_list_form_simeler_elmnts(response.css(".Rg_Gr9Bz .tFA-5K61").extract())
        property_info = methods2.get_text_from_same_element_multiple_and_seperate_to_key_value(response.css("._3cmr8pr- ._1-jqWgJk").extract(),{'keys':['Price From','Price per sqft','Status','Delivery Date','Total units','Bedrooms']})

            

        # content = response.css(".entry-content ::text").extract()
        # description = response.css(".author-description::text").get()
        items['floor_plans'] = methods.get_img_with_content(response.css("._3aGmg8xc").extract(),signature)
        # items['floor_plans'] = methods.get_img_src_with_content(response.css("._3aGmg8xc").extract())
        items['images'] = methods.img_downloader_method_src(response.css("._3ln2ZAA3").get(),signature)
        items['title'] = title
        items['developer'] = developer
        # items['starting_price'] = starting_price
        # items['status'] = status
        # items['delivery_date'] = delivery_date
        items['property_info'] = property_info
        items['description'] = description.replace("\n","").replace("  ","").replace("\t","").replace("\r","")
        items['area'] = area
        items['payment_plans'] = methods2.get_text_as_list_form_simeler_elmnts(response.css("._3JgIBxPe .WXs_a4IU").extract())
        # items['link'] = self.link
        items['amenities'] = amenities

        yield items
