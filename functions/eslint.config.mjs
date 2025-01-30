import eslintPluginTS from "@typescript-eslint/eslint-plugin"
import eslintParserTS from "@typescript-eslint/parser"
import prettier from "eslint-config-prettier"
import eslintPluginImport from "eslint-plugin-import"

export default [
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: eslintParserTS,
    },
    plugins: {
      import: eslintPluginImport,
      "@typescript-eslint": eslintPluginTS,
    },
    rules: {
      ...eslintPluginImport.configs.errors.rules,
      ...eslintPluginImport.configs.warnings.rules,
      ...eslintPluginImport.configs.typescript.rules,
      ...eslintPluginTS.configs.recommended.rules,
      ...prettier.rules,
    },
    files: ["src/**/*.tx"],
  },
]
