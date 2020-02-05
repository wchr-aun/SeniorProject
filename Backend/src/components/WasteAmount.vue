<template>
  <div class="container">
    <div class="columns">
      <div class="column">
        <AutoComZipcode :title="title" :loading="loading" />
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <div class="block is-size-6">
        </div>
        <bar-chart :options="options" :height="120" :chart-data="datacollection"></bar-chart>
      </div>
    </div>
    <div class="columns" v-if="datacollection.labels != 0">
      <div class="column">
        <div class="buttons is-pulled-right">
          <b-button type="is-danger" rounded @click="clearData()">Clear Data</b-button>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
  import BarChart from './BarChart.js'
  import AutoComZipcode from './AutoComZipcode'
  import { getRandomColor, queryWastesInAnArea } from "../library"
  import { wasteAmountDC } from '../variables'

  export default {
    components: {
      BarChart,
      AutoComZipcode
    },
    data () {
      return {
        title: "Find Waste Amount by Zipcode",
        datacollection: {
          labels: [],
          datasets: []
        },
        options: {
          scales: {
            dataset: [{
              barPercentage: 1,
              categoryPercentage: 0.5
            }],
            xAxes: [{
              stacked: true
            }],
            yAxes: [{
              stacked: true
            }]
          }
        },
        loading: false
      }
    },
    methods: {
      getZipcode (zipcode) {
        if (zipcode == "00000" || zipcode == null) return alert("Please enter zipcode")
        this.loading = true
        if (wasteAmountDC[zipcode] == undefined) {
          queryWastesInAnArea(zipcode).then(wasteAmount => {
            if (Object.keys(wasteAmount).length == 0) {
              this.danger()
              this.clearData()
              this.loading = false
            }
            wasteAmountDC[zipcode] = this.fetchData(wasteAmount)
            this.fillData(wasteAmountDC[zipcode])
            this.loading = false
          })
        }
        else {
          this.fillData(wasteAmountDC[zipcode])
          this.loading = false
        }
      },
      fillData (datasets) {
        this.datacollection = JSON.parse(JSON.stringify(datasets))
      },
      fetchData (wasteAmount) {
        let labels = []
        let datasets = [{
          label: 'On Hold',
          backgroundColor: getRandomColor(),
          data: []

        }, {
          label: 'In Transactions',
          backgroundColor: getRandomColor(),
          data: []
        }]
        for (let type in wasteAmount) {
          for (let subtype in wasteAmount[type]) {
            labels.push(subtype)
            datasets[0].data.push(wasteAmount[type][subtype].onHold)
            datasets[1].data.push(wasteAmount[type][subtype].inTx)
          }
        }
        return {labels, datasets}
      },
      clearData () {
        this.datacollection = {
          labels: [],
          datasets: []
        }
      },
      danger () {
        this.$buefy.toast.open({
          duration: 3000,
          message: `No data was found!`,
          position: 'is-bottom',
          type: 'is-danger'
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