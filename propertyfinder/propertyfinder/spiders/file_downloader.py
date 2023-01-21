import urllib.request
import os
import requests
class img_downloader():

    def download(url, signature, idd):
        # User-Agent string
        headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/110.0',
        'Accept': 'image/avif,image/webp,*/*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://www.propertyfinder.ae/en/new-projects/arada/robinia'
        }

        extension = url.rsplit(".", 1)
        new_name = f"{signature}-_-{idd}.webp"
        s=''
        try:
            # Create a Request object with the User-Agent header
            response = requests.get(url+'.webp', headers=headers)
            
            # Open the URL with the Request object
            response.raise_for_status()
            s = response.content
            directory = "./files"
            try:
                os.makedirs(directory)
            except FileExistsError:
                # directory already exists
                pass
                with open(f'files/{new_name}', 'wb') as f:
                    f.write(response.content)
                return new_name

        except requests.exceptions.HTTPError as e:
            print(f'HTTP Error: {e}')
        # else:
        
