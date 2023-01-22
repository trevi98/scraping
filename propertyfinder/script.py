import subprocess

# Run the first spider
# subprocess.call(["scrapy", "crawl", "area","-o","propertyfinder_area.csv"])
# subprocess.call(["scrapy", "crawl", "blog","-o","propertyfinder_blog.csv"])
subprocess.call(["scrapy", "crawl", "commercial_buy"])
subprocess.call(["scrapy", "crawl", "commercial_rent"])
subprocess.call(["scrapy", "crawl", "rent_guide"])
subprocess.call(["scrapy", "crawl", "buy_guide"])
subprocess.call(["scrapy", "crawl", "project"])
subprocess.call(["scrapy", "crawl", "area"])
subprocess.call(["scrapy", "crawl", "blog"])
subprocess.call(["scrapy", "crawl", "buy"])
subprocess.call(["scrapy", "crawl", "rent_m"])
subprocess.call(["scrapy", "crawl", "rent_y"])

# Run the second spider