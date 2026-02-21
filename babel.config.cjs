module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { runtime: "automatic" }],
    "@babel/preset-typescript",
  ],
  plugins: [
    "@babel/plugin-syntax-import-meta",
    // Custom plugin to replace import.meta.env with process.env in tests
    function () {
      return {
        visitor: {
          MemberExpression(path) {
            // Check if this is import.meta.env
            if (
              path.node.object.type === "MetaProperty" &&
              path.node.object.meta.name === "import" &&
              path.node.object.property.name === "meta" &&
              path.node.property.name === "env"
            ) {
              // Replace import.meta.env with a global object
              path.replaceWithSourceString(
                "(globalThis.import_meta_env || {})",
              );
            }
          },
        },
      };
    },
  ],
};
