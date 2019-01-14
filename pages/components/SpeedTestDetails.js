import React from 'react';

export default ({loading, speedtests, isMobile}) => {
  const display = isMobile ? {display: 'block'} : {};

  return !loading && speedtests.datasets[0].data.slice(-1) ? (
    <small style={{...display, fontWeight: 'normal', fontSize: '0.7em', marginTop: isMobile ? 10 : 0}}>
      <span style={{...display, marginLeft: 5}}>{speedtests.datasets[0].label}: {speedtests.datasets[0].data.slice(-1)[0].y} Mbps</span>
      <span style={{...display, marginLeft: 5}}>{speedtests.datasets[1].label}: {speedtests.datasets[1].data.slice(-1)[0].y} Mbps</span>
    </small>
  ) : 'Loading...';
}
