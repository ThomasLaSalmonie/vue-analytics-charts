<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <vue-analytics-charts title="Page views" api-url="http://127.0.0.1:3009/api/analytics"/>
  </div>
</template>

<script>
import VueAnalyticsCharts from './components/VueAnalyticsCharts.vue'

export default {
  name: 'App',
  components: {
    VueAnalyticsCharts
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
