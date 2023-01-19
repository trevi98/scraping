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
    images = scrapy.Field()
    signature = scrapy.Field()
    amentities = scrapy.Field()
    payments = scrapy.Field()
    # pass
class HausBuyItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    images = scrapy.Field()
    brochure = scrapy.Field()
    signature = scrapy.Field()
    price = scrapy.Field()
    bedrooms = scrapy.Field()
    bathrooms = scrapy.Field()
    size = scrapy.Field()
    description = scrapy.Field()
    amentities = scrapy.Field()

class HausRentItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    images = scrapy.Field()
    brochure = scrapy.Field()
    signature = scrapy.Field()
    price = scrapy.Field()
    bedrooms = scrapy.Field()
    bathrooms = scrapy.Field()
    size = scrapy.Field()
    description = scrapy.Field()
    amentities = scrapy.Field()

    
class HausTenantsGuideItem(scrapy.Item):
    # define the fields for your item here like:
    titleHome=scrapy.Field()
    descriptions=scrapy.Field()
    descriptionHome=scrapy.Field()


class HausBuyersGuideItem(scrapy.Item):
    # define the fields for your item here like:
    titleHome=scrapy.Field()
    descriptions=scrapy.Field()
    descriptionHome=scrapy.Field()


class HausSellersGuideItem(scrapy.Item):
    # define the fields for your item here like:
    titleHome=scrapy.Field()
    descriptions=scrapy.Field()
    descriptionHome=scrapy.Field()


class HausLandlordsGuideItem(scrapy.Item):
    # define the fields for your item here like:
    titleHome=scrapy.Field()
    descriptions=scrapy.Field()
    descriptionHome=scrapy.Field()

    
class HausAreaQuidesItem(scrapy.Item):
    # define the fields for your item here like:
    title=scrapy.Field()
    description=scrapy.Field()
    about=scrapy.Field()


class HausBlogInformationsItem(scrapy.Item):
    # define the fields for your item here like:
    title=scrapy.Field()
    description=scrapy.Field()
    overview=scrapy.Field()


class HausLastesNewsItem(scrapy.Item):
    # define the fields for your item here like:
    title=scrapy.Field()
    description=scrapy.Field()
    overview=scrapy.Field()
    
