@call npm install
@call node node_modules/webpack/bin/webpack.js --config webpack.config.vendor.js --env.prod
@call node node_modules/webpack/bin/webpack.js --env.prod