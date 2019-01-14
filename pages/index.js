import Head from 'next/head'
import {Line} from 'react-chartjs-2';
import format from 'date-fns/format';
import startOfToday from 'date-fns/start_of_today';
import isAfter from 'date-fns/is_after';
import {isMobile} from 'react-device-detect';
import {ping as pingFormatter, speedtest as speedtestFormatter} from './chartFormaters';
import SpeedTestDetails from './components/SpeedTestDetails';
import Button from './components/Button';
import theme from './theme';

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
    speedtests: [],
    pingRange: {
      from: undefined,
      to: undefined
    },
    speedtestRange: {
      from: undefined,
      to: undefined
    },
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

  applyRange(range, data) {
    const clone = JSON.parse(JSON.stringify(data));
    if (!range.from) return clone;

    return {...clone, datasets: clone.datasets.map((ds) => {
      return ({
        ...ds,
        data: ds.data.filter(({x}) => isAfter(x, range.from))
      });
    })};
  }

  render () {
    const {loading, pingRange, speedtestRange} = this.state;

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
        <div style={{padding: theme.padding, background: theme.colors.block.default, position: 'relative'}}>
          <h2>Speed Tests
            <SpeedTestDetails loading={loading} speedtests={this.state.speedtests} isMobile={isMobile} />
            <Button
              color='#663399'
              hoverColor='rgba(102,51,153, 0.8)'
              onClick={() => {
                this.setState({
                  speedtestRange: {from: speedtestRange.from ? undefined : startOfToday()}
                })
              }}
              active={speedtestRange.from}
            >
              {speedtestRange.from ? 'All time' : 'Today'}
            </Button>
          </h2>
        </div>
        {loading ? 'Loading' : (
          <div style={{background: '#663399', padding: 20, color: '#ffffff'}}>
            <p><small>Last updated: {this.state.speedtests.datasets[0].data.slice(-1) && format(this.state.speedtests.datasets[0].data.slice(-1)[0].x, dateFormat)}</small></p>
            <Line data={this.applyRange(speedtestRange, this.state.speedtests)} options={{...timeOptions, ...MbpsLabelOptions}} height={isMobile ? undefined : 75} />
          </div>
        )}
        <div style={{padding: theme.padding, background: theme.colors.block.default, position: 'relative'}}>
          <h2>Ping Tests
            <Button
              color={colourMap['Google DNS']}
              hoverColor='rgba(0,150,136, 0.8)'
              onClick={() => {
                this.setState({
                  pingRange: {from: pingRange.from ? undefined : startOfToday()}
                })
              }}
              active={pingRange.from}
            >
              {pingRange.from ? 'All time' : 'Today'}
            </Button>
          </h2>
        </div>
        {loading ? 'Loading' : this.state.pings.map(({label, data}) => (
          <div key={label} style={{padding: 20, background: colourMap[label], color: '#ffffff'}}>
          <h4>{label}</h4>
            <p><small>Last updated: {data.datasets[0].data.slice(-1) && format(data.datasets[0].data.slice(-1)[0].x, dateFormat)}</small></p>
            <Line data={this.applyRange(pingRange, data)} options={{...timeOptions, ...MsLabelOptions}} height={isMobile ? undefined : 75} />
          </div>
        ))}
      </div>
    )
  }
}
