const colourMap = {
  'Facebook': {
    min: '#983b59',
    max: '#59983b',
    avg: '#ffffff'
  },
  'Google': {
    min: '#4b39dd',
    max: '#39dd4b',
    avg: '#ffffff'
  },
  'Google DNS': {
    min: '#880096',
    max: '#968800',
    avg: '#ffffff'
  },
}

export function ping (json) {
  return Object.entries(json).map(([name, data]) => (
    {
      label: name,
      data: {
        datasets: [
          {
            label: `${name} min`,
            data: data.map(({ts, min}) => ({y: Number(min), x: ts})),
            borderColor: colourMap[name].min,
            lineTension: 0,
            fill: false,
            hidden: true
          },
          {
            label: `${name} max`,
            data: data.map(({ts, max}) => ({y: Number(max), x: ts})),
            borderColor: colourMap[name].max,
            lineTension: 0,
            fill: false,
            hidden: true
          },
          {
            label: `${name} avg`,
            data: data.map(({ts, avg}) => ({y: Number(avg), x: ts})),
            borderColor: colourMap[name].avg,
            lineTension: 0,
            fill: false
          }
        ]
      }
    }
  ))
}

export function speedtest(json) {
  const dataSets = json
    .reduce((pre, {ts, download, upload}) => (
      {
        download: pre.download.concat([{x: ts, y: download}]),
        upload: pre.upload.concat({x: ts, y: upload})
      }),
      { download: [], upload: [] }
    )
  return ({
    datasets: [
      {
        label: 'Upload',
        data: dataSets.upload,
        borderColor: '#339933',
        lineTension: 0,
        fill: false
      },
      {
        label: 'Download',
        data: dataSets.download,
        lineTension: 0,
        borderColor: '#999933',
        fill: false
      }
    ]
  })
}
