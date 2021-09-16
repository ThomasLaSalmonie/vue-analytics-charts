import VueAnalyticsCharts from './components/VueAnalyticsCharts.vue';

function install(Vue) {
  if (install.installed) return
  install.installed = true
  Vue.component('VueAnalyticsCharts', VueAnalyticsCharts)
}

const plugin = {
  install
}

let GlobalVue = null
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
  GlobalVue = global.vue
}

if (GlobalVue) {
  GlobalVue.use(plugin)
}

VueAnalyticsCharts.install = install

export default VueAnalyticsCharts;