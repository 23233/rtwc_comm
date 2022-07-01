export default {
  esm: { type: 'babel', mjs: false, importLibToEs: true },
  cjs: { type: 'babel', lazy: true },
  // umd: {
  //   name: 'rtwc-comm',
  //   globals: {
  //     react: 'React',
  //   },
  // },
};
