from csvhandler import csvHandler
import requests


handler = csvHandler()
handler.handle(folder='data',columns=['imgs','plans_2d','plans_3d'])
# handler.handle(folder='data',columns=['cover','images'])
requests.get('https://profoundproject.com/tele', {'message':'All files done'})
