import subprocess

# Run the first spider
subprocess.call(["scrapy", "crawl", "area"])
subprocess.call(["scrapy", "crawl", "bitcoin"])
subprocess.call(["scrapy", "crawl", "offplan"])
subprocess.call(["scrapy", "crawl", "buy"])
subprocess.call(["scrapy", "crawl", "rent"])
subprocess.call(["scrapy", "crawl", "ejari"])
subprocess.call(["scrapy", "crawl", "expo"])
subprocess.call(["scrapy", "crawl", "golden"])
subprocess.call(["scrapy", "crawl", "residence"])
# subprocess.call(["scrapy", "crawl", "building","-o","bayut_building.csv"])
# subprocess.call(["scrapy", "crawl", "buy","-o","bayut_buy.csv"])
# subprocess.call(["scrapy", "crawl", "rent","-o","bayut_rent.csv"])
# subprocess.call(["scrapy", "crawl", "test","-o","file2.csv"])

# Run the second spider``