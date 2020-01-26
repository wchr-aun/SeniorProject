<template>
  <div class="container">
    <div class="block is-size-3">
      <b>Data Visualization</b>
    </div>
    <b-tabs>
      <b-tab-item label="Waste Amount">
        <WasteAmount />
      </b-tab-item>

      <b-tab-item label="Buyers">
        Buyers
      </b-tab-item>

      <b-tab-item label="Waste in Total">
        Waste in Total
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
// @ is an alias to /src
import WasteAmount from '@/components/WasteAmount'

export default {
  name: 'Home',
  components: {
    WasteAmount
  }
}
</script>
