const path = require('path');
const config = {
    entry: {
        index: './datePicker.js'
    },
    output: {
        path: path.join(__dirname, './'),
        filename: 'datePicker.min.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
}

module.exports = config;