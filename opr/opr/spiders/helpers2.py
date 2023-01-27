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
                if soup.text.find(key) > -1:
                    data[key.replace("\n",'').lower()] = soup.text.split(key,1)[1].replace("\n","").replace(":","")
        return data
    def get_text_from_same_element_multiple_and_seperate_to_custom_key_value(elmnts,param):
        data = {}
        for elmnt in elmnts:
            soup = BeautifulSoup(elmnt,'lxml')
            for key in param['keys']:
                if soup.text.find(key) > -1:
                    data[param['keys'][key].replace("\n",'').lower()] = soup.text.split(key,1)[1].replace("\n","").replace(":","")
                    if len(data[param['keys'][key]]) == 0:
                        data[param['keys'][key].replace("\n",'').lower()] = soup.text.split(key,1)[0].replace("\n","").replace(":","")  
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

    def handle_table_rows(row):
        soup = BeautifulSoup(row,'lxml')
        tds = soup.findAll('td')
        data = []
        for td in tds:
            data.append({td['headers'][0].replace("\n","").replace("  ","").replace("\r","").replace("\t",""):td.text.replace("\n","").replace("  ","").replace("\r","").replace("\t","")})
        return data

    def handle_table_rows_w_precent(row):
        # soup = BeautifulSoup(row,'lxml')
        tds = row.find_all('td')
        data = []
        for td in tds:
            try:
                try:
                    data.append({td['headers'][0].replace("\n","").replace("  ","").replace("\r","").replace("\t",""):td.text.replace("\n","").replace("  ","").replace("\r","").replace("\t","")})
                except:
                    data.append({td['headers'][0].replace("\n","").replace("  ","").replace("\r","").replace("\t",""):td.find('div',class_='a-Report-percentChart-fill')['aria-valuenow'].replace("\n","").replace("  ","").replace("\r","").replace("\t","")})
            except:
                print("/////////////////_____________________/////////////////////////////")
                print(td)
                print("/////////////////_____________________/////////////////////////////")
        return data