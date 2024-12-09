import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      eslint.configs.recommended,
      ...tseslint.configs.strict,
      ...tseslint.configs.stylistic
    ],
    files: ['**/*.{mjs,js,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      semi: ['warn', 'never'],
      quotes: ['warn', 'single', {
        allowTemplateLiterals: true
      }],
      'comma-spacing': 'warn',
      'no-multi-spaces': [
        'error',
        { 'exceptions': { 'VariableDeclaration': true } }
      ],
      indent: [
        'warn',
        2,
        {
          SwitchCase: 1,
          VariableDeclarator: 'first',
          MemberExpression: 1,
          ImportDeclaration: 1
        }
      ],
      'space-in-parens': ['warn', 'never'],
      '@stylistic/no-trailing-spaces': 'warn',
      'object-curly-spacing': ['warn', 'always'],
      '@stylistic/semi': ['warn', 'never'],
      '@stylistic/eol-last': ['warn', 'always'],
      '@stylistic/no-extra-semi': 'warn',
      '@stylistic/member-delimiter-style': [
        'warn',
        {
          overrides: {
            interface: {
              multiline: {
                delimiter: 'none',
                requireLast: true
              }
            }
          }
        }
      ],
      '@stylistic/comma-dangle': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ]
    }
  }
);