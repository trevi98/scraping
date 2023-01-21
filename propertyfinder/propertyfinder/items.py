# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class PropertyfinderItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    pass

class PropertyfinderBlogItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    title = scrapy.Field()
    content = scrapy.Field()
    # html = scrapy.Field()

class PropertyfinderBuyItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    title = scrapy.Field()
    property_type = scrapy.Field()
    price = scrapy.Field()
    bedrooms = scrapy.Field()
    bathrooms = scrapy.Field()
    size = scrapy.Field()
    area = scrapy.Field()
    description = scrapy.Field()
    amenities = scrapy.Field()
    property_age = scrapy.Field()
    service_charge = scrapy.Field()
    ownership = scrapy.Field()
    reference = scrapy.Field()
    # agentbrn = scrapy.Field()
    trakheesi_permit = scrapy.Field()
    tags = scrapy.Field()
    # link = scrapy.Field()
    floor_plans = scrapy.Field()

class PropertyfinderAreaItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    title = scrapy.Field()
    description = scrapy.Field()
    questions = scrapy.Field()
    answers = scrapy.Field()

class PropertyfinderProjectItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    floor_plans = scrapy.Field()
    title = scrapy.Field()
    description = scrapy.Field()
    # starting_price = scrapy.Field()
    # status = scrapy.Field()
    # delivery_date = scrapy.Field()
    property_info = scrapy.Field()
    payment_plans = scrapy.Field()
    images = scrapy.Field()
    area = scrapy.Field()
    # link = scrapy.Field()
    developer = scrapy.Field()
    amenities = scrapy.Field()
