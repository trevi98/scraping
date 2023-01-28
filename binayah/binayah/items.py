# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class BinayahItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    pass
class AreaItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    description = scrapy.Field()
    map_plan = scrapy.Field()
    signature = scrapy.Field()

class OffplanItem(scrapy.Item):
    # define the fields for your item here like:
    images = scrapy.Field()
    signature = scrapy.Field()
    amenities_name = scrapy.Field()
    amenities_description = scrapy.Field()
    amenities_list = scrapy.Field()
    attractions = scrapy.Field()
    payments_sizes = scrapy.Field()
    floorplans = scrapy.Field()
    property_info = scrapy.Field()
    title = scrapy.Field()
    description = scrapy.Field()
    video = scrapy.Field()
    # pass

class buyItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    price = scrapy.Field()
    location = scrapy.Field()
    description = scrapy.Field()
    property = scrapy.Field()
    # pass

class rentItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    price = scrapy.Field()
    location = scrapy.Field()
    description = scrapy.Field()
    property = scrapy.Field()
    # pass


class goldenItem(scrapy.Item):
    # define the fields for your item here like:
    qustions_answers = scrapy.Field()
    titles = scrapy.Field()
    content = scrapy.Field()
    # pass


class ejariItem(scrapy.Item):
    # define the fields for your item here like:
    qustions_answers = scrapy.Field()
    titles = scrapy.Field()
    content = scrapy.Field()
    # pass

class expoItem(scrapy.Item):
    # define the fields for your item here like:
    qustions_answers = scrapy.Field()
    title = scrapy.Field()
    description = scrapy.Field()
    # pass

class residenceVisaItem(scrapy.Item):
    # define the fields for your item here like:
    qustions_answers = scrapy.Field()
    title = scrapy.Field()
    description = scrapy.Field()


class bitcoinItem(scrapy.Item):
    # define the fields for your item here like:
    description = scrapy.Field()
    sub_titles = scrapy.Field()

    # pass


