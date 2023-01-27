import pandas as pd
import os
from file_downloader import img_downloader

class csvHandler():
# Read CSV file
    # def __init__(self,data):
        # self.folders = data
    def handle(self,folder,columns) :
        folder_path = folder
        file_names = [f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))]
        for file in file_names:
            df = pd.read_csv(folder+'/'+file)

            # Add a new column 'New_Column'


            # Fill the new column with data depending on the 'Age' column
            for column in columns:
                for index, row in df.iterrows():
                    signaturea = row['signaturea']
                    if ',' in row[column]:
                        links = row[column].split(",")
                        res = self.download_array(links,signaturea)
                        df.at[index, column] = res
                    else:
                        link = row[column]
                        res = self.download(link,signaturea)
                        df.at[index, column] = res

            # Save the DataFrame to the CSV file
            df.to_csv(folder+'/'+file, index=False)


    def download(self,link,signaturea):
        return img_downloader.download(link,signaturea,99)

    def download_array(self,links,signaturea):
        counter = 1
        data = []
        for link in links:
            data.append(img_downloader.download(link,signaturea,counter))
            counter +=1
        return data
