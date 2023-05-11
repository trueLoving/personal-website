"use strict";

var sass = require("dart-sass");
var extend = require("util")._extend;

module.exports = (ext) =>
  function (data) {
    // support global and theme-specific config
    var userConfig = extend(
      this.theme.config.dart_sass || {},
      this.config.dart_sass || {}
    );

    var config = extend(
      {
        data: data.text,
        file: data.path,
        outputStyle: "expanded",
        sourceComments: false,
        indentedSyntax: ext === "sass",
      },
      userConfig
    );

    try {
      // https://github.com/sass/dart-sass#legacy-javascript-api
      var result = sass.renderSync(config);
      // result is now Buffer instead of String
      return result.css.toString();
    } catch (error) {
      console.error(error.toString());
      throw error;
    }
  };
