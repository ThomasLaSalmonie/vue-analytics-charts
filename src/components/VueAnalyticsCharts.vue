<template>
  <div>
    <h2>
        {{ title }}
    </h2>
    <div>
        <date-picker v-model="date" range format="YYYY-MM-DD" value-type="YYYY-MM-DD" />
    </div>
    <div>
      <apexchart
        v-if="show"
        :options="chartOptions"
        :series="series"
      />
    </div>
  </div>
</template>

<script>
import DatePicker from 'vue2-datepicker';
import VueApexCharts from 'vue-apexcharts';
import moment from 'moment';
import axios from 'axios';
import 'vue2-datepicker/index.css';

export default {
  components: {
    DatePicker,
    'apexchart': VueApexCharts,
  },
  props: {
    title: {
      type: String,
      required: false,
      default: null,
    },
    apiUrl: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      default: () => {},
    },
    options: {
      type: Object,
      required: false,
      default: () => { return { chart: { type: 'area' } }; },
    },
    analyticsOptions: {
      type: Object,
      required: false,
      default: () => { return {}; },
    },
  },
  data () {
    return {
      show: false,
      categories: [],
      series: [],
      date: [moment().subtract(7, 'days').format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")],
    };
  },
  computed: {
    chartOptions () {
      const chartOptions = { ...this.options, ...{xaxis: { categories: this.categories }}};
      return chartOptions;
    },
    startDate () {
        return moment(this.date[0]).format("YYYY-MM-DD");
    },
    endDate () {
        return moment(this.date[1]).format("YYYY-MM-DD");
    },
  },
  watch: {
    startDate () {
      this.analyticsReport();
    },
    endDate () {
      this.analyticsReport();
    },
  },
  async mounted () {
    await this.analyticsReport();
    setTimeout(() => {
      this.show = true;
    }, 300);
  },
  methods: {
    buildPostReport () {
      const defaultDimensions = [{ name: "ga:date"}];
      const defaultMetrics = [{ expression: 'ga:pageviews' }];
      let filters = [];
      if (this.analyticsOptions.filters) {
        filters = typeof this.analyticsOptions.filters === 'function' ? this.analyticsOptions.filters(this) : this.analyticsOptions.filters;
      }
      const result = {
        dateRanges:[ { startDate: this.startDate, endDate: this.endDate}],
        dimensions: this.analyticsOptions.dimensions ? this.analyticsOptions.dimensions : defaultDimensions,
        dimensionFilterClauses: [{ filters }],
        metrics: this.analyticsOptions.metrics ? this.analyticsOptions.metrics : defaultMetrics,
      };
      return [result];
    },
    getArrayDate () {
      const result = [];
      for(let dt = moment(this.startDate); dt <= moment(this.endDate); dt.add(1, 'd')){
        result.push(moment(dt).format("YYYY-MM-DD"));
      }
      return result;
    },
    async analyticsReport () {
      try {
        const postData = this.buildPostReport();
        const reports = (await axios.post(this.apiUrl, postData)).data.data;
        const arrayDates = this.getArrayDate();
        this.series = [];
        if (reports) {
          for (const report of reports) {
            const dataviews = [];
            for (const date of arrayDates) {
              const views = report.data.rows.find(row => row.dimensions ? row.dimensions.find(data => data === date.replaceAll('-', '')) !== undefined : false);
              dataviews.push(views ? views.metrics[0].values[0] : 0);
            }
            this.series.push({ data: dataviews });
          }
        }
        this.categories = arrayDates;
      } catch (e) {
        console.error(e);
      }
    }
  }
};
</script>
