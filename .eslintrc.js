module.exports = {
  "plugins": ["node", "fp", "jest", "json", "promise", "filenames"],
  "extends": [ "airbnb-base", "plugin:jest/recommended", "plugin:promise/recommended"],
  "rules": {
    "strict": "error",
    "semi": [
      "error",
      "never"
    ],
    "fp/no-arguments": "error",
    "fp/no-class": "error",
    "fp/no-delete": "error",
    "fp/no-events": "error",
    "fp/no-get-set": "error",
    "fp/no-let": "error",
    "fp/no-loops": "error",
    "fp/no-mutating-assign": "error",
    "fp/no-mutating-methods": "error",
    "fp/no-mutation": ["error", {
      "commonjs": true
    }],
    "fp/no-nil": "off", // fix this later
    "fp/no-proxy": "error",
    "fp/no-rest-parameters": "error",
    "promise/no-promise-in-callback": "off",
    "promise/no-nesting": "off",
    "fp/no-this": "error",
    "fp/no-throw": "off", // fix this later
    "fp/no-valueof-field": "error",
    "filenames/match-regex": ["off", "^([a-zA-Z\\.]+|[a-zA-Z\\.]+\\.\w+-spec\\.js)$", true], // fix this later
    "filenames/match-exported": "off",
    "filenames/no-index": "off",
    "no-var": "error"
  },
  "overrides": [
    {
      "files": ["*.spec.js", "*.ispec.js"],
      "rules": {
        "fp/no-nil": "off",
      }
    }
  ],
  "env": {
    "jest": true,
    "node": true,
  }
}
