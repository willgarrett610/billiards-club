module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'next/core-web-vitals',
        'prettier',
    ],
    rules: {
        eqeqeq: ['warn', 'always', { null: 'ignore' }],
        'prefer-destructuring': [
            'warn',
            {
                array: true,
                object: true,
            },
            {
                enforceForRenamedProperties: false,
            },
        ],
    },
};
