module.exports = {
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 2020,
        project: './tsconfig.json'
    },
    env: {
        "jest": true
    },
    rules: {
        'eol-last': ['error', 'always'],
        'class-methods-use-this': 'off',
        '@typescript-eslint/indent': ['off', 'spaces'],
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'max-classes-per-file': 'off',
        'no-param-reassign': ['error', { 'props': false }],
        'import/prefer-default-export': 'off',
        'no-underscore-dangle': 'off',
        'no-use-before-define': ['error', 'nofunc'],
        'indent': ['error', 2],
        'brace-style': ['error', '1tbs'],
        'quotes': ['error', 'single'],
        'no-tabs': 'error',
        'max-len': 'off',
        'func-names': 'off',
        'prefer-arrow-callback': 'off',
        'no-restricted-syntax': [
            'error',
            {
                selector: 'ForInStatement',
                message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
            },
            {
                selector: 'LabeledStatement',
                message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
            },
            {
                selector: 'WithStatement',
                message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
            },
        ],
    },
}
