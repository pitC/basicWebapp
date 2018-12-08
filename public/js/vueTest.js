import TestComp from "./app/components/testComp.js";

Vue.component("test-comp", TestComp);

var app = new Vue({
  el: "#app",
  data: {
    message: "Hello Vue.js!"
  }
});
