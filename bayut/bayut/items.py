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
    title = scrapy.Field()
    highlights = scrapy.Field()
    property = scrapy.Field()
    payment = scrapy.Field()
    location = scrapy.Field()

class BayutAreaReadyItem(scrapy.Item):
    title = scrapy.Field()
    cover = scrapy.Field()
    about = scrapy.Field()
    historical_background = scrapy.Field()
    master_development_plan = scrapy.Field()
    hotels = scrapy.Field()
    in_a_nutshell = scrapy.Field()
    community_overview = scrapy.Field()
    community_overview_table = scrapy.Field()
    properties = scrapy.Field()
    sale_trends = scrapy.Field()
    sale_trends_table = scrapy.Field()
    roi_table = scrapy.Field()
    roi = scrapy.Field()
    transportation_and_parking = scrapy.Field()
    public_transportation = scrapy.Field()
    community_events = scrapy.Field()
    supermarkets_near = scrapy.Field()
    mosques_near = scrapy.Field()
    other_placesof_worship_near = scrapy.Field()
    schools_near = scrapy.Field()
    clinics_and_hospitals_near = scrapy.Field()
    near_by_areas = scrapy.Field()
    malls_near = scrapy.Field()
    resturants_near = scrapy.Field()
    beaches_near = scrapy.Field()
    liesure_activities_and_notable_landmarks = scrapy.Field()
    outdoor_activities = scrapy.Field()
    attractions = scrapy.Field()
    things_to_consider = scrapy.Field()
    questions = scrapy.Field()
    answers = scrapy.Field()
    location = scrapy.Field()
    imgs = scrapy.Field()

class BayutAreaOffplanItem(scrapy.Item):
    title = scrapy.Field()
    cover = scrapy.Field()
    about = scrapy.Field()
    historical_background = scrapy.Field()
    master_development_plan = scrapy.Field()
    hotels = scrapy.Field()
    in_a_nutshell = scrapy.Field()
    community_overview = scrapy.Field()
    community_overview_table = scrapy.Field()
    properties = scrapy.Field()
    sale_trends = scrapy.Field()
    sale_trends_table = scrapy.Field()
    roi_table = scrapy.Field()
    roi = scrapy.Field()
    transportation_and_parking = scrapy.Field()
    public_transportation = scrapy.Field()
    community_events = scrapy.Field()
    supermarkets_near = scrapy.Field()
    mosques_near = scrapy.Field()
    other_placesof_worship_near = scrapy.Field()
    schools_near = scrapy.Field()
    clinics_and_hospitals_near = scrapy.Field()
    near_by_areas = scrapy.Field()
    malls_near = scrapy.Field()
    resturants_near = scrapy.Field()
    beaches_near = scrapy.Field()
    liesure_activities_and_notable_landmarks = scrapy.Field()
    outdoor_activities = scrapy.Field()
    attractions = scrapy.Field()
    things_to_consider = scrapy.Field()
    questions = scrapy.Field()
    answers = scrapy.Field()
    location = scrapy.Field()
    payment_plan = scrapy.Field()
    imgs = scrapy.Field()


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

class buildings_marinaItem(scrapy.Item):
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
