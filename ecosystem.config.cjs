module.exports = {
  apps : [{
    name: "fan-control",
    script: 'apps/dell-ipmi-fan-control/dist/index.js',
    watch: ['apps/dell-ipmi-fan-control/dist'],
    instances: 1
  }, {
    name: "power-monitor",
    script: 'apps/dell-ipmi-power-monitor/dist/index.js',
    watch: ['apps/dell-ipmi-power-monitor/dist'],
    instances: 1
  }],

 
};
