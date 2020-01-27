<template>
  <div>
    <b-field label="Find Waste Amount by Zipcode" style="width:50%;margin: auto;">
      <div class="columns">
        <div class="column is-four-fifths">
          <b-autocomplete
            rounded
            v-model="name"
            :data="filteredDataArray"
            placeholder="e.g. 10140"
            icon="magnify"
            maxlength=5
            @select="option => selected = option">
            <template slot="empty">No results found</template>
          </b-autocomplete>
        </div>
        <div class="column">
          <div class="buttons">
            <b-button :loading="loading" rounded @click="queryData(selected)">Search: {{ selected }}</b-button>
          </div>
        </div>
      </div>
    </b-field>
  </div>
</template>

<script>
import { zipcode, wasteAmountDC } from '../variables'
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
      if (zipcode == "00000" || zipcode == null) return alert("Please enter zipcode")
      this.loading = true
      if (wasteAmountDC[zipcode] == undefined) {
        queryWastesInAnArea(zipcode).then(wasteAmount => {
          if (Object.keys(wasteAmount).length == 0) {
            this.danger()
            this.loading = false
            return
          }
          wasteAmountDC[zipcode] = this.$parent.fetchData(wasteAmount)
          this.loading = false
          this.$parent.fillData(wasteAmountDC[zipcode])
        })
      }
      else {
        this.loading = false
        this.$parent.fillData(wasteAmountDC[zipcode])
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