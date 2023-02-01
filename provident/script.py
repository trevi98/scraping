import subprocess

# Run the first spider
subprocess.call(["scrapy", "crawl", "buy"])
subprocess.call(["scrapy", "crawl", "rent"])
subprocess.call(["scrapy", "crawl", "communities"])
subprocess.call(["scrapy", "crawl", "offplan"])
# subprocess.call(["scrapy", "crawl", "why_dubai"])
# subprocess.call(["scrapy", "crawl", "offplan_villa"])
# subprocess.call(["scrapy", "crawl", "apartment_offplan"])
# subprocess.call(["scrapy", "crawl", "blog"])
# subprocess.call(["scrapy", "crawl", "building","-o","bayut_building.csv"])
# subprocess.call(["scrapy", "crawl", "buy","-o","bayut_buy.csv"])
# subprocess.call(["scrapy", "crawl", "rent","-o","bayut_rent.csv"])
# subprocess.call(["scrapy", "crawl", "test","-o","file2.csv"])

# Run the second spider``