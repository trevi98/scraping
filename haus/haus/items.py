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
    payments = scrapy.Field()
    floorplan = scrapy.Field()
    video = scrapy.Field()
    # pass
class HausBuyItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    images = scrapy.Field()
    brochure = scrapy.Field()
    signature = scrapy.Field()
    price = scrapy.Field()
    property_info = scrapy.Field()
    overview = scrapy.Field()
    features = scrapy.Field()

class HausRentItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    images = scrapy.Field()
    brochure = scrapy.Field()
    signature = scrapy.Field()
    price = scrapy.Field()
    property_info = scrapy.Field()
    overview = scrapy.Field()
    features = scrapy.Field()

    
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


class HausinvestmentItem(scrapy.Item):
    # define the fields for your item here like:
    title=scrapy.Field()
    description=scrapy.Field()


class HauswhyoffplanItem(scrapy.Item):
    # define the fields for your item here like:
    titleHome=scrapy.Field()
    descriptionHome=scrapy.Field()
    title_choose_haus=scrapy.Field()
    list_choose_haus=scrapy.Field()
    article=scrapy.Field()
    developers_overview=scrapy.Field()


class sellRentCommercialItem(scrapy.Item):
    # define the fields for your item here like:
    titleHome=scrapy.Field()
    descriptionHome=scrapy.Field()
    article=scrapy.Field()

    
class buyersCommercialItem(scrapy.Item):
    # define the fields for your item here like:
    titleHome=scrapy.Field()
    descriptionHome=scrapy.Field()
    article=scrapy.Field()

class tenantsCommercialItem(scrapy.Item):
    # define the fields for your item here like:
    titleHome=scrapy.Field()
    descriptionHome=scrapy.Field()
    article=scrapy.Field()
    
