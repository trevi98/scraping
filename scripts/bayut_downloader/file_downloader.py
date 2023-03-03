import urllib.request
import os
import requests
import ssl
import urllib.request

class img_downloader():

    def download(url, signature, idd):
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE
        url = str(url)
        try:
        # User-Agent string
            user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36'

            extension = url.rsplit(".", 1)
            new_name = f"{signature}-_-{idd}.{extension[1]}"
            try:
                # Create a Request object with the User-Agent header
                req = urllib.request.Request(url, headers={'User-Agent': user_agent})

                # Open the URL with the Request object
                with urllib.request.urlopen(req,context=context) as url:
                    s = url.read()
            except urllib.error.HTTPError as e:
                print(f'HTTP Error: {e.code}')
            except urllib.error.URLError as e:
                print(f'URL Error: {e.reason}')
            else:
                directory = "./files"
                try:
                    os.makedirs(directory)
                except FileExistsError:
                    # directory already exists
                    pass
                with open(f'./files/{new_name}', 'wb') as f:
                    f.write(s)
                    return new_name
        except Exception as error:
            print('error inside download function '+ url+' error: '+str(error))
            requests.get('https://profoundproject.com/tele', {'message':'Error occured => error inside the download function '+ url+' Error: '+str(error)})


