https://nuxtjs.org/guide/development-tools/

https://medium.com/@agm1984/how-to-set-up-es-lint-for-airbnb-vue-js-and-vs-code-a5ef5ac671e8

https://cn.vuejs.org/v2/style-guide/index.html

.eslintrc.js
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    "eslint:recommended",
    'plugin:vue/recommended',
    "plugin:prettier/recommended"
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    "semi": [2, "never"],
    'vue/html-indent': "off",
    "vue/max-attributes-per-line": "off",
    "prettier/prettier": ["error", {
      "semi": false,
      "singleQuote": true
    }]
  }
}








.prettierrc
{
  "semi": false,
  "singleQuote": true
}


安装Vetur
settings.json
{
  "vetur.format.defaultFormatter.html": "js-beautify-html",
  // "editor.formatOnSave": true,
  "eslint.autoFixOnSave": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    {
      "language": "vue",
      "autoFix": true
    }
  ],
}