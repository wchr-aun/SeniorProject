<template>
  <div>
    <b-field :label="title" style="width:50%;margin: auto;">
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
            <b-button :loading="loading" rounded @click="returnZipcode(selected)">Search: {{ selected }}</b-button>
          </div>
        </div>
      </div>
    </b-field>
  </div>
</template>

<script>
import { zipcode } from '../variables'
export default {
  data () {
    return {
      data: zipcode,
      name: '',
      selected: "00000",
    }
  },
  props: ['loading', 'title'],
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
    returnZipcode (zipcode) {
      this.$parent.getZipcode(zipcode)
    }
  }
}
</script>