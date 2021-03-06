const express = require('express')
const consola = require('consola')
const compression = require('compression')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const cachePage = require('../static/globalCache')
// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'pro'
app.use(compression())
async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)
  app.get('/refreshCache', (req, res, next) => {
    cachePage.set('index', null)
    res.sendStatus(200)
  })

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
