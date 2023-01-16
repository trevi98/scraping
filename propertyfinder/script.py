import subprocess

# Run the first spider
# subprocess.call(["scrapy", "crawl", "area","-o","propertyfinder_area.csv"])
# subprocess.call(["scrapy", "crawl", "blog","-o","propertyfinder_blog.csv"])
subprocess.call(["scrapy", "crawl", "project","-o","propertyfinder_project.csv"])
subprocess.call(["scrapy", "crawl", "buy","-o","propertyfinder_buy.csv"])
subprocess.call(["scrapy", "crawl", "rent_m","-o","ropertyfinder_rent_m.csv"])
subprocess.call(["scrapy", "crawl", "rent_y","-o","propertyfinder_rent_y.csv"])
# subprocess.call(["scrapy", "crawl", "test","-o","file2.csv"])

# Run the second spider