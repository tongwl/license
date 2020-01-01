import Vue from "vue";
import VueRouter from "vue-router";
import Container from "../views/Container.vue";
import LicenseList from "../views/license/LicenseList";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Container",
    component: Container,
    children: [
      {
        path: "licenseList",
        name: "licenseList",
        component: LicenseList
      },
      {
        path: '/',
        name: '/',
        component: LicenseList
      }
    ],
  },
];

const router = new VueRouter({
  routes
});

export default router;
