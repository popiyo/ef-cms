module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:security/recommended',
    'prettier/react',
    'prettier/standard',
  ],
  plugins: [
    'cypress',
    'eslint-plugin-sort-imports-es6-autofix',
    'jest',
    'jsdoc',
    'jsx-a11y',
    'prettier',
    'react',
    'security',
    'sort-destructure-keys',
    'sort-keys-fix',
    'spellcheck',
  ],
  rules: {
    'no-prototype-builtins': 0,
    'react/prop-types': 0,
    'require-atomic-updates': 0,
    'security/detect-child-process': 0,
    'security/detect-non-literal-fs-filename': 0,
    'security/detect-object-injection': 0,
    'react/jsx-sort-props': [
      'error',
      {
        callbacksLast: true,
        shorthandFirst: true,
        shorthandLast: false,
        ignoreCase: false,
        noSortAlphabetically: false,
      },
    ],
    'arrow-parens': ['error', 'as-needed'],
    'jsdoc/check-param-names': 1,
    'jsdoc/check-types': 1,
    'jsdoc/newline-after-description': 1,
    'jsdoc/require-jsdoc': 1,
    'jsdoc/require-param-description': 1,
    'jsdoc/require-param-name': 1,
    'jsdoc/require-param-type': 1,
    'jsdoc/require-param': 1,
    'jsdoc/require-returns-check': 1,
    'jsdoc/require-returns-description': 1,
    'jsdoc/require-returns-type': 1,
    'jsdoc/require-returns': 1,
    'jsdoc/valid-types': 1,
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
    'prettier/prettier': 'error',
    quotes: ['error', 'single', { avoidEscape: true }],
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to'],
      },
    ],
    'jsx-a11y/label-has-for': [
      2,
      {
        components: ['Label'],
        required: {
          every: ['id'],
        },
        allowChildren: false,
      },
    ],
    'sort-imports-es6-autofix/sort-imports-es6': [
      2,
      {
        ignoreCase: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      },
    ],
    'sort-keys-fix/sort-keys-fix': [
      'error',
      'asc',
      { caseSensitive: true, natural: true },
    ],
    'sort-destructure-keys/sort-destructure-keys': [
      2,
      { caseSensitive: false },
    ],
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: false,
          object: true,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    'spellcheck/spell-checker': [
      1,
      {
        comments: true,
        strings: false,
        identifiers: false,
        templates: false,
        lang: 'en_US',
        skipWords: [
          'fieldset',
          'param',
          'textarea',
          'Truthy',
          'usa',
          'ustc',
          'assignee',
          'petitionsclerk',
          'metadata',
          'binded',
          'listitem',
          'sortable',
          'hoverable',
          'desc',
          'minw',
          'maxw',
          'goto',
          'semibold',
          'noopener',
          'noreferrer',
          'douglass',
          'washington',
          'stanton',
          'anthony',
          'tubman',
          'fieri',
          'ramsay',
          'stin',
          'focusable',
          'ustaxcourt',
          'https',
          'transferee',
          'viewport',
          'pdfjs',
          'iframe',
          'namespace',
          'coversheet',
          'unstyled',
          'workitem',
          'workitems',
          'touchmove',
          'keydown',
          'mousedown',
          'px',
          'whistleblower',
          'unprioritize',
          'cognito',
          'stip',
          'renderer',
          'rect',
          'rescan',
          'jpg',
          'interactor',
          'submenu',
          'contentinfo',
          'cancelable',
          'unmount',
          'whitelist',
          'attributors',
          'html',
          'sinon',
          'fortawesome',
          'fontawesome',
          'formatter',
          'tabbable',
          'href',
          'eslint',
          'skipnav',
          'labelledby',
          'tabpanel',
          'wicg',
          'polyfill',
          'tabindex',
          'localhost',
          'docketclerk',
          'globals',
          'overline',
          'navbar',
          'cors',
          'getter',
          'args',
          'uniq',
          'tablist',
          'noop',
          'Seriatim',
          'Unsworn',
          'Sisqo',
          'Riker',
          'irs',
          'Disallowance',
          'Flavortown',
          'uuid',
          'uuidv4',
          'lodash',
          'dynam',
          'dynamsoft',
          'async',
          'jsdom',
          'postfix',
          'backend',
          'doctype',
          'payGovDate',
          'params',
          'dynamodb',
          'armens',
          'armen',
          'ashfords',
          'ashford',
          'buchs',
          'buch',
          'carluzzos',
          'carluzzo',
          'cohens',
          'cohen',
          'colvins',
          'colvin',
          'copelands',
          'foleys',
          'gerbers',
          'goekes',
          'goeke',
          'gustafsons',
          'gustafson',
          'halperns',
          'halpern',
          'holmes',
          'jacobs',
          'kerrigans',
          'kerrigan',
          'laubers',
          'lauber',
          'leydens',
          'leyden',
          'morrisons',
          'negas',
          'nega',
          'panuthos',
          'panuthos',
          'paris',
          'pughs',
          'ruwes',
          'ruwe',
          'thortons',
          'thorton',
          'urdas',
          'urda',
          'vasquezs',
        ],
        skipIfMatch: ['^https?://[^\\s]*$', '^[^\\s]{35,}$'],
        minLength: 4,
      },
    ],
  },
  settings: {
    react: {
      version: '16.8.3',
    },
  },
  env: {
    'cypress/globals': true,
    'jest/globals': true,
    browser: true,
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 9,
    jsx: true,
    sourceType: 'module',
  },
};
