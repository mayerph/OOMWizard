import React from 'react'
import { connect } from 'react-redux'
import ReactApexChart from 'react-apexcharts'
import Divider from '@material-ui/core/Divider'
import Skeleton from '@material-ui/lab/Skeleton'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

import * as config from '../../config.json'
const backend_uri = `${config.backend.protocol}://${config.backend.server}:${config.backend.port}`


let chart_base_options = {
  chart: {
    height: 350,
    type: 'line',
    zoom: {
      enabled: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'straight',
  },
  grid: {
    row: {
      colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
      opacity: 0.5,
    },
  },
  xaxis: {
    type: 'datetime',
  },
}

class StatsView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: undefined,
    }
  }

  identifier() {
    return this.props.identifier ? this.props.identifier : 'overall'
  }

  componentDidMount() {
    fetch(
      `${backend_uri}/meta/stats?` +
        new URLSearchParams({
          identifier: this.identifier(),
        }),
      {
        method: 'GET',
      },
    ).then(async (res) => {
      if (res.ok) {
        let result = await res.json()
        this.setState({
          data: {
            meta: result.meta_info,
            stats: result.timeline,
          }
        })
      } else {
        console.log(
          `Response to fetch stats failed with ${res.status}:${res.statusText}.`,
        )
      }
    })
  }

  render() {
    // load data if now present //TODO maybe some timer check?
    if (!this.state.data) {
      return (
        <Card>
          <Typography>Loading stats...</Typography>
          <Skeleton animation="wave" />
        </Card>
      )
    } else {
      let views = this.state.data.stats.views.map((e) => {
        return { x: e.timestamp, y: e.views }
      })
      let generated_memes = this.state.data.stats.generated_memes.map((e) => {
        return { x: e.timestamp, y: e.generated_memes }
      })
      let ratings = this.state.data.stats.rating.map((e) => {
        return { x: e.timestamp, y: e.rating }
      })
      let nr_comments = this.state.data.stats.nr_comments.map((e) => {
        return { x: e.timestamp, y: e.nr_comments }
      })
      return (
        <>
          <Card>
            <ReactApexChart
              type="line"
              height={200}
              options={{
                ...chart_base_options,
                title: { text: 'Avg rating over time', align: 'left' },
              }}
              series={[
                {
                  name: 'rating',
                  data: ratings,
                },
              ]}
            />
          </Card>
          <Card>
            <ReactApexChart
              type="line"
              height={200}
              options={{
                ...chart_base_options,
                title: { text: 'Views over time', align: 'left' },
              }}
              series={[
                {
                  name: 'views',
                  data: views,
                },
              ]}
            />
          </Card>
          <Card>
            <ReactApexChart
              type="line"
              height={200}
              options={{
                ...chart_base_options,
                title: { text: 'Comments over time', align: 'left' },
              }}
              series={[
                {
                  name: 'comments',
                  data: nr_comments,
                },
              ]}
            />
          </Card>
          <Card>
            <ReactApexChart
              type="line"
              height={200}
              options={{
                ...chart_base_options,
                title: { text: 'Generated memes over time', align: 'left' },
              }}
              series={[
                {
                  name: 'generated_memes',
                  data: generated_memes,
                },
              ]}
            />
          </Card>
        </>
      )
    }
  }
}
export default StatsView
