import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, eslint.configs.recommended, ...tseslint.configs.strict, ...tseslint.configs.stylistic],
    files: ['**/*.{js,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'react': pluginReact,
      '@stylistic': stylistic
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
      'react/jsx-indent': [2, 2, { indentLogicalExpressions: true }],
      'react/jsx-one-expression-per-line': [1, { allow: 'literal' }],
      'react/jsx-closing-bracket-location': ['warn', 'line-aligned'],
      'react/jsx-curly-spacing': [
        'warn',
        'always',
        {
          allowMultiline: false
        }
      ],
      'react/jsx-filename-extension': ['warn', { extensions: ['.ts', '.tsx'] }],
      'react/jsx-first-prop-new-line': ['warn', 'multiline'],
      'react/jsx-max-props-per-line': [1, { maximum: 1 }],
      'react/jsx-tag-spacing': ['warn', {
        beforeSelfClosing: 'always'
      }],
      'react/jsx-sort-props': ['warn', { 
        'callbacksLast': true,
        'shorthandFirst': true,
        'shorthandLast': true,
        'multiline': 'last'
      }],
      // 'react/react-in-jsx-scope': 'off',
      // 'react/jsx-no-target-blank': 'off',

      // 'import/no-unresolved': 'off',
      'semi': ['warn', 'never'],
      'no-shadow': 'off',
      'no-param-reassign': ['warn', { props: false }],
      quotes: ['warn', 'single', { allowTemplateLiterals: true }],
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
      'object-curly-spacing': ['warn', 'always'],
      // 'object-curly-newline': [
      //   'warn',
      //   {
      //     ObjectExpression: 'always',
      //     ImportDeclaration: { multiline: false, minProperties: 2 },
      //     ObjectPattern: { multiline: false, minProperties: 3 },
      //   },
      // ],

      '@stylistic/semi': ['warn', 'never'],
      '@stylistic/eol-last': ['warn', 'always'],
      '@stylistic/no-extra-semi': 'warn',
      '@stylistic/member-delimiter-style': 'warn',
      '@stylistic/comma-dangle': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          'argsIgnorePattern': '^_',
          'varsIgnorePattern': '^_',
          'caughtErrorsIgnorePattern': '^_'
        }
      ]
    }
  }
)
