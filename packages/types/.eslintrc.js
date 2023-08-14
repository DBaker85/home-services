var config = require("config");
module.exports = {
  ...config,
  parserOptions: {
    ...config.parserOptions,
    root: true,
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
};
