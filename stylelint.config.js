export default {
  extends: ['stylelint-config-standard'],
  rules: {
    'import-notation': 'string',
    'custom-property-pattern':
      '^(?:[a-z][a-z0-9]*(?:-[a-z0-9]+)*|text-[a-z0-9-]+--(?:line-height|letter-spacing|font-weight))$',
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'apply',
          'custom-variant',
          'reference',
          'source',
          'theme',
          'utility',
          'variant',
        ],
      },
    ],
  },
};
