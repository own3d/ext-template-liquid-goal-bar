import tsEslint from 'typescript-eslint';
import stylisticTs from '@stylistic/eslint-plugin-ts';
import vueParser from 'vue-eslint-parser';
import pluginVue from 'eslint-plugin-vue'

export default tsEslint.config(
  ...tsEslint.configs.recommended,
  ...tsEslint.configs.stylistic,
  {
    files: ['**/*.{js,ts,jsx,tsx,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      eqeqeq: ['error', 'smart'],
    },
  },
  {
    files: ['**/*.{ts,tsx,vue}'],
    languageOptions: {
      parser: tsEslint.parser,
    },
    plugins: {
      '@typescript-eslint': tsEslint.plugin
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
    }
  },
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsEslint.parser,
      },
    },
    rules: {
      'vue/multi-word-component-names': 'warn',
      'vue/no-dupe-keys': 'warn'
    }
  },
  {
    plugins: {
      '@stylistic/ts': stylisticTs
    },
    rules: {
      '@/linebreak-style': ['error', 'unix'],
      '@stylistic/ts/semi': 'off',
      '@stylistic/ts/keyword-spacing': ['error', { overrides: {
        if: { after: false },
        catch: { after: false },
        for: { after: false },
        switch: { after: false },
      } }],
      '@stylistic/ts/object-curly-spacing': ['error', 'always'],
      '@stylistic/ts/quotes': ['error', 'single'],
      '@stylistic/ts/quote-props': ['error', 'consistent-as-needed'],
      '@stylistic/ts/indent': ['error', 2],
      '@/no-multi-spaces': 'error',
      '@stylistic/ts/block-spacing': 'error',
      '@stylistic/ts/comma-dangle': ['error', 'only-multiline'],
      '@/no-mixed-spaces-and-tabs': 'error',
      '@/no-trailing-spaces': ['error', { skipBlankLines: true }],
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/consistent-type-imports': 'off'
    },
  },
  {
    ignores: [ '.idea/*', '.vscode/*', '.nuxt/*', '.output/*', 'dist/*', '**/AppSSHPre.vue' ],
  },
);
