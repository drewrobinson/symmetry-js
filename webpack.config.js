const path = require('path');

const config = {

    mode: 'production',
    
    entry: [
        './src/symmetry.js'],

    devServer: {
        disableHostCheck: true
    },

    optimization: {
        minimize: true
    },

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './dist'),
        library: 'Symmetry',
        libraryTarget: 'umd',
        publicPath: '/dist/',
        umdNamedDefine: true
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules\/(?!(@webcomponents\/shadycss|lit-html|@polymer|)\/).*/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env'
                        ],
                        plugins: []
                    }
                }
            },
        ]
    },

    devtool: 'inline-source-map'
};

module.exports = config;
