from bs4 import BeautifulSoup
arr=["p","h","p","p","ul","w","h","p","a","h","p"]
all_titles=[]
all_des=[]
for i in range(len(arr)):
    if arr[i].__contains__("<h4>"):
        title=BeautifulSoup(arr[i],"lxml").text
        all_titles.append(title)
        s=i+1
        while True:
            one=""
            arr[s]=BeautifulSoup(arr[s],"lxml").text
            one+=arr[s]
            all_des.append(one)
            s+=1
            if (arr[s].__contains__("<p>")) or (arr[s].__contains__("<ul>")):
                continue
            else:
                break
        i=s    
    else:
        continue        
