const webpack = require('webpack');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
module.exports = {
    target: 'node',
    plugins: [
        // Work around for Buffer is undefined:
        // https://github.com/webpack/changelog-v5/issues/10
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        new NodePolyfillPlugin()
    ],
    resolve: {
        extensions: [ '.ts', '.js' ],
        fallback: {
            "stream": require.resolve("stream-browserify"),
            "buffer": false
        }
    },
}