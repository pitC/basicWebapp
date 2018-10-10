import dataSync from "../dataSync.js"

var socket = io();

export default {
  data: function() {
    return {
      items: []
    };
  },
  mounted() {
    // TODO: create initial sync
    axios.get("/objects").then(response => {
      this.items = response.data;
    });

    var self = this;
    dataSync.registerPushEventHandler(dataSync.events.ITEM_REMOVED_EV, function(msg){
      var index = self.items.findIndex(x => x._id==msg._id)
      self.$delete(self.items, index);
    });

    dataSync.registerPushEventHandler(dataSync.events.ITEM_CREATED_EV,function(msg){
      self.items.push(msg);
    });

    dataSync.registerPushEventHandler(dataSync.events.ITEM_UPDATED_EV,function(msg){
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
      }
      );
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
            </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in items">
            <td>{{index}}</td>
            <td>
              <a :href="'#/'+item._id">{{item.title}}</a>
            </td>
            <td>
                <button type="button" class="btn btn-outline-danger btn-lg" v-on:click="onDelete(index)">
                    <span class="glyphicon glyphicon-remove-circle"></span>
                </button>
            </td>
        </tr>
        </tbody>
    </table>
    </div>
    `
};
