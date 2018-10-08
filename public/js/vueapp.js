import ItemList from "./app/components/itemList.js"
import ItemDetails from "./app/components/itemDetails.js"


const routes = [
     {path:'/', component:ItemList},
     {path:'/Edit',component:ItemDetails}
]

const router = new VueRouter({
    routes // short for `routes: routes`
  })

  const app = new Vue({
    router
  }).$mount('app')
