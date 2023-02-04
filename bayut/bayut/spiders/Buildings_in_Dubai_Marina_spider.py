import scrapy
from scrapy.http import FormRequest
from ..items import buildings_marinaItem
import requests
from bs4 import BeautifulSoup
from .file_downloader import img_downloader
from .helpers import methods
import uuid

class testingSpider(scrapy.Spider):
    name = 'buildings_marina'
    start_urls = ["https://www.bayut.com/buildings/dubai-marina/"]
    page_number = 2
    link = ""


    def parse(self,response):

        all = response.css("article.blog_post_container figure a::attr(href)").extract()

        for one in all:
            self.link = one
            try:
                yield response.follow("https://www.bayut.com"+one,callback = self.page)
            except:
                continue

        next_page = f"https://www.bayut.com/buildings/dubai-marina/page/{self.page_number}"
        if next_page is not None and self.page_number < 18:
            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)
        else:
            data = {"message":'bayut new area ready DONE'}
            # response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):

        items = buildings_marinaItem()
        signature = uuid.uuid1()
        try:
            title = response.css("div.flexBox div.postMain .title::text").get().replace("\n","").replace("\r","").replace("\t","").replace("  ","")
        except:
            title="hassan"+self.link
        cover = img_downloader.download(response.css("main div.container img::attr(src)").get(),signature,99)
        highlights=response.css("section#highlights ul.postjumplink li a::text").extract()

        #About
        about_soup=response.css("section#highlights p").extract()
        about=""
        for i in about_soup:
            one=BeautifulSoup(i,"lxml").text.replace("\n","").replace("\r","").replace("\t","").replace("  ","")
            about+=one 

        #  nutshell          
        temp = response.css("h3:contains('NUTSHELL') ~ ul, h3:contains('NUTSHELL') ~ p").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('nutshell') ~ ul, h3:contains('nutshell') ~ p").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('Nutshell') ~ ul, h3:contains('Nutshell') ~ p").extract()
        res = ''
        in_a_nutshell = {}
        for elmnt in temp:
            soup = BeautifulSoup(elmnt,'lxml').text.replace("\n","").replace("\r","").replace("\t","").replace("  ","")
            res += soup 
            try:
                in_a_nutshell = {BeautifulSoup(response.css("h3:contains(NUTSHELL)").get(),"lxml").text:res}
            except:
                try:
                    in_a_nutshell = {BeautifulSoup(response.css("h3:contains(nutshell)").get(),"lxml").text:res}
                except:
                    in_a_nutshell = {BeautifulSoup(response.css("h3:contains(Nutshell)").get(),"lxml").text:res}
        # Details
        temp = response.css("h2:contains('DETAILS') ~ ul, h2:contains('DETAILS') ~ p").extract()
        if len(temp) == 0:
            temp = response.css("h2:contains('details') ~ ul, h2:contains('details') ~ p").extract()
        if len(temp) == 0:
            temp = response.css("h2:contains('Details') ~ ul, h2:contains('Details') ~ p").extract()
        res = ''
        Building_Details = {}
        for elmnt in temp:
            soup = BeautifulSoup(elmnt,'lxml').text.replace("\n","").replace("\r","").replace("\t","").replace("  ","")
            res += soup 
            try:
                Building_Details = {BeautifulSoup(response.css("h2:contains(DETAILS)").get(),"lxml").text:res}
            except:
                try:
                    Building_Details = {BeautifulSoup(response.css("h2:contains(details)").get(),"lxml").text:res}
                except:
                    Building_Details = {BeautifulSoup(response.css("h2:contains(Details)").get(),"lxml").text:res}        
        # Floor_plans
        floor_plans=[]
        soup_details=response.css("div.floorplanCard .cardDetails").extract()
        details=[]
        for i in soup_details:
            one=BeautifulSoup(i,"lxml").text.replace("\n","").replace("\r","").replace("\t","").replace("  ","")
            details.append(one)
        img_floor_plans=response.css("div.floorplanCard .cardImg img::attr(src)").extract()
        for i in range(len(soup_details)):
            floor_plans.append({details[i]:img_downloader.download(img_floor_plans[i],signature,i)})

        #Amenities 
        temp = response.css("h2:contains('AMENITIES') ~ ul, h2:contains('AMENITIES') ~ p").extract()
        if len(temp) == 0:
            temp = response.css("h2:contains('amenities') ~ ul, h2:contains('amenities') ~ p").extract()
        if len(temp) == 0:
            temp = response.css("h2:contains('Amenities') ~ ul, h2:contains('Amenities') ~ p").extract()
        res = ''
        Nearby_Amenities = {}
        for elmnt in temp:
            soup = BeautifulSoup(elmnt,'lxml').text.replace("\n","").replace("\r","").replace("\t","").replace("  ","")
            res += soup 
            try:
                Nearby_Amenities = {BeautifulSoup(response.css("h2:contains(AMENITIES)").get(),"lxml").text:res}
            except:
                try:
                    Nearby_Amenities = {BeautifulSoup(response.css("h2:contains(amenities)").get(),"lxml").text:res}
                except:
                    Nearby_Amenities = {BeautifulSoup(response.css("h2:contains(Amenities)").get(),"lxml").text:res}

        #Parking                
        temp = response.css("h4:contains('PARKING') ~ ul, h4:contains('PARKING') ~ p").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('parking') ~ ul, h4:contains('parking') ~ p").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('Parking') ~ ul, h4:contains('Parking') ~ p").extract()
        res = ''
        Parking = {}
        for elmnt in temp:
            soup = BeautifulSoup(elmnt,'lxml').text.replace("\n","").replace("\r","").replace("\t","").replace("  ","")
            res += soup 
            try:
                Parking = {BeautifulSoup(response.css("h4:contains(PARKING)").get(),"lxml").text:res}
            except:
                try:
                    Parking = {BeautifulSoup(response.css("h4:contains(parking)").get(),"lxml").text:res}
                except:
                    try:
                        Parking = {BeautifulSoup(response.css("h4:contains(Parking)").get(),"lxml").text:res}
                    except:
                        Parking="N/A"     

        #Elevators                
        temp = response.css("h4:contains('ELEVATORS') ~ ul, h4:contains('ELEVATORS') ~ p").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('elevators') ~ ul, h4:contains('elevators') ~ p").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('Elevators') ~ ul, h4:contains('Elevators') ~ p").extract()
        res = ''
        Elevators = {}
        for elmnt in temp:
            soup = BeautifulSoup(elmnt,'lxml').text.replace("\n","").replace("\r","").replace("\t","").replace("  ","")
            res += soup 
            try:
                Elevators = {BeautifulSoup(response.css("h4:contains(ELEVATORS)").get(),"lxml").text:res}
            except:
                try:
                    Elevators = {BeautifulSoup(response.css("h4:contains(elevators)").get(),"lxml").text:res}
                except:
                    try:
                        Elevators = {BeautifulSoup(response.css("h4:contains(Elevators)").get(),"lxml").text:res}
                    except:
                        Elevators="N/A"     

        #SECURITY                
        temp = response.css("h4:contains('SECURITY') ~ ul, h4:contains('SECURITY') ~ p").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('security') ~ ul, h4:contains('security') ~ p").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('Security') ~ ul, h4:contains('Security') ~ p").extract()
        res = ''
        Security = {}
        for elmnt in temp:
            soup = BeautifulSoup(elmnt,'lxml').text.replace("\n","").replace("\r","").replace("\t","").replace("  ","")
            res += soup 
            try:
                Security = {BeautifulSoup(response.css("h4:contains(SECURITY)").get(),"lxml").text:res}
            except:
                try:
                    Security = {BeautifulSoup(response.css("h4:contains(security)").get(),"lxml").text:res}
                except:
                    try:
                        Security = {BeautifulSoup(response.css("h4:contains(Security)").get(),"lxml").text:res}
                    except:
                        Security="N/A"    

        #SECURITY
        all_temp=[]                
        temp = response.css("h4:contains('SECURITY') + ul, h4:contains('SECURITY') + p").get()
        if len(temp) == 0:
            temp = response.css("h4:contains('security') + ul, h4:contains('security') + p").get()
        if len(temp) == 0:
            temp = response.css("h4:contains('Apartment') + ul, h4:contains('Security') + p").get()
        all_temp.append(temp)
        while True:
            temp=response.css("p + ul, p + p, ul + ul, ul + p ").get()
            if temp!="":
                all_temp.append(temp)
            else:
                break    
        res = ''
        Security = {}
        for elmnt in all_temp:
            soup = BeautifulSoup(elmnt,'lxml').text.replace("\n","").replace("\r","").replace("\t","").replace("  ","")
            res += soup 
            try:
                Security = {BeautifulSoup(response.css("h4:contains(SECURITY)").get(),"lxml").text:res}
            except:
                try:
                    Security = {BeautifulSoup(response.css("h4:contains(security)").get(),"lxml").text:res}
                except:
                    try:
                        Security = {BeautifulSoup(response.css("h4:contains(Security)").get(),"lxml").text:res}
                    except:
                        Security="N/A"    
            


        #  nutshell
        # temp = response.css("h3:contains('NUTSHELL') ~ ul, h3:contains('NUTSHELL') ~ p").extract()
        # if len(temp) == 0:
        #     temp = response.css("h3:contains('nutshell') ~ ul, h3:contains('nutshell') ~ p").extract()
        # if len(temp) == 0:
        #     temp = response.css("h3:contains('Nutshell') ~ ul, h3:contains('Nutshell') ~ p").extract()
        # res = ''
        # in_a_nutshell = {}
        # for elmnt in temp:
        #     soup = BeautifulSoup(elmnt,'lxml').get_text()
        #     res += soup.replace("\n","").replace("\r","").replace("\t","").replace("  ","")
        #     try:
        #         in_a_nutshell = {self.get_text(response.css("h3:contains(NUTSHELL)").get()):res}
        #     except:
        #         try:
        #             in_a_nutshell = {self.get_text(response.css("h3:contains(nutshell)").get()):res}
        #         except:
        #             in_a_nutshell = {self.get_text(response.css("h3:contains(Nutshell)").get()):res}

    #     # community overview
    #     temp = response.css("h3:contains('COMMUNITY') ~ ul, h3:contains('COMMUNITY') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h3:contains('community') ~ ul, h3:contains('community') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h3:contains('Comunity') ~ ul, h3:contains('Comunity') ~ p").extract()
    #     res = ''
    #     community_overview = {}
    #     for elmnt in temp:
    #         soup = BeautifulSoup(elmnt,'lxml').get_text()
    #         res += soup.replace("\n","").replace("\r","").replace("\t","").replace("  ","")
    #         try:
    #             community_overview = {self.get_text(response.css("h3:contains(COMMUNITY)").get()):res}
    #         except:
    #             try:
    #                 community_overview = {self.get_text(response.css("h3:contains(community)").get()):res}
    #             except:
    #                 community_overview = {self.get_text(response.css("h3:contains(Community)").get()):res}


    #     # PROPERTIES
    #     temp = response.css("h3:contains('PROPERTIES') ~ ul, h3:contains('PROPERTIES') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h3:contains('properties') ~ ul, h3:contains('properties') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h3:contains('Properties') ~ ul, h3:contains('Properties') ~ p").extract()
    #     res = ''
    #     properties = {}
    #     for elmnt in temp:
    #         soup = BeautifulSoup(elmnt,'lxml').get_text()
    #         res += soup.replace("\n","").replace("\r","").replace("\t","").replace("  ","")
    #         try:
    #             properties = {self.get_text(response.css("h3:contains(PROPERTIES)").get()):res}
    #         except:
    #             try:
    #                 properties = {self.get_text(response.css("h3:contains(properties)").get()):res}
    #             except:
    #                 properties = {self.get_text(response.css("h3:contains(Properties)").get()):res}


    #     # SALE
    #     temp = response.css("h4:contains('SALE') ~ ul, h4:contains('SALE') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h4:contains('sale') ~ ul, h4:contains('sale') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h4:contains('Sale') ~ ul, h4:contains('Sale') ~ p").extract()
    #     res = ''
    #     sale_trends = {}
    #     for elmnt in temp:
    #         soup = BeautifulSoup(elmnt,'lxml').get_text()
    #         res += soup.replace("\n","").replace("\r","").replace("\t","").replace("  ","")
    #         try:
    #             sale_trends = {self.get_text(response.css("h4:contains(SALE)").get()):res}
    #         except:
    #             try:
    #                 sale_trends = {self.get_text(response.css("h4:contains(Sale)").get()):res}
    #             except:
    #                 sale_trends = {self.get_text(response.css("h4:contains(sale)").get()):res}


    #     # historical background
    #     temp = response.css("h4:contains('HISTORICAL') ~ ul, h4:contains('HISTORICAL') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h4:contains('historical') ~ ul, h4:contains('historical') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h4:contains('Historical') ~ ul, h4:contains('Historical') ~ p").extract()
    #     res = ''
    #     historical_background = {}
    #     for elmnt in temp:
    #         soup = BeautifulSoup(elmnt,'lxml').get_text()
    #         res += soup.replace("\n","").replace("\r","").replace("\t","").replace("  ","")
    #         try:
    #             historical_background = {self.get_text(response.css("h4:contains(HISTORICAL)").get()):res}
    #         except:
    #             try:
    #                 historical_background = {self.get_text(response.css("h4:contains(Historical)").get()):res}
    #             except:
    #                 historical_background = {self.get_text(response.css("h4:contains(historical)").get()):res}


    #     # Master Development Plan
    #     temp = response.css("h4:contains('MASTER') ~ ul, h4:contains('MASTER') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h4:contains('Master') ~ ul, h4:contains('Master') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h4:contains('master') ~ ul, h4:contains('master') ~ p").extract()
    #     res = ''
    #     master_development_plan = {}
    #     for elmnt in temp:
    #         soup = BeautifulSoup(elmnt,'lxml').get_text()
    #         res += soup.replace("\n","").replace("\r","").replace("\t","").replace("  ","")
    #         try:
    #             master_development_plan = {self.get_text(response.css("h4:contains(MASTER)").get()):res}
    #         except:
    #             try:
    #                 master_development_plan = {self.get_text(response.css("h4:contains(Master)").get()):res}
    #             except:
    #                 master_development_plan = {self.get_text(response.css("h4:contains(master)").get()):res}


    #     # Hotels 
    #     temp = response.css("h3:contains('HOTELS') ~ ul, h3:contains('HOTELS') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h3:contains('Hotels') ~ ul, h3:contains('Hotels') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h3:contains('hotels') ~ ul, h3:contains('hotels') ~ p").extract()
    #     res = ''
    #     hotels = {}
    #     for elmnt in temp:
    #         soup = BeautifulSoup(elmnt,'lxml').get_text()
    #         res += soup.replace("\n","").replace("\r","").replace("\t","").replace("  ","")
    #         try:
    #             hotels = {self.get_text(response.css("h3:contains(HOTELS)").get()):res}
    #         except:
    #             try:
    #                 hotels = {self.get_text(response.css("h3:contains(Hotels)").get()):res}
    #             except:
    #                 hotels = {self.get_text(response.css("h3:contains(hotels)").get()):res}


    #     # TRANSPORTATION  
    #     temp = response.css("h3:contains('TRANSPORTATION') ~ ul, h3:contains('TRANSPORTATION') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h3:contains('transportation') ~ ul, h3:contains('transportation') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h3:contains('Transportation') ~ ul, h3:contains('Transportation') ~ p").extract()
    #     res = ''
    #     transportation_and_parking = {}
    #     for elmnt in temp:
    #         soup = BeautifulSoup(elmnt,'lxml').get_text()
    #         res += soup.replace("\n","").replace("\r","").replace("\t","").replace("  ","")
    #         try:
    #             transportation_and_parking = {self.get_text(response.css("h3:contains(TRANSPORTATION)").get()):res}
    #         except:
    #             try:
    #                 transportation_and_parking = {self.get_text(response.css("h3:contains(transportation)").get()):res}
    #             except:
    #                 transportation_and_parking = {self.get_text(response.css("h3:contains(Transportation)").get()):res}


    #     # Public TRANSPORTATION  
    #     temp = response.css("h4:contains('PUBLIC') ~ ul, h4:contains('PUBLIC') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h4:contains('Public') ~ ul, h4:contains('Public') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h4:contains('Public') ~ ul, h4:contains('Public') ~ p").extract()
    #     res = ''
    #     public_transportation = {}
    #     for elmnt in temp:
    #         soup = BeautifulSoup(elmnt,'lxml').get_text()
    #         res += soup.replace("\n","").replace("\r","").replace("\t","").replace("  ","")
    #         try:
    #             public_transportation = {self.get_text(response.css("h4:contains(PUBLIC)").get()):res}
    #         except:
    #             try:
    #                 public_transportation = {self.get_text(response.css("h4:contains(Public)").get()):res}
    #             except:
    #                 public_transportation = {self.get_text(response.css("h4:contains(public)").get()):res}


    #     # MOSQUES    
    #     temp = response.css("h4:contains('MOSQUES') ~ ul, h4:contains('MOSQUES') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h4:contains('Mosques') ~ ul, h4:contains('Mosques') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h4:contains('mosques') ~ ul, h4:contains('mosques') ~ p").extract()
    #     res = ''
    #     mosques_near = {}
    #     for elmnt in temp:
    #         soup = BeautifulSoup(elmnt,'lxml').get_text()
    #         res += soup.replace("\n","").replace("\r","").replace("\t","").replace("  ","")
    #         try:
    #             mosques_near = {self.get_text(response.css("h4:contains(MOSQUES)").get()):res}
    #         except:
    #             try:
    #                 mosques_near = {self.get_text(response.css("h4:contains(Mosques)").get()):res}
    #             except:
    #                 mosques_near = {self.get_text(response.css("h4:contains(mosques)").get()):res}


    #     # SUPERMARKETS    
    #     temp = response.css("h4:contains('SUPERMARKETS') ~ ul, h4:contains('SUPERMARKETS') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h4:contains('Supermarkets') ~ ul, h4:contains('Supermarkets') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h4:contains('supermarkets') ~ ul, h4:contains('supermarkets') ~ p").extract()
    #     res = ''
    #     supermarkets_near = {}
    #     for elmnt in temp:
    #         soup = BeautifulSoup(elmnt,'lxml').get_text()
    #         res += soup.replace("\n","").replace("\r","").replace("\t","").replace("  ","")
    #         try:
    #             supermarkets_near = {self.get_text(response.css("h4:contains(SUPERMARKETS)").get()):res}
    #         except:
    #             try:
    #                 supermarkets_near = {self.get_text(response.css("h4:contains(Supermarkets)").get()):res}
    #             except:
    #                 supermarkets_near = {self.get_text(response.css("h4:contains(supermarkets)").get()):res}


    #     # WORSHIP     
    #     temp = response.css("h4:contains('WORSHIP') ~ ul, h4:contains('WORSHIP') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h4:contains('Worship') ~ ul, h4:contains('Worship') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h4:contains('worship') ~ ul, h4:contains('worship') ~ p").extract()
    #     res = ''
    #     other_placesof_worship_near = {}
    #     for elmnt in temp:
    #         soup = BeautifulSoup(elmnt,'lxml').get_text()
    #         res += soup.replace("\n","").replace("\r","").replace("\t","").replace("  ","")
    #         try:
    #             other_placesof_worship_near = {self.get_text(response.css("h4:contains(WORSHIP)").get()):res}
    #         except:
    #             try:
    #                 other_placesof_worship_near = {self.get_text(response.css("h4:contains(Worship)").get()):res}
    #             except:
    #                 other_placesof_worship_near = {self.get_text(response.css("h4:contains(worship)").get()):res}


    #     # SCHOOLS      
    #     temp = response.css("h4:contains('SCHOOLS') ~ ul, h4:contains('SCHOOLS') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h4:contains('Schools') ~ ul, h4:contains('Schools') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h4:contains('schools') ~ ul, h4:contains('schools') ~ p").extract()
    #     res = ''
    #     schools_near = {}
    #     for elmnt in temp:
    #         soup = BeautifulSoup(elmnt,'lxml').get_text()
    #         res += soup.replace("\n","").replace("\r","").replace("\t","").replace("  ","")
    #         try:
    #             schools_near = {self.get_text(response.css("h4:contains(SCHOOLS)").get()):res}
    #         except:
    #             try:
    #                 schools_near = {self.get_text(response.css("h4:contains(Schools)").get()):res}
    #             except:
    #                 schools_near = {self.get_text(response.css("h4:contains(schools)").get()):res}


    #     # CLINICS       
    #     temp = response.css("h4:contains('CLINICS') ~ ul, h4:contains('CLINICS') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h4:contains('Clinics') ~ ul, h4:contains('Clinics') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h4:contains('clinics') ~ ul, h4:contains('clinics') ~ p").extract()
    #     res = ''
    #     clinics_and_hospitals_near = {}
    #     for elmnt in temp:
    #         soup = BeautifulSoup(elmnt,'lxml').get_text()
    #         res += soup.replace("\n","").replace("\r","").replace("\t","").replace("  ","")
    #         try:
    #             clinics_and_hospitals_near = {self.get_text(response.css("h4:contains(CLINICS)").get()):res}
    #         except:
    #             try:
    #                 clinics_and_hospitals_near = {self.get_text(response.css("h4:contains(Clinics)").get()):res}
    #             except:
    #                 clinics_and_hospitals_near = {self.get_text(response.css("h4:contains(clinics)").get()):res}


    #     # AREAS       
    #     temp = response.css("h3:contains('AREAS') ~ ul li").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h3:contains('Areas') ~ ul li").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h3:contains('areas') ~ ul li").extract()
    #     res = ''
    #     near_by_areas = {}
    #     for elmnt in temp:
    #         soup = BeautifulSoup(elmnt,'lxml').get_text()
    #         res += soup.replace("\n","").replace("\r","").replace("\t","").replace("  ","") + '#/'
    #         try:
    #             near_by_areas = {self.get_text(response.css("h3:contains(AREAS)").get()):res}
    #         except:
    #             try:
    #                 near_by_areas = {self.get_text(response.css("h3:contains(Areas)").get()):res}
    #             except:
    #                 near_by_areas = {self.get_text(response.css("h3:contains(areas)").get()):res}


    #     # MALLS       
    #     temp = response.css("h4:contains('MALLS') ~ ul,h4:contains('MALLS') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h4:contains('Malls') ~ ul,h4:contains('Malls') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h4:contains('malls') ~ ul,h4:contains('malls') ~ p").extract()
    #     res = ''
    #     malls_near = {}
    #     for elmnt in temp:
    #         soup = BeautifulSoup(elmnt,'lxml').get_text()
    #         res += soup.replace("\n","").replace("\r","").replace("\t","").replace("  ","")
    #         try:
    #             malls_near = {self.get_text(response.css("h4:contains(MALLS)").get()):res}
    #         except:
    #             try:
    #                 malls_near = {self.get_text(response.css("h4:contains(Malls)").get()):res}
    #             except:
    #                 malls_near = {self.get_text(response.css("h4:contains(malls)").get()):res}


    #     # RESTAURANTS       
    #     temp = response.css("h4:contains('RESTAURANTS') ~ ul, h4:contains('RESTAURANTS') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h4:contains('Restaurants') ~ ul, h4:contains('Restaurants') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h4:contains('restaurants') ~ ul, h4:contains('restaurants') ~ p").extract()
    #     res = ''
    #     resturants_near = {}
    #     for elmnt in temp:
    #         soup = BeautifulSoup(elmnt,'lxml').get_text()
    #         res += soup.replace("\n","").replace("\r","").replace("\t","").replace("  ","")
    #         try:
    #             resturants_near = {self.get_text(response.css("h4:contains(RESTAURANTS)").get()):res}
    #         except:
    #             try:
    #                 resturants_near = {self.get_text(response.css("h4:contains(Restaurants)").get()):res}
    #             except:
    #                 resturants_near = {self.get_text(response.css("h4:contains(restaurants)").get()):res}


    #     # sale trends       
    #     temp = response.css("h4:contains('SALE') ~ table tbody tr.content:not(:contains('%'))").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h4:contains('Sale') ~ table tbody tr.content:not(:contains('%'))").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h4:contains('sale') ~ table tbody tr.content:not(:contains('%'))").extract()
    #     res = []
    #     sale_trends_table = {}
    #     beds = []
    #     prices = []
    #     for elmnt in temp:
    #         x = []
    #         soup = BeautifulSoup(elmnt,'lxml').find_all('div',class_="values")
    #         for i in soup:
    #             if 'bed' in i.text or 'Bed' in i.text or 'BED' in i.text:

    #                 beds.append(str(i.text).replace("\n","").replace("\r","").replace("\t","").replace("  ",""))
    #             else:
    #                 prices.append(str(i.text).replace("\n","").replace("\r","").replace("\t","").replace("  ",""))
    #             # x.append({beds:prices})
    #     counter = 0 
    #     for bed in beds:
    #         res.append({bed:prices[counter]})
    #         counter +=1
    #     if counter > 0:
    #         try:
    #             sale_trends_table = {self.get_text(response.css("h4:contains(SALE)").get()) + ' table':res}
    #         except:
    #             try:
    #                 sale_trends_table = {self.get_text(response.css("h4:contains(Sale)").get()) + ' table':res}
    #             except:
    #                 sale_trends_table = {self.get_text(response.css("h4:contains(sale)").get()) + ' table':res}


    #     # roi table    
    #     temp = response.css("h4:contains('ROI') ~ table tbody tr.content:contains('%')").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h4:contains('Roi') ~ table tbody tr.content:contains('%')").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h4:contains('roi') ~ table tbody tr.content:contains('%')").extract()
    #     res = []
    #     roi_table = {}
    #     beds = []
    #     prices = []
    #     for elmnt in temp:
    #         x = []
    #         soup = BeautifulSoup(elmnt,'lxml').find_all('div',class_="values")
    #         for i in soup:
    #             if 'bed' in i.text or 'Bed' in i.text or 'BED' in i.text:

    #                 beds.append(str(i.text).replace("\n","").replace("\r","").replace("\t","").replace("  ",""))
    #             else:
    #                 prices.append(str(i.text).replace("\n","").replace("\r","").replace("\t","").replace("  ",""))
    #             # x.append({beds:prices})
    #     counter = 0 
    #     for bed in beds:
    #         res.append({bed:prices[counter]})
    #         counter +=1
    #     if counter > 0:
    #         try:
    #             roi_table = {self.get_text(response.css("h4:contains(ROI)").get()) + ' table':res}
    #         except:
    #             try:
    #                 roi_table = {self.get_text(response.css("h4:contains(Roi)").get()) + ' table':res}
    #             except:
    #                 roi_table = {self.get_text(response.css("h4:contains(roi)").get()) + ' table':res}


    #     # overview table    
    #     temp = response.css("h3:contains('ABOUT') ~ table tbody tr.content").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h3:contains('About') ~ table tbody tr.content").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h3:contains('about') ~ table tbody tr.content").extract()
    #     res = []
    #     community_overview_table = {}
    #     beds = []
    #     prices = []
    #     for elmnt in temp:
    #         x = []
    #         soup = BeautifulSoup(elmnt,'lxml').find_all('div',class_="values")
    #         for i in soup:
    #             if 'Location' in i.text or 'location' in i.text or 'LOcation' in i.text or 'type' in i.text or 'Type' in i.text or 'TYPE' in i.text or 'Developer' == i.text or 'DEVELOPER' == i.text or 'developer' == i.text:
    #                 beds.append(str(i.text).replace("\n","").replace("\r","").replace("\t","").replace("  ",""))
    #             else:
    #                 prices.append(str(i.text).replace("\n","").replace("\r","").replace("\t","").replace("  ",""))
    #             # x.append({beds:prices})
    #     counter = 0 
    #     for bed in beds:
    #         res.append({bed:prices[counter]})
    #         counter +=1
    #     if counter > 0:
    #         try:
    #             community_overview_table = {self.get_text(response.css("h3:contains(ABOUT)").get()) + ' table':res}
    #         except:
    #             try:
    #                 community_overview_table = {self.get_text(response.css("h3:contains(About)").get()) + ' table':res}
    #             except:
    #                 community_overview_table = {self.get_text(response.css("h3:contains(about)").get()) + ' table':res}


    #     # BEACHES       
    #     temp = response.css("h3:contains('BEACHES') ~ ul, h3:contains('BEACHES') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h3:contains('Beaches') ~ ul, h3:contains('Beaches') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h3:contains('beaches') ~ ul, h3:contains('beaches') ~ p").extract()
    #     res = ''
    #     beaches_near = {}
    #     for elmnt in temp:
    #         soup = BeautifulSoup(elmnt,'lxml').get_text()
    #         res += soup.replace("\n","").replace("\r","").replace("\t","").replace("  ","")
    #         try:
    #             beaches_near = {self.get_text(response.css("h3:contains(BEACHES)").get()):res}
    #         except:
    #             try:
    #                 beaches_near = {self.get_text(response.css("h3:contains(Beaches)").get()):res}
    #             except:
    #                 beaches_near = {self.get_text(response.css("h3:contains(beaches)").get()):res}


    #     # LEISURE       
    #     temp = response.css("h3:contains('LEISURE') ~ ul, h3:contains('LEISURE') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h3:contains('Leisure') ~ ul, h3:contains('Leisure') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h3:contains('leisure') ~ ul, h3:contains('leisure') ~ p").extract()
    #     res = ''
    #     liesure_activities_and_notable_landmarks = {}
    #     for elmnt in temp:
    #         soup = BeautifulSoup(elmnt,'lxml').get_text()
    #         res += soup.replace("\n","").replace("\r","").replace("\t","").replace("  ","")
    #         try:
    #             liesure_activities_and_notable_landmarks = {self.get_text(response.css("h3:contains(LEISURE)").get()):res}
    #         except:
    #             try:
    #                 liesure_activities_and_notable_landmarks = {self.get_text(response.css("h3:contains(Leisure)").get()):res}
    #             except:
    #                 liesure_activities_and_notable_landmarks = {self.get_text(response.css("h3:contains(leisure)").get()):res}


    #     # OUTDOOR       
    #     temp = response.css("h3:contains('OUTDOOR') ~ ul, h3:contains('OUTDOOR') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h3:contains('Outdoor') ~ ul, h3:contains('Outdoor') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h3:contains('outdoor') ~ ul, h3:contains('outdoor') ~ p").extract()
    #     res = ''
    #     outdoor_activities = {}
    #     for elmnt in temp:
    #         soup = BeautifulSoup(elmnt,'lxml').get_text()
    #         res += soup.replace("\n","").replace("\r","").replace("\t","").replace("  ","")
    #         try:
    #             outdoor_activities = {self.get_text(response.css("h3:contains(OUTDOOR)").get()):res}
    #         except:
    #             try:
    #                 outdoor_activities = {self.get_text(response.css("h3:contains(Outdoor)").get()):res}
    #             except:
    #                 outdoor_activities = {self.get_text(response.css("h3:contains(outdoor)").get()):res}


    #     # THINGS to consider       
    #     temp = response.css("h3:contains('THINGS') ~ ul, h3:contains('THINGS') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h3:contains('Things') ~ ul, h3:contains('Things') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h3:contains('things') ~ ul, h3:contains('things') ~ p").extract()
    #     res = ''
    #     things_to_consider = {}
    #     for elmnt in temp:
    #         soup = BeautifulSoup(elmnt,'lxml').get_text()
    #         res += soup.replace("\n","").replace("\r","").replace("\t","").replace("  ","")
    #         try:
    #             things_to_consider = {self.get_text(response.css("h3:contains(THINGS)").get()):res}
    #         except:
    #             try:
    #                 things_to_consider = {self.get_text(response.css("h3:contains(Things)").get()):res}
    #             except:
    #                 things_to_consider = {self.get_text(response.css("h3:contains(things)").get()):res}


    #     # community EVENTS       
    #     temp = response.css("h3:contains('EVENTS') ~ ul, h3:contains('EVENTS') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h3:contains('Events') ~ ul, h3:contains('Events') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h3:contains('events') ~ ul, h3:contains('events') ~ p").extract()
    #     res = ''
    #     community_events = {}
    #     for elmnt in temp:
    #         soup = BeautifulSoup(elmnt,'lxml').get_text()
    #         res += soup.replace("\n","").replace("\r","").replace("\t","").replace("  ","")
    #         try:
    #             community_events = {self.get_text(response.css("h3:contains(EVENTS)").get()):res}
    #         except:
    #             try:
    #                 community_events = {self.get_text(response.css("h3:contains(Events)").get()):res}
    #             except:
    #                 community_events = {self.get_text(response.css("h3:contains(events)").get()):res}


    #     # ATTRACTIONS       
    #     temp = response.css("h3:contains('ATTRACTIONS') ~ ul, h3:contains('ATTRACTIONS') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h3:contains('Attractions') ~ ul, h3:contains('Attractions') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h3:contains('attractions') ~ ul, h3:contains('attractions') ~ p").extract()
    #     res = ''
    #     attractions = {}
    #     for elmnt in temp:
    #         soup = BeautifulSoup(elmnt,'lxml').get_text()
    #         res += soup.replace("\n","").replace("\r","").replace("\t","").replace("  ","")
    #         try:
    #             attractions = {self.get_text(response.css("h3:contains(ATTRACTIONS)").get()):res}
    #         except:
    #             try:
    #                 attractions = {self.get_text(response.css("h3:contains(Attractions)").get()):res}
    #             except:
    #                 attractions = {self.get_text(response.css("h3:contains(attractions)").get()):res}


    #     # LOCATION       
    #     temp = response.css("h2:contains('LOCATION') ~ ul li").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h2:contains('Location') ~ ul li").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h2:contains('location') ~ ul li").extract()
    #     res = ''
    #     location = {}
    #     for elmnt in temp:
    #         soup = BeautifulSoup(elmnt,'lxml').get_text()
    #         res += soup.replace("\n","").replace("\r","").replace("\t","").replace("  ","") + '#/'
    #         try:
    #             location = {self.get_text(response.css("h2:contains(LOCATION)").get()):res}
    #         except:
    #             try:
    #                 location = {self.get_text(response.css("h2:contains(Location)").get()):res}
    #             except:
    #                 location = {self.get_text(response.css("h2:contains(location)").get()):res}


    #     # QUESTIONS       
    #     temp = response.css("h3:contains('FAQs') ~ h4").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h3:contains('faqs') ~ h4").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h3:contains('Faqs') ~ h4").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h3:contains('FAQS') ~ h4").extract()
    #     res = ''
    #     questions = {}
    #     for elmnt in temp:
    #         soup = BeautifulSoup(elmnt,'lxml').get_text()
    #         res += soup.replace("\n","").replace("\r","").replace("\t","").replace("  ","") + '#/'
    #         try:
    #             questions = {self.get_text(response.css("h3:contains(FAQs)").get()):res}
    #         except:
    #             try:
    #                 questions = {self.get_text(response.css("h3:contains(faqs)").get()):res}
    #             except:
    #                 try:
    #                     questions = {self.get_text(response.css("h3:contains(Faqs)").get()):res}
    #                 except:
    #                     questions = {self.get_text(response.css("h3:contains(FAQS)").get()):res}


    #     # ANSWERS       
    #     temp = response.css("h3:contains('FAQs') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h3:contains('faqs') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h3:contains('Faqs') ~ p").extract()
    #     if len(temp) == 0:
    #         temp = response.css("h3:contains('FAQS') ~ p").extract()
    #     res = ''
    #     answers = {}
    #     for elmnt in temp:
    #         soup = BeautifulSoup(elmnt,'lxml').get_text()
    #         res += soup.replace("\n","").replace("\r","").replace("\t","").replace("  ","") + '#/'
    #         try:
    #             answers = {self.get_text(response.css("h3:contains(FAQs)").get()):res}
    #         except:
    #             try:
    #                 answers = {self.get_text(response.css("h3:contains(faqs)").get()):res}
    #             except:
    #                 try:
    #                     answers = {self.get_text(response.css("h3:contains(Faqs)").get()):res}
    #                 except:
    #                     answers = {self.get_text(response.css("h3:contains(FAQS)").get()):res}


    #     #images
    #     img_container = response.css('.post_body').get()
    #     imgs = methods.img_downloader_method_src_area(img_container,signature)

    #     items['title'] = title
    #     items['cover'] = cover
    #     items['about'] = about
    #     items['in_a_nutshell'] = in_a_nutshell
    #     items['community_overview'] = community_overview
    #     items['properties'] = properties
    #     items['sale_trends'] = sale_trends
    #     items['historical_background'] = historical_background
    #     items['master_development_plan'] = master_development_plan
    #     items['hotels'] = hotels
    #     items['transportation_and_parking'] = transportation_and_parking
    #     items['public_transportation'] = public_transportation
    #     items['supermarkets_near'] = supermarkets_near
    #     items['mosques_near'] = mosques_near
    #     items['other_placesof_worship_near'] = other_placesof_worship_near
    #     items['schools_near'] = schools_near
    #     items['clinics_and_hospitals_near'] = clinics_and_hospitals_near
    #     items['near_by_areas'] = near_by_areas
    #     items['malls_near'] = malls_near
    #     items['resturants_near'] = resturants_near
    #     items['beaches_near'] = beaches_near
    #     items['liesure_activities_and_notable_landmarks'] = liesure_activities_and_notable_landmarks
    #     items['outdoor_activities'] = outdoor_activities
    #     items['things_to_consider'] = things_to_consider
    #     items['community_events'] = community_events
    #     items['location'] = location
    #     items['questions'] = questions
    #     items['answers'] = answers
    #     items['attractions'] = attractions
    #     items['sale_trends_table'] = sale_trends_table
    #     items['roi_table'] = roi_table
    #     items['roi_table'] = roi_table
    #     items['community_overview_table'] = community_overview_table
    #     items['imgs'] = imgs
    #     yield items




    