# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class ProvidentOffplanItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    overview = scrapy.Field()
    features = scrapy.Field()
    location = scrapy.Field()
    amentities = scrapy.Field()
    units = scrapy.Field()
    payments = scrapy.Field()
    images = scrapy.Field()
    signature = scrapy.Field()


class HausBuyItem(scrapy.Item):
    # define the fields for your item here like:
    images = scrapy.Field()
    title = scrapy.Field()
    location = scrapy.Field()
    price = scrapy.Field()
    developer = scrapy.Field()
    property = scrapy.Field()
    signature = scrapy.Field()
    description = scrapy.Field()
    features = scrapy.Field()


class HausRenItem(scrapy.Item):
    # define the fields for your item here like:
    images = scrapy.Field()
    title = scrapy.Field()
    location = scrapy.Field()
    price = scrapy.Field()
    developer = scrapy.Field()
    property = scrapy.Field()
    signature = scrapy.Field()
    description = scrapy.Field()
    features = scrapy.Field()


class HausCoomItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    description = scrapy.Field()
    
