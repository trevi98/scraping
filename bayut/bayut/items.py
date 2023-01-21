# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class BayutItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    pass

class BayutBlogItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    title = scrapy.Field()
    content = scrapy.Field()
    # html = scrapy.Field()
    # link = scrapy.Field()

class BayutBuildingItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    title = scrapy.Field()
    highlights = scrapy.Field()
    details = scrapy.Field()
    amenities = scrapy.Field()
    # html = scrapy.Field()
    link = scrapy.Field()

class BayutBuyItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    title = scrapy.Field()
    property_type = scrapy.Field()
    price = scrapy.Field()
    size = scrapy.Field()
    bedrooms = scrapy.Field()
    bathrooms = scrapy.Field()
    description = scrapy.Field()
    area = scrapy.Field()
    amenities = scrapy.Field()
    furnishing = scrapy.Field()
    completion = scrapy.Field()
    developer = scrapy.Field()
    ownership = scrapy.Field()
    plot_area = scrapy.Field()
    builtup_area = scrapy.Field()
    usage = scrapy.Field()
    # link = scrapy.Field()
    # tags = scrapy.Field()

class BayutAreaItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    title = scrapy.Field()
    highlights = scrapy.Field()
    property = scrapy.Field()
    payment = scrapy.Field()
    location = scrapy.Field()
    # link = scrapy.Field()
    # html = scrapy.Field()

class BayutProjectItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    title = scrapy.Field()
    description = scrapy.Field()
    starting_price = scrapy.Field()
    status = scrapy.Field()
    delivery_date = scrapy.Field()
    bedrooms = scrapy.Field()
    area = scrapy.Field()
    link = scrapy.Field()
    developer = scrapy.Field()
