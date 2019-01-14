const probes = {
  ping: require('./probes/ping'),
  speedtest: require('./probes/speedtest')
};

function executeProbes() {
  return Promise.all(Object.entries(probes).map(([_, fn]) => (
    fn()
  )));
}

function schedule() {
  try {
    executeProbes().then(() => {
      setTimeout(schedule, 1000 * 60 * 5);
    })
  } catch (e) {
    setTimeout(schedule, 1000 * 60 * 5);
  }
}

schedule()
