module.exports = {
  apps : [{
    name: "fan-control",
    script: 'apps/dell-ipmi-fan-control/dist/index.js',
    instances: 1,
    exec_mode: 'fork'
  }, {
    name: "power-monitor",
    script: 'apps/dell-ipmi-power-monitor/dist/index.js',
    instances: 1,
    exec_mode: 'fork'
  }],

 
};
