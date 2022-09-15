module.exports = {
  extends: ["standard-with-typescript", "turbo", "prettier"],
  env: {
    es2021: true,
    node: true,
  },
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["import", "@typescript-eslint"],

  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts"],
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".ts"],
        moduleDirectory: ["node_modules", "src/"],
      },
      typescript: {
        alwaysTryTypes: true,
        project: ".",
      },
    },
  },
  rules: {},
  ignorePatterns: [
    "**/*.js",
    "node_modules",
    ".turbo",
    "dist",
    "coverage",
    "*.d.ts",
  ],
};
