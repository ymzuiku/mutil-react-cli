const dev = process.env.NODE_ENV === 'development'
const prod = process.env.NODE_ENV === 'production'
if(dev){
  console.log("正处于开发模式：process.env.NODE_ENV === 'development'")
}

const env = {
  dev, prod
}

export default env