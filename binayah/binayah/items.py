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
    amenities = scrapy.Field()
    coverImage = scrapy.Field()
    description = scrapy.Field()
    map_plan = scrapy.Field()
    signature = scrapy.Field()

class OffplanItem(scrapy.Item):
    # define the fields for your item here like:
    images = scrapy.Field()
    signature = scrapy.Field()
    amenities = scrapy.Field()
    attractions = scrapy.Field()
    type_size = scrapy.Field()
    images_floor_plan = scrapy.Field()
    property_info = scrapy.Field()
    title = scrapy.Field()
    description = scrapy.Field()
    type = scrapy.Field()
    video = scrapy.Field()
    image_location = scrapy.Field()
    payment_plan = scrapy.Field()
    # pass

class villas_saleItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    price = scrapy.Field()
    location = scrapy.Field()
    description = scrapy.Field()
    amenities = scrapy.Field()
    type = scrapy.Field()
    porpuse = scrapy.Field()
    details = scrapy.Field()

    # pass
    
class apartments_saleItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    price = scrapy.Field()
    location = scrapy.Field()
    description = scrapy.Field()
    amenities = scrapy.Field()
    type = scrapy.Field()
    porpuse = scrapy.Field()
    details = scrapy.Field()

    # pass


class townhouses_saleItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    price = scrapy.Field()
    location = scrapy.Field()
    description = scrapy.Field()
    amenities = scrapy.Field()
    type = scrapy.Field()
    porpuse = scrapy.Field()
    details = scrapy.Field()

    # pass


class penthouses_saleItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    price = scrapy.Field()
    location = scrapy.Field()
    description = scrapy.Field()
    amenities = scrapy.Field()
    type = scrapy.Field()
    porpuse = scrapy.Field()
    details = scrapy.Field()

    # pass

class offices_saleItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    price = scrapy.Field()
    location = scrapy.Field()
    description = scrapy.Field()
    amenities = scrapy.Field()
    type = scrapy.Field()
    porpuse = scrapy.Field()
    details = scrapy.Field()

    # pass

class duplex_saleItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    price = scrapy.Field()
    location = scrapy.Field()
    description = scrapy.Field()
    amenities = scrapy.Field()
    type = scrapy.Field()
    porpuse = scrapy.Field()
    details = scrapy.Field()

    # pass


class Warehouse_saleItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    price = scrapy.Field()
    location = scrapy.Field()
    description = scrapy.Field()
    amenities = scrapy.Field()
    type = scrapy.Field()
    porpuse = scrapy.Field()
    details = scrapy.Field()

    # pass

class staff_accommodation_saleItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    price = scrapy.Field()
    location = scrapy.Field()
    description = scrapy.Field()
    amenities = scrapy.Field()
    type = scrapy.Field()
    porpuse = scrapy.Field()
    details = scrapy.Field()
    # pass

class land_saleItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    price = scrapy.Field()
    location = scrapy.Field()
    description = scrapy.Field()
    amenities = scrapy.Field()
    type = scrapy.Field()
    porpuse = scrapy.Field()
    details = scrapy.Field()
    # pass

class luxury_saleItem(scrapy.Item):
    # define the fields for your item here like:
    images = scrapy.Field()
    title = scrapy.Field()
    price = scrapy.Field()
    project_details = scrapy.Field()
    about = scrapy.Field()
    amenities = scrapy.Field()
    type = scrapy.Field()
    amenities_description = scrapy.Field()
    life_at = scrapy.Field()
    signature = scrapy.Field()
    # pass

class villas_rentItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    price = scrapy.Field()
    location = scrapy.Field()
    description = scrapy.Field()
    amenities = scrapy.Field()
    type = scrapy.Field()
    porpuse = scrapy.Field()
    details = scrapy.Field()
    # pass


class apartments_rentItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    price = scrapy.Field()
    location = scrapy.Field()
    description = scrapy.Field()
    amenities = scrapy.Field()
    type = scrapy.Field()
    porpuse = scrapy.Field()
    details = scrapy.Field()
    # pass

class offices_rentItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()
    price = scrapy.Field()
    location = scrapy.Field()
    description = scrapy.Field()
    amenities = scrapy.Field()
    type = scrapy.Field()
    porpuse = scrapy.Field()
    details = scrapy.Field()
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


