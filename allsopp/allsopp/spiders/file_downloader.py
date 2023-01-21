import urllib.request
import os
class img_downloader():

    def download(url, signature, idd):


        extension = url.rsplit(".", 1)
        new_name = f"{signature}-_-{idd}.{extension[1]}"
        try:
            # Create a Request object with the User-Agent header
            req = urllib.request.Request(url)
            
            # Open the URL with the Request object
            with urllib.request.urlopen(req) as url:
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

