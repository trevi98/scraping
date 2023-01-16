from bs4 import BeautifulSoup
from .file_downloader import img_downloader

class methods2():
    def get_text_from_same_element_and_seperate_to_key_value(params):
        soup = BeautifulSoup(params['elmnt'],'lxml')
        if params['key'] in soup.text:
            return {params['key'].lower():soup.txt.split(params['key'],1)[1]}
    def get_text_from_same_element_multiple_and_seperate_to_key_value(elmnts,param):
        data = {}
        for elmnt in elmnts:
            soup = BeautifulSoup(elmnt,'lxml')
            for key in param['keys']:
                if key in soup.text:
                    data[key.replace("\n",'').lower()] = soup.text.split(key,1)[1].replace("\n","").replace(":","")
        return data

    def get_text_as_list_form_simeler_elmnts(elmnts):
        data = []
        try:
            for elmnt in elmnts:
                soup = BeautifulSoup(elmnt,'lxml')
                data.append(soup.text.replace("\n","").replace("  ",""))
            return data
        except:
            return []