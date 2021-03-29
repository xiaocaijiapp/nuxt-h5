import env from './env'
// import sitemap from './config/sitemap'
export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Starday - ネット通販公式サイト｜Starday市場',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, viewport-fit=cover' },
      { hid: 'description', name: 'description', content: '' },
      { hid: 'description', name: 'description', content: 'Starday総合ネット通販サイト。自転車、インテリア、生活雑貨まで人気のアイテムが続々入荷中！激安な価格で登場！更に全品送料無料！ポイント還元・セールキャンペーン毎日実施中！' },
      { hid: 'keywords', name: 'keywords', content: 'starday,starday市場,starday mart,通販,インターネットショッピング,インターネット通販,オンラインショッピング' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  loading: false,
  server: {
    host: '0.0.0.0',
    port: 9093
  },
  env: {
    NODE_ENV: process.env.NODE_ENV,
    ENV_API: env.ENV_API,
    proxyUrl: env.proxyUrl
  },
  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['~assets/css/reset.less'],
  router: {
    mode: 'history',
    middleware: ['auth', 'i18n']
  },
  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/request',
    {
      src: '~/plugins/router',
      ssr: false
    },
    {
      src: '~plugins/i18n/index',
      ssr: true
    },
    {
      src: '~plugins/vant',
      ssr: true
    },
    {
      src: '~plugins/ios',
      ssr: false
    },
    {
      src: '~/plugins/store-cache',
      ssr: false
    },
    {
      src: '~/plugins/init',
      ssr: true
    },
    {
      src: '~/plugins/thirdpartyplugins',
      ssr: false
    }
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,
  render: {
    resourceHints: false
  },
  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    'cookie-universal-nuxt',
    '@nuxtjs/sitemap'
  ],
  sitemap: false,
  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    proxy: true,
    prefix: '/api/',
    credentials: true,
    baseUrl: env.ENV_API
  },
  proxy: {
    '/api/': {
      target: env.ENV_API,
      pathRewrite: { '^/api': '' }
    }
  },
  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    analyze: false,
    cssSourceMap: true,
    loaders: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          '@toast-icon-size': '64px',
          '@toast-default-width': '160px',
          '@toast-text-min-width': '352px',
          '@font-size-xs': '20px',
          '@font-size-sm': '24px',
          '@font-size-md': '28px',
          '@font-size-lg': '32px',
          '@line-height-xs': '28px',
          '@line-height-sm': '36px',
          '@line-height-md': '40px',
          '@line-height-lg': '44px',
          '@padding-base': '12px',
          '@dialog-button-height': '96px',
          '@nav-bar-icon-color': '#999999',
          '@button-default-height': '60px',
          '@nav-bar-arrow-size': '44px',
          '@tabs-bottom-bar-height': '6px',
          '@tabs-bottom-bar-color': '#ff5d19',
          '@nav-bar-height': '88px',
          '@cell-line-height': '40px',
          '@cell-vertical-padding': '20px',
          '@cell-horizontal-padding': '30px',
          '@field-label-width': '186px',
          '@cell-font-size': '28px',
          '@share-sheet-description-line-height': '26px',
          '@share-sheet-header-padding': '0px 16px',
          '@share-sheet-cancel-button-height': '86px',
          '@share-sheet-icon-size': '100px',
          '@share-sheet-option-name-color': '#333333',
          '@share-sheet-option-name-font-size': '22px',
          '@action-sheet-header-height': '88px'
        }
      },
      imgUrl: { limit: 10000 },
      file: {
        publicPath: 'assets'
      }
    },
    allChunks: true,
    extractCSS: true,
    transpile: [/vant.*?less/],
    vendor: ['vue-i18n'],
    babel: {
      plugins: [
        ['import', {
          libraryName: 'vant',
          style: (name) => {
            return `${name}/style/less.js`
          }
        }, 'vant']
      ]
    },
    postcss: {
      plugins: {
        'postcss-px-to-viewport': {
          unitToConvert: 'px', // 默认值`px`，需要转换的单位
          viewportWidth: '750', // 视窗的宽度,对应设计稿宽度
          viewportHeight: '667', // 视窗的高度, 根据375设备的宽度来指定，一般是667，也可不配置
          unitPrecision: '9', // 指定`px`转换为视窗单位值的小数位数
          propList: ['*'], // 转化为vw的属性列表
          viewportUnit: 'vw', // 指定需要转换成视窗单位
          fontViewportUnit: 'vw', // 字体使用的视窗单位
          selectorBlaskList: ['.ignore-'], // 指定不需要转换为视窗单位的类
          mediaQuery: false, // 允许在媒体查询中转换`px`
          minPixelValue: 1, // 小于或等于`1px`时不转换为视窗单位
          replace: true, // 是否直接更换属性值而不添加备用属性
          exclude: [], // 忽略某些文件夹下的文件或特定文件
          landscape: false // 是否添加根据landscapeWidth生成的媒体查询条件 @media (orientation: landscape)
        }
      },
      preset: {
        autoprefixer: true
      }
    },
    devtools: true,
    optimization: {
      splitChunks: {
        chunks: 'all',
        automaticNameDelimiter: '.',
        maxAsyncRequests: 7,
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.(css|vue)$/,
            chunks: 'all',
            enforce: true
          },
          vuetify: {
            test: /node_modules[\\/]vuetify/,
            chunks: 'all',
            priority: 20,
            name: true
          },
          vant: {
            test: /node_modules[\\/]vant/,
            chunks: 'all',
            priority: 20,
            name: true
          }
        }
      }
    },
    html: {
      minify: {
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: true,
        minifyJS: true,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true
      }
    },
    extend (config, { isDev, isClient }) {
      if (isClient && !isDev) {
        config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      }
    }
  }
}
