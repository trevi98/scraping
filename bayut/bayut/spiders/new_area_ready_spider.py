import scrapy
from scrapy.http import FormRequest
from ..items import BayutAreaReadyItem
import requests
from bs4 import BeautifulSoup
from .file_downloader import img_downloader
from .helpers import methods
import uuid
import sys

class testingSpider(scrapy.Spider):
    name = 'area_ready'
    start_urls = ["https://www.bayut.com/area-guides/dubai/ready"]
    page_number = 2
    link = ""


    def parse(self,response):

        all = response.css("article.blog_post_container figure a::attr(href)").extract()

        for one in all:
            self.link = one
            try:
                yield response.follow(one,callback = self.page)
            except:
                continue

        next_page = f"https://www.bayut.com/area-guides/dubai/ready/page/{self.page_number}"
        if next_page is not None and self.page_number < 85:
            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)
        else:
            data = {"message":'bayut new area ready DONE'}
            response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):

        items = BayutAreaReadyItem()
        signature = uuid.uuid1()
        title = response.css("h1.post_title::text").get().replace("\n","").replace("\r","").replace("\t","").replace("  ","")
        cover = img_downloader.download(response.css("figure.post_banner img::attr(src)").get(),signature,99)

        # about
        temp = response.css("h3:contains(ABOUT) ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains(about) ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains(About) ~ *").extract()
        temp = self.correctify_selection(temp,[])
        about = temp

        #  nutshell
        temp = response.css("h3:contains('NUTSHELL') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('nutshell') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('Nutshell') ~ *").extract()
        temp = self.correctify_selection(temp,[])
        in_a_nutshell = temp
        # community overview
        temp = response.css("h3:contains('COMMUNITY') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('community') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('Comunity') ~ *").extract()
        temp = self.correctify_selection(temp,[])
        community_overview = temp


        # PROPERTIES
        temp = response.css("h3:contains('PROPERTIES') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('properties') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('Properties') ~ *").extract()
        temp = self.correctify_selection(temp,[])
        properties = temp

        # SALE
        temp = response.css("h4:contains('SALE') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('sale') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('Sale') ~ *").extract()
        temp = self.correctify_selection(temp,[])
        sale_trends = temp


        # historical background
        temp = response.css("h4:contains('HISTORICAL') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('historical') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('Historical') ~ *").extract()
        temp = self.correctify_selection(temp,[])
        historical_background = temp


        # Master Development Plan
        temp = response.css("h4:contains('MASTER') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('Master') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('master') ~ *").extract()
        temp = self.correctify_selection(temp,[])
        master_development_plan = temp


        # Hotels 
        temp = response.css("h3:contains('HOTELS') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('Hotels') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('hotels') ~ *").extract()
        temp = self.correctify_selection(temp,[])
        hotels = temp


        # TRANSPORTATION  
        temp = response.css("h3:contains('TRANSPORTATION') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('transportation') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('Transportation') ~ *").extract()
        temp = self.correctify_selection(temp,[])
        transportation_and_parking = temp


        # Public TRANSPORTATION  
        temp = response.css("h4:contains('PUBLIC') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('Public') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('Public') ~ *").extract()
        temp = self.correctify_selection(temp,[])
        public_transportation = temp


        # MOSQUES    
        temp = response.css("h4:contains('MOSQUES') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('Mosques') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('mosques') ~ *").extract()
        temp = self.correctify_selection(temp,[])
        mosques_near = temp


        # SUPERMARKETS    
        temp = response.css("h4:contains('SUPERMARKETS') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('Supermarkets') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('supermarkets') ~ *").extract()
        temp = self.correctify_selection(temp,[])
        supermarkets_near = temp


        # WORSHIP     
        temp = response.css("h4:contains('WORSHIP') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('Worship') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('worship') ~ *").extract()
        temp = self.correctify_selection(temp,[])
        other_placesof_worship_near = temp


        # SCHOOLS      
        temp = response.css("h4:contains('SCHOOLS') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('Schools') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('schools') ~ *").extract()
        temp = self.correctify_selection(temp,[])
        schools_near = temp


        # CLINICS       
        temp = response.css("h4:contains('CLINICS') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('Clinics') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('clinics') ~ *").extract()
        temp = self.correctify_selection(temp,[])
        clinics_and_hospitals_near = temp


        # AREAS       
        temp = response.css("h3:contains('AREAS') ~ ul li").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('Areas') ~ ul li").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('areas') ~ ul li").extract()
        temp = self.correctify_selection(temp,[])
        near_by_areas = temp


        # MALLS       
        temp = response.css("h4:contains('MALLS') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('Malls') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('malls') ~ *").extract()
        temp = self.correctify_selection(temp,[])
        malls_near = temp


        # RESTAURANTS       
        temp = response.css("h4:contains('RESTAURANTS') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('Restaurants') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('restaurants') ~ *").extract()
        temp = self.correctify_selection(temp,[])
        resturants_near = temp


        # sale trends       
        temp = response.css("h4:contains('SALE') ~ table tbody tr.content:not(:contains('%'))").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('Sale') ~ table tbody tr.content:not(:contains('%'))").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('sale') ~ table tbody tr.content:not(:contains('%'))").extract()
        res = []
        sale_trends_table = {}
        beds = []
        prices = []
        for elmnt in temp:
            x = []
            soup = BeautifulSoup(elmnt,'lxml').find_all('div',class_="values")
            for i in soup:
                if 'bed' in i.text or 'Bed' in i.text or 'BED' in i.text:

                    beds.append(str(i.text).replace("\n","").replace("\r","").replace("\t","").replace("  ",""))
                else:
                    prices.append(str(i.text).replace("\n","").replace("\r","").replace("\t","").replace("  ",""))
                # x.append({beds:prices})
        counter = 0 
        for bed in beds:
            res.append({bed:prices[counter]})
            counter +=1
        if counter > 0:
            try:
                sale_trends_table = {self.get_text(response.css("h4:contains(SALE)").get()) + ' table':res}
            except:
                try:
                    sale_trends_table = {self.get_text(response.css("h4:contains(Sale)").get()) + ' table':res}
                except:
                    sale_trends_table = {self.get_text(response.css("h4:contains(sale)").get()) + ' table':res}


        # roi table    
        temp = response.css("h4:contains('ROI') ~ table tbody tr.content:contains('%')").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('Roi') ~ table tbody tr.content:contains('%')").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('roi') ~ table tbody tr.content:contains('%')").extract()
        res = []
        roi_table = {}
        beds = []
        prices = []
        for elmnt in temp:
            x = []
            soup = BeautifulSoup(elmnt,'lxml').find_all('div',class_="values")
            for i in soup:
                if 'bed' in i.text or 'Bed' in i.text or 'BED' in i.text:

                    beds.append(str(i.text).replace("\n","").replace("\r","").replace("\t","").replace("  ",""))
                else:
                    prices.append(str(i.text).replace("\n","").replace("\r","").replace("\t","").replace("  ",""))
                # x.append({beds:prices})
        counter = 0 
        for bed in beds:
            res.append({bed:prices[counter]})
            counter +=1
        if counter > 0:
            try:
                roi_table = {self.get_text(response.css("h4:contains(ROI)").get()) + ' table':res}
            except:
                try:
                    roi_table = {self.get_text(response.css("h4:contains(Roi)").get()) + ' table':res}
                except:
                    roi_table = {self.get_text(response.css("h4:contains(roi)").get()) + ' table':res}


        # overview table    
        temp = response.css("h3:contains('ABOUT') ~ table tbody tr.content").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('About') ~ table tbody tr.content").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('about') ~ table tbody tr.content").extract()
        res = []
        community_overview_table = {}
        beds = []
        prices = []
        for elmnt in temp:
            x = []
            soup = BeautifulSoup(elmnt,'lxml').find_all('div',class_="values")
            for i in soup:
                if 'Location' in i.text or 'location' in i.text or 'LOcation' in i.text or 'type' in i.text or 'Type' in i.text or 'TYPE' in i.text or 'Developer' == i.text or 'DEVELOPER' == i.text or 'developer' == i.text:
                    beds.append(str(i.text).replace("\n","").replace("\r","").replace("\t","").replace("  ",""))
                else:
                    prices.append(str(i.text).replace("\n","").replace("\r","").replace("\t","").replace("  ",""))
                # x.append({beds:prices})
        counter = 0 
        for bed in beds:
            res.append({bed:prices[counter]})
            counter +=1
        if counter > 0:
            try:
                community_overview_table = {self.get_text(response.css("h3:contains(ABOUT)").get()) + ' table':res}
            except:
                try:
                    community_overview_table = {self.get_text(response.css("h3:contains(About)").get()) + ' table':res}
                except:
                    community_overview_table = {self.get_text(response.css("h3:contains(about)").get()) + ' table':res}


        # BEACHES       
        temp = response.css("h3:contains('BEACHES') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('Beaches') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('beaches') ~ *").extract()
        temp = self.correctify_selection(temp,['p','ul'])
        beaches_near = temp


        # LEISURE       
        temp = response.css("h3:contains('LEISURE') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('Leisure') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('leisure') ~ *").extract()
        temp = self.correctify_selection(temp,[])
        liesure_activities_and_notable_landmarks = temp


        # OUTDOOR       
        temp = response.css("h3:contains('OUTDOOR') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('Outdoor') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('outdoor') ~ *").extract()
        temp = self.correctify_selection(temp,[])
        outdoor_activities = temp


        # THINGS to consider       
        temp = response.css("h3:contains('THINGS') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('Things') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('things') ~ *").extract()
        temp = self.correctify_selection(temp,[])
        things_to_consider = temp


        # community EVENTS       
        temp = response.css("h3:contains('EVENTS') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('Events') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('events') ~ *").extract()
        temp = self.correctify_selection(temp,[])
        community_events = temp


        # ATTRACTIONS       
        temp = response.css("h3:contains('ATTRACTIONS') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('Attractions') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('attractions') ~ *").extract()
        temp = self.correctify_selection(temp,[])
        attractions = temp


        # LOCATION       
        temp = response.css("h2:contains('LOCATION') ~ ul li").extract()
        if len(temp) == 0:
            temp = response.css("h2:contains('Location') ~ ul li").extract()
        if len(temp) == 0:
            temp = response.css("h2:contains('location') ~ ul li").extract()
        temp = self.correctify_selection(temp,[])
        location = temp


        # QUESTIONS       
        temp = response.css("h3:contains('FAQs') ~ h4").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('faqs') ~ h4").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('Faqs') ~ h4").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('FAQS') ~ h4").extract()
        temp = self.correctify_selection(temp,[])
        questions = temp


        # ANSWERS       
        temp = response.css("h3:contains('FAQs') ~ p").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('faqs') ~ p").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('Faqs') ~ p").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('FAQS') ~ p").extract()
        temp = self.correctify_selection(temp,[])
        answers = temp


        #images
        img_container = response.css('.post_body').get()
        imgs = methods.img_downloader_method_src_area(img_container,signature)

        items['title'] = title
        items['cover'] = cover
        items['about'] = about
        items['in_a_nutshell'] = in_a_nutshell
        items['community_overview'] = community_overview
        items['properties'] = properties
        items['sale_trends'] = sale_trends
        items['historical_background'] = historical_background
        items['master_development_plan'] = master_development_plan
        items['hotels'] = hotels
        items['transportation_and_parking'] = transportation_and_parking
        items['public_transportation'] = public_transportation
        items['supermarkets_near'] = supermarkets_near
        items['mosques_near'] = mosques_near
        items['other_placesof_worship_near'] = other_placesof_worship_near
        items['schools_near'] = schools_near
        items['clinics_and_hospitals_near'] = clinics_and_hospitals_near
        items['near_by_areas'] = near_by_areas
        items['malls_near'] = malls_near
        items['resturants_near'] = resturants_near
        items['beaches_near'] = beaches_near
        items['liesure_activities_and_notable_landmarks'] = liesure_activities_and_notable_landmarks
        items['outdoor_activities'] = outdoor_activities
        items['things_to_consider'] = things_to_consider
        items['community_events'] = community_events
        items['location'] = location
        items['questions'] = questions
        items['answers'] = answers
        items['attractions'] = attractions
        items['sale_trends_table'] = sale_trends_table
        items['roi_table'] = roi_table
        items['roi_table'] = roi_table
        items['community_overview_table'] = community_overview_table
        items['imgs'] = imgs
        yield items




    def get_text(self,elmnt):
        soup = BeautifulSoup(elmnt,'lxml').get_text().replace("\n","").replace("\r","").replace("\t","").replace("  ","")
        return soup

    def correctify_selection(self,selection,required):
        result = ""
        for tag in selection:
            if tag.startswith("<figure"):
                continue
            if tag.startswith("<li"):
                result += self.sanitize(BeautifulSoup(tag,'lxml').text) + '##/'
                continue
            if not (tag.startswith("<p") or tag.startswith("<ul")):
                break
            result += self.sanitize(BeautifulSoup(tag,'lxml').text)
            result += ' '
            # result = result.replace("\n","").replace("\r","").replace("\t","").replace("  ","")
        print(result)
        return result
        # sys.exit()
        
    def sanitize(self,text):
        res = ""
        try:
            res = text.replace("\n","") .replace("\t","").replace("\r","").replace("  ","")
        except:
            res = text
        return res