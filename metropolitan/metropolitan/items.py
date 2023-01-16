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
