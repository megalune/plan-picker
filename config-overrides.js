// config-overrides.js

const multipleEntry = require('react-app-rewire-multiple-entry')([
  {
    entry: 'src/individual.js',
    template: 'public/individual.html',
    outPath: '/individual.html'
  },
  {
    entry: 'src/small-group.js',
    template: 'public/small-group.html',
    outPath: '/small-group.html'
  }
]);

module.exports = {
  webpack: function(config, env) {
    multipleEntry.addMultiEntry(config);
    return config;
  }
};