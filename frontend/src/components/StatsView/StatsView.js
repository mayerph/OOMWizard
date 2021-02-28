import React from 'react'
import { connect } from 'react-redux'
import ReactApexChart from 'react-apexcharts'

import {
  Divider,
  CardContent,
  Box,
  Card,
  Typography,
  Button,
} from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'
import RefreshIcon from '@material-ui/icons/Refresh'

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
    this.load_data()
  }

  load_data() {
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
          },
        })
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
      let ratings = this.state.data.stats.rating.map((e) => {
        return { x: e.timestamp, y: e.rating }
      })
      let nr_comments = this.state.data.stats.nr_comments.map((e) => {
        return { x: e.timestamp, y: e.comments }
      })
      return (
        <>
          {/** refesh button */}
          <Box component="span" m={1} onClick={() => this.load_data()}>
            <Button >
              <RefreshIcon fontSize="small" />
            </Button>
          </Box>

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
            <Divider />
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
            <Divider />
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
        </>
      )
    }
  }
}
export default StatsView
