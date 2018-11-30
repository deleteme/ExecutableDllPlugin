/**
 * @file ExecutableDLLPlugin allows to execute DllPlugin bundle when it is imported via a script tag into the page
 */

module.exports = class ExecutableDLLPlugin {
  constructor(options) {
    this.options = options || {};
    this.name = 'ExecutableDLLPlugin';
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(this.name, compilation => {
      compilation.mainTemplate.hooks.startup.tap(this.name, (source, chunk) => {
        const filterChunkModules = m => {
          const execute = this.options.execute;
          if (execute) {
            return execute.includes(m.id);
          }
          return true;
        };
        const ids = [...chunk._modules]
          .filter(filterChunkModules)
          .map(m => `'${m.id}'`)
          .join(',');

        if (ids.length) {
          return `[${ids}].forEach(__webpack_require__);\n\n` + source;
        }

        return source;
      });
    });
  }
};