import requests

# URL of the image to download
url = 'https://www.propertyfinder.ae/images/pf_newprojects/floorplan/f35377f28ef6a47713401d7becb76d0c4b22f172/desktop.webp'

# File name to save the image as
filename = 'image.webp'

# Send a GET request to the image URL
headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/110.0',
  'Accept': 'image/avif,image/webp,*/*',
  'Accept-Language': 'en-US,en;q=0.5',
  'Accept-Encoding': 'gzip, deflate, br',
  'Referer': 'https://www.propertyfinder.ae/en/new-projects/arada/robinia'
}
response = requests.get(url,headers=headers)

# Raise an exception if the request returns a status code other than 200
response.raise_for_status()

# Save the image to the specified file
with open(filename, 'wb') as f:
    f.write(response.content)

print(f'{filename} has been downloaded')
