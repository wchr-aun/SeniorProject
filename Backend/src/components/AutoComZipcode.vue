<template>
  <div class="small">
    <b-field label="Find Waste Amount by Zipcode">
      <b-autocomplete
        rounded
        v-model="name"
        :data="filteredDataArray"
        placeholder="e.g. jQuery"
        icon="magnify"
        maxlength=5
        size=5
        @select="option => selected = option">
        <template slot="empty">No results found</template>
      </b-autocomplete>
    </b-field>
    <div class="buttons is-pulled-right">
      <b-button :loading="loading" rounded @click="queryData(selected)">Search: {{ selected }}</b-button>
    </div>
  </div>
</template>

<script>
import { zipcode } from '../variables'
import { queryWastesInAnArea } from "../library"
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
      queryWastesInAnArea(zipcode).then(() => {
        this.loading = false
        this.$parent.fillData(zipcode)
      })
    }
  }
}
</script>