module.exports = {
  outputDir: './docs',
  publicPath: process.env.NODE_ENV === 'production' ? '/javascript-archive/' : '/',
  css: {
    loaderOptions: {
      scss: {
        additionalData: `
          @import "@/assets/scss/_variables.scss";
        `
      }
    }
  }
}