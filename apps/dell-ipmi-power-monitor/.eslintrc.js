var config = require("config");
module.exports = {
  ...config,
  parserOptions: {
    ...config.parserOptions,
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
};
