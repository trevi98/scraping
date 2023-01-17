# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class HausItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    pass
class HausOffPlanItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    overview = scrapy.Field()
    description = scrapy.Field()
    brochure = scrapy.Field()
    location = scrapy.Field()
    developer = scrapy.Field()
    develpment_type = scrapy.Field()
    completion_date = scrapy.Field()
    price = scrapy.Field()
    pass
