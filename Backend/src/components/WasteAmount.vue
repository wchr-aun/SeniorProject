<template>
  <line-chart :chartdata="chartData" :options="chartOptions"/>
</template>

<script>
import vuechartjs from 'vue-chartjs'
import chart from 'chart.js'
import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  props: {
    chartdata: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    }
  },
  mounted () {
    this.renderChart(this.chartdata, this.options)
  }
}
</script>