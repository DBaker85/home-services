const presets = [
  [
    "@babel/preset-env",
    {
      targets: {
        node: "18",
      },
    },
  ],
  "@babel/preset-typescript",
];
const plugins = ["@babel/plugin-transform-runtime"];

module.exports = { presets, plugins };
