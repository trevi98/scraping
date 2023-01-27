# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class OprItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    pass
class OprProjectItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    details = scrapy.Field()
    price = scrapy.Field()
    area = scrapy.Field()
    location_details = scrapy.Field()
    developer = scrapy.Field()
    brochour = scrapy.Field()
    amenities = scrapy.Field()
    nearby = scrapy.Field()
    payment_plan = scrapy.Field()

    # pass
