import scrapy
from scrapy.http import FormRequest
from ..items import PropertyfinderBuyItem
import requests
from bs4 import BeautifulSoup
from .helpers import methods
import uuid


class testingSpider(scrapy.Spider):
    link = ""
    name = 'buy'
    start_urls = ["https://www.propertyfinder.ae/en/search?c=1&l=1&ob=mr&page=1"]
    page_number = 2


    def parse(self,response):
        # items = TestscrapyItem()
        all = response.css("a.card__link::attr(href)").extract()

        for one in all:
            self.link = one
            yield response.follow(one,callback = self.page)

        next_page = f"https://www.propertyfinder.ae/en/search?c=1&l=1&ob=mr&page={self.page_number}"
        if next_page is not None and self.page_number < 3201:

            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)
        else:
            data = {"message":"property finder buy"}
            # response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):
        signature = uuid.uuid1()
        items = PropertyfinderBuyItem()
        title = response.css("h2.property-page__sub-title::text").get().replace("\n","").replace("\t","").replace("\r","").replace("  ","")
        tags = response.css("h1.property-page__title::text").get().replace("\n","").replace("\t","").replace("\r","").replace("  ","")
        property_facts = response.css("ul.property-facts").get().replace("\n","").replace("\t","").replace("\r","").replace("  ","")
        soup = BeautifulSoup(property_facts, 'lxml')

        # property_type = property_facts[0].css(".property-facts__value::text").get()
        lis = soup.find_all("li")
        bedrooms = "N/A"
        property_age = "N/A"
        ownership = "N/A"
        reference = "N/A"
        # agentbrn = "N/A"
        trakheesi_permit = "N/A"
        service_charge = "N/A"
        bathrooms = "N/A"
        property_type = "N/A"
        size = "N/A"
        for li in lis:
            if (li.find_all("div")[0].text.find("Bedrooms")) > -1:
                bedrooms = li.find_all("div")[1].text.replace("\n","").replace("\t","").replace("\r","").replace("  ","")
            if (li.find_all("div")[0].text.find("Bathrooms")) > -1:
                bathrooms = li.find_all("div")[1].text.replace("\n","").replace("\t","").replace("\r","").replace("  ","")
            if (li.find_all("div")[0].text.find("Property type")) > -1:
                property_type = li.find_all("div")[1].text.replace("\n","").replace("\t","").replace("\r","").replace("  ","")
            if (li.find_all("div")[0].text.find("Property size")) > -1:
                size = li.find_all("div")[1].text.replace("\n","").replace("\t","").replace("\r","").replace("  ","")
            if (li.find_all("div")[0].text.find("Property age")) > -1:
                property_age = li.find_all("div")[1].text.replace("\n","").replace("\t","").replace("\r","").replace("  ","")
            if (li.find_all("div")[0].text.find("Service Charges")) > -1:
                service_charge = li.find_all("div")[2].text.replace("\n","").replace("\t","").replace("\r","").replace("  ","")
        price = response.css(".property-price__price").getall()[1]
        soup = BeautifulSoup(price,'lxml')
        price = soup.text.replace("\n","").replace("\t","").replace("\r","").replace("  ","")
        description = response.css(".property-description__text-trim").get().replace("\n","").replace("\t","").replace("\r","").replace("  ","")
        soup = BeautifulSoup(description, 'lxml')
        description = soup.get_text().replace("\n","").replace("\t","").replace("\r","").replace("  ","")
        link = self.link
        area = response.css(".property-location__tower-name::text").get().replace("\n","").replace("\t","").replace("\r","").replace("  ","")
        temp = response.css(".property-amenities__list::text").extract()
        amenities = []
        for amenity in temp:
            amenities.append(amenity.replace("\n","").replace("\t","").replace("\r","").replace("  ",""))
        lis = response.css('.property-page__legal-list-area').get().replace("\n","").replace("\t","").replace("\r","").replace("  ","")
        soup = BeautifulSoup(lis, 'lxml')
        lis = ""
        lis = soup.find_all('li')

        for li in lis:
            # print()
            if (li.find_all("div")[0].text.find("Reference")) > -1:
                reference = li.find_all("div")[1].text.replace("\n","").replace("\t","").replace("\r","").replace("  ","")
            if (li.find_all("div")[0].text.find("Ownership")) > -1:
                ownership = li.find_all("div")[1].text.replace("\n","").replace("\t","").replace("\r","").replace("  ","")
            if (li.find_all("div")[0].text.find("Trakheesi Permit")) > -1:
                trakheesi_permit = li.find_all("div")[4].text.replace("\n","").replace("\t","").replace("\r","").replace("  ","")

            

        # content = response.css(".entry-content ::text").extract()
        # description = response.css(".author-description::text").get()
        items['title'] = title
        items['tags'] = tags
        items['property_type'] = property_type
        items['bedrooms'] = bedrooms
        items['bathrooms'] = bathrooms
        items['price'] = price
        items['description'] = description
        items['area'] = area
        # items['link'] = link
        items['amenities'] = amenities
        items['size'] = size
        items['property_age'] = property_age
        items['service_charge'] = service_charge
        items['ownership'] = ownership
        items['reference'] = reference
        items['trakheesi_permit'] = trakheesi_permit
        # items['floor_plans'] = response.css(".property-floor-plan-gallery__image::attr(src)").extract()
        items['floor_plans'] = methods.get_img_with_content(response.css("._3aGmg8xc").extract(),signature)
        yield items
