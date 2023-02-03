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
    unit_sizes = scrapy.Field()
    signature = scrapy.Field()
    # video = scrapy.Field()

class BuyItem(scrapy.Item):
    title = scrapy.Field()
    type = scrapy.Field()
    bedrooms = scrapy.Field()
    bathrooms = scrapy.Field()
    size = scrapy.Field()
    price = scrapy.Field()
    signature = scrapy.Field()
    area = scrapy.Field()
    amentities = scrapy.Field()
    # images = scrapy.Field()
    description = scrapy.Field()

class RentItem(scrapy.Item):
    title = scrapy.Field()
    type = scrapy.Field()
    bedrooms = scrapy.Field()
    bathrooms = scrapy.Field()
    size = scrapy.Field()
    price = scrapy.Field()
    signature = scrapy.Field()
    area = scrapy.Field()
    amentities = scrapy.Field()
    # images = scrapy.Field()
    description = scrapy.Field()

class BlogItem(scrapy.Item):
    title = scrapy.Field()
    content = scrapy.Field()
class WhyDubaiItem(scrapy.Item):
    content = scrapy.Field()
class AreaItem(scrapy.Item):
    title = scrapy.Field()
    about = scrapy.Field()
    questions = scrapy.Field()
    answers = scrapy.Field()

class developersItem(scrapy.Item):
    # define the fields for your item here like:
    about = scrapy.Field()
    CEO = scrapy.Field()

    # pass
class appartmentBuyLuxuryItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    developer = scrapy.Field()
    type = scrapy.Field()
    bedrooms = scrapy.Field()
    bathrooms = scrapy.Field()
    size = scrapy.Field()
    price = scrapy.Field()
    signature = scrapy.Field()
    area = scrapy.Field()
    amentities = scrapy.Field()
    images = scrapy.Field()
    description = scrapy.Field()

class BuypropertiesLuxuryItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    developer = scrapy.Field()
    type = scrapy.Field()
    bedrooms = scrapy.Field()
    bathrooms = scrapy.Field()
    size = scrapy.Field()
    price = scrapy.Field()
    signature = scrapy.Field()
    area = scrapy.Field()
    amentities = scrapy.Field()
    images = scrapy.Field()
    description = scrapy.Field()

class villaBuyLuxuryItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    developer = scrapy.Field()
    type = scrapy.Field()
    bedrooms = scrapy.Field()
    bathrooms = scrapy.Field()
    size = scrapy.Field()
    price = scrapy.Field()
    signature = scrapy.Field()
    area = scrapy.Field()
    amentities = scrapy.Field()
    images = scrapy.Field()
    description = scrapy.Field()

    # pass
class RentapartmentLuxuryItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    developer = scrapy.Field()
    type = scrapy.Field()
    bedrooms = scrapy.Field()
    bathrooms = scrapy.Field()
    size = scrapy.Field()
    price = scrapy.Field()
    signature = scrapy.Field()
    area = scrapy.Field()
    amentities = scrapy.Field()
    images = scrapy.Field()
    description = scrapy.Field()

    # pass
class RentVillaLuxuryItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    developer = scrapy.Field()
    type = scrapy.Field()
    bedrooms = scrapy.Field()
    bathrooms = scrapy.Field()
    size = scrapy.Field()
    price = scrapy.Field()
    signature = scrapy.Field()
    area = scrapy.Field()
    amentities = scrapy.Field()
    images = scrapy.Field()
    description = scrapy.Field()

    # pass