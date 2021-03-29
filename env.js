let ENV_API; let proxyUrl
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'dev') {
  ENV_API = 'http://192.168.0.7:8100/' // 测试服务器地址
  proxyUrl = 'http://localhost:9093/'
} else if (process.env.NODE_ENV === 'test') {
  ENV_API = 'http://192.168.0.7:8100/' // 测试服务器地址
  proxyUrl = 'http://192.168.0.242:7900/'
} else {
  ENV_API = 'https://api.starday.jp/' // 测试服务器地址
  proxyUrl = 'https://m.starday.jp/'
}
export default { ENV_API, proxyUrl }
