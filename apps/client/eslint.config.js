import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import globals from 'globals'

import sharedEslint from '@expedients/shared/eslint.config.mjs'

export default tseslint.config(
  ...sharedEslint,
  {
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'react': pluginReact
    },
    languageOptions: {
      globals: globals.browser
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true
        }
      ],
      'react/jsx-indent': [2, 2, {
        indentLogicalExpressions: true
      }],
      'react/jsx-one-expression-per-line': [1, {
        allow: 'literal'
      }],
      'react/jsx-closing-bracket-location': ['warn', 'line-aligned'],
      'react/jsx-curly-spacing': [
        'warn',
        'always',
        {
          allowMultiline: false
        }
      ],
      'react/jsx-filename-extension': ['warn', {
        extensions: ['.ts', '.tsx']
      }],
      'react/jsx-first-prop-new-line': ['warn', 'multiline'],
      'react/jsx-max-props-per-line': [1, {
        maximum: 1
      }],
      'react/jsx-tag-spacing': ['warn', {
        beforeSelfClosing: 'always'
      }],
      'react/jsx-sort-props': ['warn', {
        'callbacksLast': true,
        'shorthandFirst': true,
        'shorthandLast': true,
        'multiline': 'last'
      }]
      // 'react/react-in-jsx-scope': 'off',
      // 'react/jsx-no-target-blank': 'off'
    }
  }
)
