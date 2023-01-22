import subprocess

# Run the first spider
subprocess.call(["scrapy", "crawl", "area"])
subprocess.call(["scrapy", "crawl", "blog"])
subprocess.call(["scrapy", "crawl", "project"])
subprocess.call(["scrapy", "crawl", "building"])
subprocess.call(["scrapy", "crawl", "buy"])
subprocess.call(["scrapy", "crawl", "rent"])
# subprocess.call(["scrapy", "crawl", "blog","-o","bayut_blog.csv"])
# subprocess.call(["scrapy", "crawl", "building","-o","bayut_building.csv"])
# subprocess.call(["scrapy", "crawl", "buy","-o","bayut_buy.csv"])
# subprocess.call(["scrapy", "crawl", "rent","-o","bayut_rent.csv"])
# subprocess.call(["scrapy", "crawl", "test","-o","file2.csv"])

# Run the second spider``