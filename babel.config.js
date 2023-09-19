module.exports = function (api) {
  api.cache(true);

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          envName: "APP_ENV",
          moduleName: "@env",
          path: ".env",
        },
      ],

      [
        "transform-inline-environment-variables",
        {
          include: ["EXPO_ROUTER_APP_ROOT"],
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
