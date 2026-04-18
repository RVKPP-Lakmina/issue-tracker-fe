import nextVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
    ...nextVitals,
    {
        rules: {
            'react/no-unescaped-entities': 'off',
            'react-hooks/set-state-in-effect': 'off',
            'react-hooks/incompatible-library': 'off',
            'react-hooks/purity': 'off',
        },
    },
];

export default eslintConfig;
