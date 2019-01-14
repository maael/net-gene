import Head from 'next/head'
import {ping as pingFormatter, speedtest as speedtestFormatter} from './chartFormaters';
import {Line} from 'react-chartjs-2';
import format from 'date-fns/format';
import {isMobile} from 'react-device-detect';

const dateFormat = 'HH:mm [on] DD/MM';

const colourMap = {
  'Google DNS': '#009688',
  Google: '#dd4b39',
  Facebook: '#3b5998'
}

export default class IndexPage extends React.Component {
  state = {
    loading: true,
    pings: [],
    speedtests: []
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    Promise.all([
      fetch('/api/ping').then((res) => res.json()),
      fetch('/api/speedtest').then((res) => res.json())
    ]).then(([pings, speedtests]) => {
      this.setState({
        pings: pingFormatter(pings),
        speedtests: speedtestFormatter(speedtests),
        loading: false
      })
    });
    setTimeout(this.getData, 60 * 1000);
  }

  render () {
    const {loading} = this.state;
    const timeOptions = {
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            unit: 'minute',
            tooltipFormat: 'HH:mm [on] DD/MM/YYYY'
          },
          ticks: {
            fontColor: '#ffffff',
            display: !isMobile,
            callback: (a, b, c) => {
              return c[b] ? format(new Date(c[b].value), dateFormat) : a;
            }
          },
        }],
        yAxes: [{
          ticks: {
            fontColor: '#ffffff'
          },
        }]
      },
      legend: {
        labels: {
          fontColor: '#ffffff'
        }
      }
    };

    const MbpsLabelOptions = {
      tooltips: {
        callbacks: {
            label: (tooltipItem, data) => {
              let label = data.datasets[tooltipItem.datasetIndex].label || '';
              if (label) {
                label += ': ';
              }
              label += `${tooltipItem.yLabel} Mbps`
              return ` ${label}`;
            }
        }
      }
    };

    const MsLabelOptions = {
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            let label = data.datasets[tooltipItem.datasetIndex].label || '';
            if (label) {
              label += ': ';
            }
            label += `${tooltipItem.yLabel} ms`
            return ` ${label}`;
          }
        }
      }
    };

    const display = isMobile ? {display: 'block'} : {};

    return (
      <div>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
          <title>Network Monitor</title>
          <meta name="theme-color" content="#663399" />
        </Head>
        <style jsx global>{`
          * {
            padding: 0;
            margin: 0;
          }
          body {
            font-family: sans-serif;
          }
        `}</style>
        <div style={{padding: 20, background: '#ffffff'}}>
          <h2>Speed Tests
          {
            !loading && this.state.speedtests.datasets[0].data.slice(-1) ? (
              <small style={{...display, fontWeight: 'normal', fontSize: '0.75em', marginTop: isMobile ? 10 : 0}}>
                <span style={{...display, marginLeft: 5}}>{this.state.speedtests.datasets[0].label}: {this.state.speedtests.datasets[0].data.slice(-1)[0].y} Mbps</span>
                <span style={{...display, marginLeft: 5}}>{this.state.speedtests.datasets[1].label}: {this.state.speedtests.datasets[1].data.slice(-1)[0].y} Mbps</span>
              </small>
            ) : 'Loading...'
          }
          </h2>
        </div>
        {loading ? 'Loading' : (
          <div style={{background: '#663399', padding: 20, color: '#ffffff'}}>
            <p><small>Last updated: {this.state.speedtests.datasets[0].data.slice(-1) && format(this.state.speedtests.datasets[0].data.slice(-1)[0].x, dateFormat)}</small></p>
            <Line data={this.state.speedtests} options={{...timeOptions, ...MbpsLabelOptions}} height={isMobile ? undefined : 75} />
            </div>
        )}
        <div style={{padding: 20, background: '#ffffff'}}>
          <h2>Ping Tests</h2>
        </div>
        {loading ? 'Loading' : this.state.pings.map(({label, data}) => (
          <div key={label} style={{padding: 20, background: colourMap[label], color: '#ffffff'}}>
          <h4>{label}</h4>
            <p><small>Last updated: {data.datasets[0].data.slice(-1) && format(data.datasets[0].data.slice(-1)[0].x, dateFormat)}</small></p>
            <Line data={data} options={{...timeOptions, ...MsLabelOptions}} height={isMobile ? undefined : 75} />
          </div>
        ))}
      </div>
    )
  }
}
