import scrapy
from scrapy.http import FormRequest
from ..items import Buildings_in_Dubai_Sports_CityItem
import requests
from bs4 import BeautifulSoup
from .file_downloader import img_downloader
from .helpers import methods
import uuid

class testingSpider(scrapy.Spider):
    name = ' Buildings_in_Dubai_Sports_City'
    start_urls = ["https://www.bayut.com/buildings/dubai-sports-city/"]
    page_number = 2
    link = ""


    def parse(self,response):

        all = response.css("div.main div.listings div.listItem a::attr('href')").extract()

        for one in all:
            self.link = one
            
            yield response.follow("https://www.bayut.com"+one,callback = self.page)
            

        next_page = f"https://www.bayut.com/buildings/dubai-sports-city/page/{self.page_number}"
        if next_page is not None and self.page_number < 7:
            self.page_number +=1
            yield response.follow(next_page,callback = self.parse)
        else:
            data = {"message":'bayut new area ready DONE'}
            # response = requests.post("https://notifier.abdullatif-treifi.com/", data=data)
            # sys.path.append('/c/Python310/Scripts/scrapy')

    def page(self,response):

        items = Buildings_in_Dubai_Sports_CityItem()
        signature = uuid.uuid1()

        #title
        try:
            title = response.css("div.flexBox div.postMain .title::text").get().replace("\n","").replace("\r","").replace("\t","").replace("  ","")
        except:
            title="hassan"+self.link

        #cover_img    
        cover_image = img_downloader.download(response.css("main div.container img::attr(src)").get(),signature,99)

        #highlights
        highlights=response.css("section#highlights ul.postjumplink li a::text").extract()

        #About
        about_soup=response.css("section#highlights p").extract()
        about=""
        for i in about_soup:
            one=BeautifulSoup(i,"lxml").text.replace("\n","").replace("\r","").replace("\t","").replace("  ","")
            about+=one 

        #  nutshell          
        temp = response.css("h3:contains('NUTSHELL') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('nutshell') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('Nutshell') ~ *").extract()
        temp=self.correctify_selection(temp,[])
        in_nutshell=temp    

        # Floor_plans
        # len / 2 => because items are repeated twice  
        floor_plans=[]
        soup_details=response.css("#all_floor_plans div.floorplanCard div.cardDetails").extract() 
        details=[]
        for i in soup_details:
            one=BeautifulSoup(i,"lxml").text.replace("\n","").replace("\r","").replace("\t","").replace("  ","")
            details.append(one)    
        img_floor_plans=response.css("#all_floor_plans div.floorplanCard .cardImg img::attr(src)").extract()
        for i in range(len(soup_details)):
            floor_plans.append({details[i]:img_downloader.download(img_floor_plans[i],signature,i)})

        #Parking                
        temp = response.css("h4:contains('PARKING') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('parking') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('Parking') ~ *").extract()
        temp=self.correctify_selection(temp,[])
        parking=temp    
           

        #Elevators                
        temp = response.css("h4:contains('ELEVATORS') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('elevators') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('Elevators') ~ *").extract()
        temp=self.correctify_selection(temp,[])
        Elevators = temp
             

        #SECURITY                
        temp = response.css("h4:contains('SECURITY') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('security') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('Security') ~ *").extract()
        temp=self.correctify_selection(temp,[])
        Security_Central_Air_Conditioning_and_Maintenance_Services  = temp

        #EVENT                
        temp = response.css("h4:contains('EVENT') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('event') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('Event') ~ *").extract()
        temp=self.correctify_selection(temp,[])
        Event_Space = temp

        #Gym                
        temp = response.css("h4:contains('GYM') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('gym') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('Gym') ~ *").extract()
        temp=self.correctify_selection(temp,[])
        Gym_and_Fitness_Facilities= temp

        #Lifestyle_Amenities                
        temp = response.css("h4:contains('LIFESTYLE') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('lifestyle') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('Lifestyle') ~ *").extract()
        temp=self.correctify_selection(temp,[])
        Lifestyle_Amenities= temp

        #Concierge_and_Guest_Services                 
        temp = response.css("h4:contains('CONCIERGE') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('concierge') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('Concierge') ~ *").extract()
        temp=self.correctify_selection(temp,[])
        Concierge_and_Guest_Services= temp

        #Pet-friendly                 
        temp = response.css("h4:contains('PET-FRIENDLY') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('pet-friendly') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('Pet-friendly') ~ *").extract()
        temp=self.correctify_selection(temp,[])
        Pet_friendly= temp

        #Apartment_Types                 
        temp = response.css("h3:contains('APARTMENT TYPES IN') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('apartment types in') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('Apartment Types in') ~ *").extract()
        temp=self.correctify_selection(temp,[])
        Apartment_Types=temp

        #1_Bedroom_Apartments_in                  
        temp = response.css("h4:contains('1-Bedroom Apartments in') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('1-Bedroom Apartments in') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('1-Bedroom Apartments in') ~ *").extract()
        temp=self.correctify_selection(temp,[])
        one_Bedroom_Apartments_in=temp
        #2_Bedroom_Apartments_in                  
        temp = response.css("h4:contains('2-Bedroom Apartments in') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('2-Bedroom Apartments in') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('2-Bedroom Apartments in') ~ *").extract()
        temp=self.correctify_selection(temp,[])
        two_Bedroom_Apartments_in=temp

        # 3_Bedroom_Apartments_in                  
        temp = response.css("h4:contains('3-Bedroom Apartments in') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('3-Bedroom Apartments in') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('3-Bedroom Apartments in') ~ *").extract()
        temp=self.correctify_selection(temp,[])
        three_Bedroom_Apartments_in=temp

        #4_Bedroom_Apartments_in                  
        temp = response.css("h4:contains('4-Bedroom Apartments in') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('4-Bedroom Apartments in') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('4-Bedroom Apartments in') ~ *").extract()
        temp=self.correctify_selection(temp,[])
        four_Bedroom_Apartments_in=temp
         

            
        #PENTHOUSES
        temp = response.css("h4:contains('PENTHOUSES') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('penthouses') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('Penthouses') ~ *").extract()
        temp=self.correctify_selection(temp,[])
        penthouses=temp

        #Villas
        temp = response.css("h4:contains('VILLAS') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('villas') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('Villas') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('Villa') ~ *").extract()
        temp=self.correctify_selection(temp,[])
        Villas=temp

        #Most_Popular_Apartment_Types_in                   
        temp = response.css("h4:contains('MOST POPULAR') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('most popular') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('Most Popular') ~ *").extract()
        temp=self.correctify_selection(temp,[])
        Most_Popular_Apartment_Types_in=temp

        #Rental_Trends                  
        temp = response.css("h3:contains('RENTAL TRENDS') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('rental trends') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('Rental Trends') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('Rentals Trends') ~ *").extract()
        temp=self.correctify_selection(temp,[])
        Rental_Trends=temp

        #Sales Trends                   
        temp = response.css("h3:contains('SALE TRENDS') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('sale trends') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('Sale Trends') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('Sales Trends') ~ *").extract()
        temp=self.correctify_selection(temp,[])
        Sales_Trends=temp

        #Rental Yield                  
        temp = response.css("h3:contains('RENTAL YIELD') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('rental yield') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('Rental Yield') ~ *").extract()
        temp=self.correctify_selection(temp,[])
        Rental_Yield=temp

        #Service Charges
        table=[]
        table_key=response.css("h3:contains('Service Charges')~ table tr.content td div.values > span::text").extract()
        table_value=response.css("h3:contains('Service Charges')~ table tr.content td div.values::text ").extract()
        if len(table)>0:
            for i in range(len(table_key)-2):
                table.append({table_key[i]:table_value[i]})
            table.append({table_value[len(table_value)-2]:table_value[len(table_value)-1]})    
        Service_harges=table

        #Transportation near                  
        temp = response.css("h3:contains('TRANSPORTATION NEAR') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('transportation near') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('Transportation near') ~ *").extract()
        temp=self.correctify_selection(temp,[])
        Transportation_near=temp

        #Bus Stations                  
        temp = response.css("h4:contains('BUS STATIONS') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('bus stations') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('Bus Stations') ~ *").extract()
        temp=self.correctify_selection(temp,[])
        Bus_Stations=temp

        #Tram Stations                  
        temp = response.css("h4:contains('TRAM STATIONS') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('tram stations') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h4:contains('Tram Stations') ~ *").extract()
        temp=self.correctify_selection(temp,[])
        Tram_Stations=temp

        #Restaurants                  
        temp = response.css("h3:contains('RESTAURANTS') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('restaurants') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('Restaurants') ~ *").extract()
        temp=self.correctify_selection(temp,[])
        Restaurants=temp

        #Supermarkets                  
        temp = response.css("h3:contains('Supermarkets') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('supermarkets') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('Supermarkets') ~ *").extract()
        temp=self.correctify_selection(temp,[])
        Supermarkets=temp

        #NEARBY BUILDINGS                  
        temp = response.css("h3:contains('NEARBY BUILDINGS') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('nearby buildings') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('Nearby Buildings') ~ *").extract()
        temp=self.correctify_selection(temp,[])
        nearby_buildings=temp

        #Major Landmarks                 
        temp = response.css("h3:contains('MAJO LANDMARKS') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('major landmarks') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('Major Landmarks') ~ *").extract()
        temp=self.correctify_selection(temp,[])
        Major_Landmarks=temp

        #CONSIDER                 
        temp = response.css("h3:contains('CONSIDER') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('consider') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('Consider') ~ *").extract()
        temp=self.correctify_selection(temp,[])
        Consider=temp

                
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

        #CONSIDER                 
        temp = response.css("h3:contains('CONSIDER') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('consider') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('Consider') ~ *").extract()
        temp=self.correctify_selection(temp,[])
        Consider=temp

        #schools                 
        temp = response.css("h3:contains('SCHOOLS AND NURSERIES') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('Schools and Nurseries') ~ *").extract()
        if len(temp) == 0:
            temp = response.css("h3:contains('Schools and Nurseries') ~ *").extract()
        temp=self.correctify_selection(temp,[])
        Schools_and_Nurseries=temp

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

        #imgs
        all_images=response.css("div.postMain").get()
        images=methods.img_downloader_method_src_area(all_images,signature)

        items["title"]=title
        items["cover_image"]="cover_image"
        items["cover_image"]=cover_image
        items["highlights"]=highlights
        items["about"]=about
        items["in_nutshell"]=in_nutshell
        items["floor_plans"]=floor_plans
        items["parking"]=parking
        items["Elevators"]=Elevators
        items["Security_Central_Air_Conditioning_and_Maintenance_Services"]=Security_Central_Air_Conditioning_and_Maintenance_Services
        items["Event_Space"]=Event_Space
        items["Gym_and_Fitness_Facilities"]=Gym_and_Fitness_Facilities
        items["Lifestyle_Amenities"]=Lifestyle_Amenities
        items["Concierge_and_Guest_Services"]=Concierge_and_Guest_Services
        items["Pet_friendly"]=Pet_friendly
        items["Apartment_Types"]=Apartment_Types
        items["one_Bedroom_Apartments_in"]=one_Bedroom_Apartments_in
        items["two_Bedroom_Apartments_in"]=two_Bedroom_Apartments_in
        items["three_Bedroom_Apartments_in"]=three_Bedroom_Apartments_in
        items["four_Bedroom_Apartments_in"]=four_Bedroom_Apartments_in
        items["penthouses"]=penthouses
        items["Villas"]=Villas
        items["Most_Popular_Apartment_Types_in"]=Most_Popular_Apartment_Types_in
        items["Rental_Trends"]=Rental_Trends
        items["Sales_Trends"]=Sales_Trends
        items["Rental_Yield"]=Rental_Yield
        items["Service_harges"]=Service_harges
        items["Transportation_near"]=Transportation_near
        items["Bus_Stations"]=Bus_Stations
        items["Tram_Stations"]=Tram_Stations
        items["Restaurants"]=Restaurants
        items["Supermarkets"]=Supermarkets
        items["nearby_buildings"]=nearby_buildings
        items["Major_Landmarks"]=Major_Landmarks
        items["Consider"]=Consider
        items["community_events"]=community_events
        items["attractions"]=attractions
        items["location"]=location
        items["Schools_and_Nurseries"]=Schools_and_Nurseries
        items["questions"]=questions
        items["answers"]=answers
        items["images"]=images
        yield items
        



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
        return result
    # sys.exit()
        
    def sanitize(self,text):
        res = ""
        try:
            res = text.replace("\n","") .replace("\t","").replace("\r","").replace("  ","")
        except:
            res = text
        return res                
        
    




    