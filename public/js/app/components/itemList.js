import dataSync from "../dataSync.js"
import ItemDetails from "./itemDetails.js";

Vue.component('item-details',ItemDetails);

const DEFAULT_ACTIVE_ITEM = {_id:null,title:"",attributes:[]}

export default {
  data: function() {
    return {
      items: [],
      activeItem: DEFAULT_ACTIVE_ITEM
    };
  },
  mounted() {
    console.log("mounted!");
    console.log(this.items);

    var self = this;

    dataSync.getAllItems(function(response){
      self.items = response.data;
    });
    
    dataSync.registerPushEventHandler(dataSync.events.ITEM_REMOVED_EV, function(msg){
      var index = self.items.findIndex(x => x._id==msg._id)
      self.$delete(self.items, index);
    });

    dataSync.registerPushEventHandler(dataSync.events.ITEM_CREATED_EV,function(msg){
      console.log(msg)
      self.items.push(msg);
    });

    dataSync.registerPushEventHandler(dataSync.events.ITEM_UPDATED_EV,function(msg){
      console.log("Item updated!");
      var index = self.items.findIndex(x => x._id==msg._id)
      self.$set(self.items, index, msg)
    });
  },
  methods: {
    onDelete: function(index) {
      var item = this.items[index];
      var self = this;
      dataSync.removeItem(item,function(response){
        self.$delete(self.items, index);
        Object.assign(self.activeItem, DEFAULT_ACTIVE_ITEM)
      }
      );
    },

    onEdit: function(index){
      this.activeItem = this.items[index]; 
    },
    onItemChange:function(item){
      var index = this.items.findIndex(x => x._id==item._id)
      console.log("item change!")
      console.log(item)
      this.$set(this.items, index, item)
    }
  },
  template: `
    <div>
    <h1>Item List External</h1>
    <table class="table table-hover table-dark">
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Delete</th>
                <th scope="col">Edit</th>
            </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in items">
            <td>{{index}}</td>
            <td>
              <router-link :to="{name:'itemDetails',params:{id:item._id}}">{{item.title}}</router-link>
            </td>
            <td>
                <button type="button" class="btn btn-outline-danger btn-lg" v-on:click="onDelete(index)">
                    <span class="glyphicon glyphicon-remove-circle"></span>
                </button>
            </td>
            <td>
                <button type="button" class="btn btn-outline-success btn-lg" v-on:click="onEdit(index)">
                    <span class="glyphicon glyphicon glyphicon-pencil"></span>
                </button>
            </td>
        </tr>
        </tbody>
        
    </table>
    <item-details :itemDetails="activeItem"></item-details>
    </div>
    `
};
