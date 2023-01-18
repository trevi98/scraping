# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class ProvidentOffplanItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    overview = scrapy.Field()
    features = scrapy.Field()
    location = scrapy.Field()
    amentities = scrapy.Field()
    units = scrapy.Field()
    payments = scrapy.Field()
    
