const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  runtimeCompiler: true,
  transpileDependencies: true,
  pages: {
    index: {
      entry: './src/main.js',
      title: 'Магазин белья Moire',
    },
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/bj_moire/'
    : '/',   
});
