import subprocess

# Run the first spider
subprocess.call(["scrapy", "crawl", "area"])
subprocess.call(["scrapy", "crawl", "apartments_sale"])
subprocess.call(["scrapy", "crawl", "apartments_rent"])
subprocess.call(["scrapy", "crawl", "bitcoin"])
subprocess.call(["scrapy", "crawl", "duplex_sale"])
subprocess.call(["scrapy", "crawl", "ejari"])
subprocess.call(["scrapy", "crawl", "expo"])
subprocess.call(["scrapy", "crawl", "golden"])
# subprocess.call(["scrapy", "crawl", "residence-visa"])
subprocess.call(["scrapy", "crawl", "land_sale"])
subprocess.call(["scrapy", "crawl", "luxury_sale"])
subprocess.call(["scrapy", "crawl", "offices_rent"])
subprocess.call(["scrapy", "crawl", "offices_sale"])
subprocess.call(["scrapy", "crawl", "penthouses_sale"])
subprocess.call(["scrapy", "crawl", "staff_accommodation_sale"])
subprocess.call(["scrapy", "crawl", "townhouses_sale"])
subprocess.call(["scrapy", "crawl", "villas_rent"])
subprocess.call(["scrapy", "crawl", "villas_sale"])
subprocess.call(["scrapy", "crawl", "Warehouse_sale"])
# subprocess.call(["scrapy", "crawl", "offplan"])

# subprocess.call(["scrapy", "crawl", "building","-o","bayut_building.csv"])
# subprocess.call(["scrapy", "crawl", "buy","-o","bayut_buy.csv"])
# subprocess.call(["scrapy", "crawl", "rent","-o","bayut_rent.csv"])
# subprocess.call(["scrapy", "crawl", "test","-o","file2.csv"])

# Run the second spider``