<template>
  <div class="">
    <AutoComZipcode/>
    <br>
    <div class="small">
      <line-chart :chart-data="datacollection"></line-chart>
    </div>
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
        datacollection: {}
      }
    },
    methods: {
      fillData (zipcode) {
        console.log(wasteAmount)
        this.datacollection = {
          labels: ["What", "The fuck"],
          datasets: [
            {
              label: 'Data One',
              backgroundColor: '#f87979',
              data: [wasteAmount[zipcode].PETE, wasteAmount[zipcode].battery]
            }
          ]
        }
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