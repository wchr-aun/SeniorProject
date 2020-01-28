<template>
  <div class="container">
    <div class="block is-size-5">
      <b>Total Waste in Our System</b>
    </div>
    <div class="columns">
      <div class="column">
        <div class="block is-size-6">
          <b>Including On-Hold Items</b>
        </div>
        <pie-chart :height="300" :chart-data="datacollection[0]"></pie-chart>
      </div>
      <div class="column">
        <div class="block is-size-6">
          <b>Only Items on Completed Transactions</b>
        </div>
        <pie-chart ref="charts" :height="300" :chart-data="datacollection[1]"></pie-chart>
      </div>
    </div>
    
  </div>
  
</template>

<script>
  import PieChart from './PieChart.js'
  import { queryTotalWastes, getRandomColor } from "../library"
  import { totalWastesInTx, totalWastesInSystem } from "../variables"

  export default {
    components: {
      PieChart
    },
    data () {
      return {
        datacollection: []
      }
    },
    mounted () {
      const loadingComponent = this.$buefy.loading.open({
        container: this.$refs.charts.$el
      })
      if (Object.keys(totalWastesInSystem).length == 0 && Object.keys(totalWastesInTx).length == 0) {
        queryTotalWastes().then(() => {
          loadingComponent.close()
          this.fillData(totalWastesInSystem)
          this.fillData(totalWastesInTx)
        })
      }
    },
    methods: {
      fillData (dataset) {
        let labels = []
        let data = []
        let backgroundColor = []
        for (let type in dataset) {
          for (let subtype in dataset[type]) {
            labels.push(subtype)
            backgroundColor.push(getRandomColor())
            data.push(dataset[type][subtype])
          }
        }
        this.datacollection.push({
          labels,
          datasets: [
            {
              backgroundColor,
              data
            }
          ]
        })
      }
    }
  }
</script>

<style>
  .small {
    max-width: 600px;
    margin:  50px auto;
  }
</style>