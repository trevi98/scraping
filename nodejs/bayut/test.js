async function main(){
    let text = "dddd"
    text = await clean(func(text))
    console.log(text)
}

async function func(text){
    return text

}
async function clean(text){
    console.log(text)
    return text.replace('\n','').replace('\t','')
}

main()