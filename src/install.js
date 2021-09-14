import VueAnalyticsCharts from './components/VueAnalyticsCharts.vue';

const VueAnalyticsChartsSimple = {
 install(Vue) {
  // Let's register our component globally
  // https://vuejs.org/v2/guide/components-registration.html
  Vue.component('vue-analytics-charts', VueAnalyticsCharts);
 }
};

// Automatic installation if Vue has been added to the global scope.
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(VueAnalyticsChartsSimple);
}

export default VueAnalyticsChartsSimple;