<template>
  <div class="container">
    <div class="columns">
      <div class="column">
        <AutoComZipcode :title="title" :loading="loading" />
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <GmapMap
          :center="center"
          :zoom="zoom"
          style="width:100%;  height: 400px;"
        >
          <GmapMarker
            :key="index"
            v-for="(m, index) in markers"
            :position="m.position"
            :draggable="false"
            @click="center=m.position"
          ></GmapMarker>
        </GmapMap>
      </div>
    </div>
    <div class="columns" v-if="markers.length != 0">
      <div class="column">
        <div class="buttons is-pulled-right">
          <b-button type="is-danger" rounded @click="clearData()">Clear Data</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import AutoComZipcode from './AutoComZipcode'
  import { queryBuyerInAnArea } from '../library'
  import { geopoint } from '../variables'
  export default {
    components: {
      AutoComZipcode
    },
    name: "GoogleMap",
    data() {
      return {
        center: { lat: 15.8700, lng: 100.9925 },
        markers: [],
        title: "Buyers in Each Zipcode",
        loading: false,
        zoom: 5
      };
    },
    methods: {
      getZipcode (zipcode) {
        this.loading = true
        queryBuyerInAnArea(zipcode).then(_markers => {
          if (_markers.length == 0) {
            this.danger()
            this.clearData()
            this.loading = false
            return
          }
          this.markers = _markers
          this.center = geopoint[zipcode]
          this.loading = false
          this.zoom = 13
        })
      },
      clearData () {
        this.markers = []
        this.zoom = 5
        this.center = { lat: 15.8700, lng: 100.9925 }
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