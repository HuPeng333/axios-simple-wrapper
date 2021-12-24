const path = require('path')

// webpack中所有的配置信息都应该写在module.exports里
module.exports = {
    // 指定入口文件
    entry: "./src/index.js",
    // 指定打包文件所在目录(输出目录)
    // mode: "production",
    mode: "development",
    target: 'web',
    output: {
        // libraryTarget: "es6",
        globalObject: "this",
        library: "betterAjax",
        // 指定打包文件的目录
        path: path.resolve(__dirname, 'dist'),
        // 打包后文件的名称
        filename: "index.js",
    },
    // 指定webpack打包时要使用的模块
    module: {
    },
    // 用来设置引用模块
    resolve: {
        extensions: ['.js']
        // "path": require.resolve("path-browserify")
    }
}
