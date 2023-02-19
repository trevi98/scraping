import pandas as pd
import requests
import os
from file_downloader import img_downloader
import uuid

class csvHandler():
    counter_rec = 0
# Read CSV file
    # def __init__(self,data):
        # self.folders = data
    def handle(self,folder,columns) :
        folder_path = folder
        file_names = [f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))]
        # print(file_names)
        for file in file_names:
            try:
                df = pd.read_csv(folder+'/'+file)
                requests.get('https://profoundproject.com/tele', {'message':'file '+file})
                # print(df)
                # Add a new column 'New_Column'


                # Fill the new column with data depending on the 'Age' column
                for column in columns:
                    for index, row in df.iterrows():
                        self.counter_rec +=1
                        if self.counter_rec % 100 == 0:
                            requests.get('https://profoundproject.com/tele', {'message':'file '+str(self.counter_rec)+ ' is done'})
                            # self.counter_rec = 0
                        signaturea = row['signaturea']
                        # if len(str(row[column])) == 0:
                        #     continue
                        if ',' in str(row[column]):
                            links = row[column].split(",")
                            res = self.download_array(links,signaturea)
                            df.at[index, column] = res
                        elif ',' not in str(row[column]) and len(str(row[column])) > 3:
                            link = row[column]
                            print(link)
                            res = self.download(str(link),signaturea)
                            requests.get('https://profoundproject.com/tele', {'message':'Link '+str(link)})
                            df.at[index, column] = res
            except Exception as error:
                print('file error '+ file+' Error: '+str(error))
                requests.get('https://profoundproject.com/tele', {'message':'Error occured => file error '+ file+' Error: '+str(error)})


            # Save the DataFrame to the CSV file
            try:
                df.to_csv(folder+'/'+file, index=False)
            except Exception as error:
                print('saving error '+file+' error: '+str(error))
                requests.get('https://profoundproject.com/tele', {'message':'Error occured => saving error '+ file+' Error: '+str(error)})



    def download(self,link,signaturea):
        link = str(link)
        try:
            if "800x600" not in str(link):
                link = str(link).replace('120x90',"800x600").replace("600x450","800x600")
            return img_downloader.download(link,signaturea,uuid.uuid1())
        except Exception as error:
            print('single download error '+str(link)+' error: '+str(error))
            requests.get('https://profoundproject.com/tele', {'message':'Error occured => single download error '+ str(link)+' Error: '+str(error)})
            return "N\A"



    def download_array(self,links,signaturea):
        counter = 1
        data = []
        for link in links:
            link = str(link)
            try:
                if "800x600" not in str(link):
                    link = str(link).replace('120x90',"800x600").replace("600x450","800x600")
                data.append(img_downloader.download(link,signaturea,counter))
                counter +=1
            except Exception as error:
                print("error in multiple downloads "+link+" error: "+str(error))
                requests.get('https://profoundproject.com/tele', {'message':'Error occured => error in multiple download '+ link+' Error: '+str(error)})
        return data
