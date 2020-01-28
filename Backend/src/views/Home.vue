<template>
  <div class="container">
    <div class="block is-size-3">
      <b>Data Visualization</b>
    </div>
    <b-tabs>
      <b-tab-item label="Total Waste Amount">
        <TotalWaste />
      </b-tab-item>

      <b-tab-item label="Waste Amount By Zipcode">
        <WasteAmount />
      </b-tab-item>

      <b-tab-item label="Buyers by Zipcode">
        Buyers
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
// @ is an alias to /src
import WasteAmount from '@/components/WasteAmount'
import TotalWaste from '@/components/TotalWaste'

export default {
  name: 'Home',
  components: {
    WasteAmount,
    TotalWaste
  }
}
</script>
