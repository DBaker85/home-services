const presets = [ [
    "@babel/preset-env",
    {
      "targets": {
        "node": "14.17"
      }
    }
  ],
  "@babel/preset-typescript" ];
const plugins = [ "@babel/plugin-transform-runtime" ];

module.exports = { presets, plugins };