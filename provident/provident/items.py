# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class ProvidentOffplanItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    sub_titles = scrapy.Field()
    description = scrapy.Field()
    # overview = scrapy.Field()
    # features = scrapy.Field()
    # location = scrapy.Field()
    # amentities = scrapy.Field()
    # units = scrapy.Field()
    # payments = scrapy.Field()
    # images = scrapy.Field()
    signature = scrapy.Field()


class ProvBuyItem(scrapy.Item):
    # define the fields for your item here like:
    # images = scrapy.Field()
    title = scrapy.Field()
    type = scrapy.Field()
    location = scrapy.Field()
    price = scrapy.Field()
    developer = scrapy.Field()
    property = scrapy.Field()
    signature = scrapy.Field()
    description = scrapy.Field()
    features = scrapy.Field()


class ProvRenItem(scrapy.Item):
    # define the fields for your item here like:
    images = scrapy.Field()
    # title = scrapy.Field()
    # location = scrapy.Field()
    # price = scrapy.Field()
    # developer = scrapy.Field()
    # property = scrapy.Field()
    # signature = scrapy.Field()
    # description = scrapy.Field()
    # features = scrapy.Field()


class provCoomItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    all_content = scrapy.Field()


class Premier_Finance_spiderItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    descriptionHome = scrapy.Field()
    services = scrapy.Field()
class Primestay_Holiday_spiderItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    descriptionHome = scrapy.Field()
    in_holiday = scrapy.Field()
    In_just_5_steps_you_can_start_earning_great_returns_with_short_term_rentals_of_your_property_investment = scrapy.Field()


class Prism_Conveyance_spiderItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    descriptionHome = scrapy.Field()
    services = scrapy.Field()
    brochure = scrapy.Field()

    
class Second_Citizenship_spiderItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    descriptionHome = scrapy.Field()
    Why_Plan_B_Advisory_Services = scrapy.Field()

class Real_Estate_spiderItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    all_content = scrapy.Field()
    
