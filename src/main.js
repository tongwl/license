import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import axios from "axios";
import vueAxios from "vue-axios";
import _ from "lodash";

Vue.use(ElementUI);
Vue.use(vueAxios, axios);
Vue.prototype._ = _;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app");


router.beforeEach((to, from, next) => {
  if (to.matched.length === 0) {
    from.name ? next({
      name: from.name
    }) : next('/licenseList');
  } else {
    next();
  }
});
