// webpack.config.js
const path = require("path");

module.exports = {
  entry: {
    resetPassword: "./react/ResetPassword.jsx",
    signin: "./react/Signin.jsx",
    signup: "./react/Signup.jsx",
  },
  output: {
    // eslint-disable-next-line no-undef
    path: path.resolve(__dirname, "public", "bundle"),
    filename: "[name].bundle.js",
  },
  devServer: {
    static: {
      // eslint-disable-next-line no-undef
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 9000,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
