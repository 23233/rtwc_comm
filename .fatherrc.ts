export default {
  esm: {type: 'babel', mjs: true, importLibToEs: true},
  cjs: {type: 'babel', lazy: true},
  umd: {name: 'rtwc-comm'}
};
