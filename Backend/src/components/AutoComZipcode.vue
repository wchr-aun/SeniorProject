<template>
  <div>
    <b-field label="Find Waste Amount by Zipcode" style="width:50%;margin: auto;">
      <b-autocomplete
        rounded
        v-model="name"
        :data="filteredDataArray"
        placeholder="e.g. 10100"
        icon="magnify"
        maxlength=5
        @select="option => selected = option">
        <template slot="empty">No results found</template>
      </b-autocomplete>
    </b-field>
    <div class="buttons is-pulled-right" style="width:35%;margin: auto;">
      <b-button :loading="loading" rounded @click="queryData(selected)">Search: {{ selected }}</b-button>
    </div>
  </div>
</template>

<script>
import { zipcode } from '../variables'
import { queryWastesInAnArea } from "../library"
import { wasteAmount } from "../variables"
export default {
  data () {
    return {
      data: zipcode,
      name: '',
      selected: "00000",
      loading: false
    }
  },
  computed: {
    filteredDataArray() {
      return this.data.filter((option) => {
        return option
          .toString()
          .toLowerCase()
          .indexOf(this.name.toLowerCase()) >= 0
      })
    }
  },
  methods: {
    queryData(zipcode) {
      if (zipcode == "00000") return alert("Please search for zipcode")
      this.loading = true
      if (wasteAmount[zipcode] == undefined)
        queryWastesInAnArea(zipcode).then(() => {
          this.loading = false
          this.$parent.fillData(zipcode)
        })
      else {
        this.loading = false
        this.$parent.fillData(zipcode)
      }
    }
  }
}
</script>