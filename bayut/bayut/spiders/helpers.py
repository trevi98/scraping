from bs4 import BeautifulSoup
from .file_downloader import img_downloader
class methods():
    def get_nabor_elmnt(elmnts,params):
        data = {}
        for elmnt in elmnts:
            soup = BeautifulSoup(elmnt,'lxml')
            for param in params:
                try:
                    if soup.find(param['nabor_element'],class_=param['nabor_selector']).get_text() == param['nabor_value']:
                        data[param['name']] = soup.find(param['target_element'],class_=param['target_selector']).get_text()
                except:
                    continue
        return data

    def scrape_element_if_contains_extact(elmnts,params):
        data = {}
        for elmnt in elmnts:
            soup = BeautifulSoup(elmnt,'lxml')
            for param in params:
                try:
                    if soup.find(param['checker_element'],class_=param['checker_selector']).get_text() == param['checker_value']:
                        data[param['name']] = soup.get_text()
                except:
                    continue
        return data

    def scrape_element_if_contains_target(elmnts,params):
        data = {}
        for elmnt in elmnts:
            soup = BeautifulSoup(elmnt,'lxml')
            for param in params:
                try:
                    if soup.find(param['target_element'],class_=param['target_selector']).get_text():
                        data[soup.find(param['target_element'],class_=param['target_selector']).get_text()] = soup.get_text()
                except:
                    continue

        return data

    def get_pares_from_elmnt(elmnts,params):
        data = {}
        for elmnt in elmnts:
            soup = BeautifulSoup(elmnt,'lxml')
            for param in params:
                try:
                    data[soup.find(param['title_elmnt'],class_=param['title_selector']).get_text()] = soup.find(param['content_elmnt'],class_=param['content_selector']).get_text()
                except:
                    continue
        return data

    def get_pares_from_elmnt_if_contains(elmnts,params):
        data = {}
        for elmnt in elmnts:
            soup = BeautifulSoup(elmnt,'lxml')
            for param in params:
                try:
                    if param['title_value'] in soup.find(param['title_elmnt'],class_=param['title_selector']).get_text():
                        data[soup.find(param['title_elmnt'],class_=param['title_selector']).get_text()] = soup.find(param['content_elmnt'],class_=param['content_selector']).get_text()
                except:
                    continue
        return data

    def get_img_with_content(elmnts,params):
        data = {}
        for elmnt in elmnts:
            soup = BeautifulSoup(elmnt,'lxml')
            counter = 0
            for param in params:
                try:
                    if soup.find(param['target_element'],class_=param['target_selector']).get_text():
                        data[soup.find(param['target_element'],class_=param['target_selector']).get_text()] = soup.get_text()
                        data[soup.find(param['target_element'],class_=param['target_selector']).get_text() + ' image'] = methods.img_downloader_method(elmnt,param['signature'])
                        counter += 1
                except:
                    continue
        return data  
  

    def img_downloader_method(elmnt,signature):
        data = []
        soup = BeautifulSoup(elmnt,'lxml')
        imgs = soup.find_all('img')
        counter = 0
        for img in imgs:
            counter += 1
            try:
                if 'svg' not in img['data-src']:
                    data.append(img_downloader.download(img['data-src'],signature,counter))
            except:
                continue
        return data  




