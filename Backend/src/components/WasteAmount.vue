<template>
  <div class="container">
    <AutoComZipcode/>
    <br>
    <line-chart :options="options" :height="150" :chart-data="datacollection"></line-chart>
  </div>
  
</template>

<script>
  import LineChart from './LineChart.js'
  import AutoComZipcode from './AutoComZipcode'
  import { queryWastesInAnArea } from "../library"
  import { wasteAmount } from "../variables"

  export default {
    components: {
      LineChart,
      AutoComZipcode
    },
    data () {
      return {
        datacollection: {},
        options: {
          legend: {
            display: false,
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                min: 0
              }    
            }]
          }
        }
      }
    },
    methods: {
      fillData (zipcode) {
        let labels = []
        let data = []
        let backgroundColor = []
        for (let type in wasteAmount[zipcode]) {
          for (let subtype in wasteAmount[zipcode][type]) {
            labels.push(subtype)
            backgroundColor.push(this.getRandomColor())
            data.push(wasteAmount[zipcode][type][subtype])
          }
        }
        this.datacollection = {
          labels,
          datasets: [{
            backgroundColor,
            data
          }]
        }
      },
      getRandomColor () {
        var letters = '0123456789ABC';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 12)];
        }
        return color;
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