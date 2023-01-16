# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class DrivenpropertiesItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    pass
class ApartmentOffplanItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    description = scrapy.Field()
    bedrooms = scrapy.Field()
    developer = scrapy.Field()
    area = scrapy.Field()
    price = scrapy.Field()
    amentities = scrapy.Field()
    images = scrapy.Field()
    payment_plan = scrapy.Field()
    location = scrapy.Field()
    near_by_places = scrapy.Field()
    # amentities = scrapy.Field()
    # unit_sizes = scrapy.Field()
    # video = scrapy.Field()
