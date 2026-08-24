import path from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";

export default {
  mode: "development",
  entry: "./src/script.js", //Change as needed.
  output: {
    filename: "main.js",
    path: path.resolve(import.meta.dirname, "dist"),
    clean: true,
  },
  devtool: "eval-source-map",
  devServer: {
    watchFiles: ["./src/index.html"], //Change as needed.
    open: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html", //Change as needed.
    }),
  ],
  module: {
    rules: [
      {
        // For bundling CSS
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        // For loading local images referenced inside html
        test: /\.html$/i,
        use: ["html-loader"],
      },
      {
        // For using local image files inside JavaScript
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
};