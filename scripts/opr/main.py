import requests
from bs4 import BeautifulSoup

# Make a GET request to the website
response = requests.get('https://opr.ae/projects/danube-elitz-apartments-for-sale-in-jumeirah-village-circle-dubai')

# Parse the HTML content
soup = BeautifulSoup(response.text, 'html.parser')

# Extract the desired information
title = soup.find('title').get_text()
links = soup.find_all('a')

# Save the data to a text file
with open('data.txt', 'w') as file:
    file.write(title + '\n')
    for link in links:
        file.write(link.get('href') + '\n')
