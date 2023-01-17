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
    title = scrapy.Field()
    area = scrapy.Field()
    priceFrom = scrapy.Field()
    priceTo = scrapy.Field()
    description = scrapy.Field()
    handoverDate = scrapy.Field()
    location = scrapy.Field()
    featuredImage = scrapy.Field()
    brochure = scrapy.Field()
    brochure = scrapy.Field()
    property_developers = scrapy.Field()
    floor_plans = scrapy.Field()

class BuyplanItem(scrapy.Item):
    title = scrapy.Field()
    description = scrapy.Field()
    bathrooms = scrapy.Field()
    lot_size = scrapy.Field()
    category = scrapy.Field()
    amentities = scrapy.Field()
    area = scrapy.Field()
    price = scrapy.Field()
class AreaItem(scrapy.Item):
    title = scrapy.Field()
    description = scrapy.Field()
    faqs = scrapy.Field()
  
