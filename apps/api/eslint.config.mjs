import sharedEslint from '@expedients/shared/eslint.config.mjs'
import globals from 'globals'

export default [
  ...sharedEslint,
  {
    ignores: ['**/eslint.config.mjs', '**/migrations/**'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest
      }
    },
    rules: {
      "@typescript-eslint/no-extraneous-class": [
        'warn',
        {
          'allowConstructorOnly': true,
          'allowEmpty': true,
          'allowStaticOnly': true,
          'allowWithDecorator': true
        }
      ],
      '@stylistic/indent': 'off',
      indent: 'off'
    },
  },
  {
    rules: {
      '@stylistic/indent': ["warn", 2, {
        SwitchCase: 1,
        VariableDeclarator: 'first',
        MemberExpression: 1,
        ImportDeclaration: 1
      }]
    }
  }
]
