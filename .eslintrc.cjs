module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': 'google',
  "plugins": [
    "prefer-arrow"
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  'rules': {
    "indent": ["error", 2],
    "object-curly-spacing": ["error", "always"],
    "prefer-arrow/prefer-arrow-functions": ["error", { disallowPrototype: true }],
    "quotes": ["error", "double", { allowTemplateLiterals: true }],
    "semi": ["error", "always"],

    "comma-dangle": ["error", "never"],
    "eqeqeq": ["error", "always", { null: "ignore" }],
    "max-len": "off",
    "no-restricted-properties": [
      "error",
      { object: "document", property: "getElementById", message: "Please use querySelector instead" },
      { object: "document", property: "getElementsByClassName", message: "Please use querySelector instead" },
      { object: "document", property: "getElementsByTagName", message: "Please use querySelector instead" },
      { property: "appendChild", message: "Please use append instead" },
      { property: "onblur", message: "Please use addEventListener instead" },
      { property: "onchange", message: "Please use addEventListener instead" },
      { property: "onclick", message: "Please use addEventListener instead" },
      { property: "onsubmit", message: "Please use addEventListener instead" }
    ],
    "no-restricted-syntax": ["error", "ForInStatement", "LabeledStatement"],
    "prefer-const": "off",
    "require-jsdoc": "off",
    "spaced-comment": "off"
  },
};
