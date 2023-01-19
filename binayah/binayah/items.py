# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class BinayahItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    pass
class AreaItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    description = scrapy.Field()
    map_plan = scrapy.Field()
    signature = scrapy.Field()
class OffplanItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    description = scrapy.Field()
    images = scrapy.Field()
    signature = scrapy.Field()
    # pass
