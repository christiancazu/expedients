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
    files: ['**/*.{js,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      'semi': ['warn', 'never'],
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
      ],
    }
  }
)