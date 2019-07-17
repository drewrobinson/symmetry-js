module.exports = api => {
  const isTest = api.env('test');//can be used as condition for modifying presets for tests
  let _presets;

  if(isTest){
    _presets = [
      [
        '@babel/preset-env',
        {
          targets: {
            node: 'current',
          },
        },
      ],
    ];
  }else{
    _presets = [];
  }


  return {
    presets: _presets
  };
};