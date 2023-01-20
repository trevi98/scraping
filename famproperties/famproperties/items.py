# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class FampropertiesItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    pass
class BlogItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    description = scrapy.Field()
    # pass
class ProjectItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    price = scrapy.Field()
    info = scrapy.Field()
    amenities = scrapy.Field()
    overview = scrapy.Field()
    views = scrapy.Field()
    # pass
