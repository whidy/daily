+++
title = "（未完成）Nuxt下的ESLint最佳实践"
date = "2018-02-13"
author = "whidy"
+++

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






https://stackoverflow.com/questions/20496084/git-status-ignore-line-endings-identical-files-windows-linux-environment
git config --global core.autocrlf false

https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration