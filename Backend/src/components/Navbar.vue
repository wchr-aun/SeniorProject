<template>
  <b-navbar class="is-light">
    <template slot="brand">
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        Waste Separation Using Image Processing and Trading System to Solve Environmental Problems Occurring from Waste Pollution
      </b-navbar-item>
    </template>
    <template slot="start">
      <b-navbar-item href="/annotate">
        Annotate
      </b-navbar-item>
      <b-navbar-item href="/uploadImage">
        Upload
      </b-navbar-item>
    </template>

    <template slot="end">
        <b-navbar-item tag="div">
          <div class="buttons">
            <a class="button is-twitter" href="/about">
              <strong>About</strong>
            </a>
          </div>
        </b-navbar-item>
    </template>
  </b-navbar>
</template>