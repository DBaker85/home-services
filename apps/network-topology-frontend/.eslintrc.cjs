module.exports = {
  env: { browser: true, es2020: true, node: false },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  parser: "@typescript-eslint/parser",
  root: true,
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json", "./tsconfig.node.json", "vite.config.ts"],
  },
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": "warn",
  },
};
