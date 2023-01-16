# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class AllsoppItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    pass
class ApartmentOffplanItem(scrapy.Item):
    area=scrapy.Field()
    images=scrapy.Field()
    price=scrapy.Field()
    description=scrapy.Field()
    developer=scrapy.Field()
    handover_date=scrapy.Field()
    all_proximity=scrapy.Field()
    all_payment=scrapy.Field()

