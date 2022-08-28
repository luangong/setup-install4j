// @ts-check

// * @type { import('eslint').Linter.Config }

// https://typescript-eslint.io/docs/linting/
// https://www.npmjs.com/package/eslint-config-airbnb-typescript
// https://github.com/iamturns/eslint-config-airbnb-typescript/blob/master/lib/shared.js

module.exports = {
  root: true,
  overrides: [
    {
      // Config files for Node.js tools like ESLint, Babel, webpack, postcss, stylelint, Jest, etc.
      files: ['./*.js'],
      env: {
        // 'eslint-config-airbnb-base' includes 'node: true' as env.
        // See https://github.com/airbnb/javascript/issues/1476 and
        // https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/node.js
        // for more details.
        // node: true,
      },
      extends: [
        // https://www.npmjs.com/package/eslint-config-airbnb-base
        // https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/index.js
        'airbnb-base',
      ],
      plugins: [
        // Inherited from 'eslint-config-airbnb-base' automatically
        // 'import',
      ],
      rules: {
        'linebreak-style': 'off',
        'no-multi-spaces': ['error', {
          ignoreEOLComments: true,
        }],
      },
    },
    {
      // Files that run with Node.js
      files: ['src/**/*.ts'],
      // env: {
      //   node: true,      // 'eslint-config-airbnb' sets 'node: true' automatically
      // },
      parserOptions: {
        project: './tsconfig.json',
        // ecmaFeatures: {
        //   jsx: true,
        // },
        // ecmaVersion: 'latest',
        // sourceType: 'module',
      },
      plugins: [
        // 'react',               // eslint-plugin-react
        // '@typescript-eslint',  // @typescript-eslint/eslint-plugin
      ],
      extends: [
        // The 'extends' property value can omit the 'eslint-config-' prefix of the package name.
        // https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb/index.js
        'airbnb-base',            // eslint-config-airbnb-base

        // https://github.com/iamturns/eslint-config-airbnb-typescript/blob/master/lib/shared.js
        'airbnb-typescript/base', // eslint-config-airbnb-typescript

        // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      rules: {
        'linebreak-style': 'off',
      },
    },
    {
      // *.(ts|tsx) files for unit testing with Jest
      // Note that this block further overrides the previous block
      files: [
        '**/__tests__/**/*.[jt]s?(x)',
        '**/?(*.)+(spec|test).[tj]s?(x)',
      ],
      plugins: [
        // There is no need to specify the 'jest' plugin since the 'plugin:jest/recommended' config
        // already includes it.
        // See https://github.com/jest-community/eslint-plugin-jest/blob/main/src/index.ts for
        // more details.
      ],
      extends: [
        'plugin:jest/recommended',
      ],
      env: {
        // No need to specify 'jest: true' since the 'eslint-plugin-jest' plugin specifies
        // 'jest/globals: true'
        node: true,
      },
    },
  ],
};
