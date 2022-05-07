const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
module.exports = {
  webpack: {
    plugins: [
      new MonacoWebpackPlugin(['json']),
      new FilterWarningsPlugin({
        exclude: /jsoneditor\/dist/
      })
    ],
    ignoreWarnings: ['jsoneditor']
  }
}