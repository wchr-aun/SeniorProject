<template>
  <div class="container">
    <b-tabs>
      <b-tab-item label="Total Waste Amount">
        <TotalWaste />
      </b-tab-item>
      <b-tab-item label="Waste Amount By Zipcode">
        <WasteAmount />
      </b-tab-item>

      <b-tab-item label="Buyers by Zipcode">
        <GoogleMap />
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
// @ is an alias to /src
import WasteAmount from '@/components/WasteAmount'
import TotalWaste from '@/components/TotalWaste'
import GoogleMap from '@/components/GoogleMap'

export default {
  name: 'Home',
  components: {
    WasteAmount,
    TotalWaste,
    GoogleMap
  }
}
</script>
