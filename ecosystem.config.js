module.exports = {
  apps : [{
    name: "fan-control",
    script: 'apps/dell-ipmi-fan-control/dist/index.js',
    watch: '.'
  }, {
    name: "power-monitor",
    script: 'apps/dell-ipmi-power-monitor/dist/index.js',
    watch: '.'
  },{
    name: "spotify-playlist",
    script: 'apps/spotify-playlist/dist/index.js',
    watch: '.'
  }],

 
};
