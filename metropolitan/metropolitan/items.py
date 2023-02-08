# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class MetropolitanItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    pass


class MetropolitanBlogItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    content = scrapy.Field()
    # html = scrapy.Field()
    link = scrapy.Field()
    
class MetropolitanProjectItem(scrapy.Item):
    # define the fields for your item here like:
    property_info = scrapy.Field()
    additional_info = scrapy.Field()
    property_prices = scrapy.Field()
    paragraphs = scrapy.Field()
    payments = scrapy.Field()
    location_details = scrapy.Field()
    details = scrapy.Field()
    floor_planes = scrapy.Field()
    title = scrapy.Field()
    signature = scrapy.Field()
    brochour = scrapy.Field()
    images = scrapy.Field()

class MetropolitanbuyItem(scrapy.Item):
    # define the fields for your item here like:
    images = scrapy.Field()
    signature = scrapy.Field()
    bedrooms = scrapy.Field()
    bathrooms = scrapy.Field()
    size = scrapy.Field()
    parking = scrapy.Field()
    title = scrapy.Field()
    area = scrapy.Field()
    price = scrapy.Field()
    price_per_sqft = scrapy.Field()
    description = scrapy.Field()
    amenities = scrapy.Field()
    status = scrapy.Field()

class MetropolitanrentItem(scrapy.Item):
    # define the fields for your item here like:
    images = scrapy.Field()
    signature = scrapy.Field()
    details = scrapy.Field()
    title = scrapy.Field()
    location = scrapy.Field()
    price = scrapy.Field()
    price_per_sqft = scrapy.Field()
    project_details = scrapy.Field()
    amentities = scrapy.Field()
    developer = scrapy.Field()
    information = scrapy.Field()

class propertyBuyItem(scrapy.Item):
    # define the fields for your item here like:
    titleHome = scrapy.Field()
    descriptions = scrapy.Field()
    buying_property = scrapy.Field()
    helping = scrapy.Field()
    buying_on_the_secondary_market = scrapy.Field()
    buying_property = scrapy.Field()
    buying_off_plan_properties = scrapy.Field()
    Off_plan_purchase_explained = scrapy.Field()

class propertSellItem(scrapy.Item):
    # define the fields for your item here like:
    titleHome = scrapy.Field()
    marketing = scrapy.Field()

class propertRentItem(scrapy.Item):
    # define the fields for your item here like:
    titleHome = scrapy.Field()
    descriptions = scrapy.Field()
    market_analysis = scrapy.Field()
    Rental_Process_Going = scrapy.Field()
    costs_renting = scrapy.Field()
    description_Rental_Process_Going = scrapy.Field()
    
class areaItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    content = scrapy.Field()
   
    
