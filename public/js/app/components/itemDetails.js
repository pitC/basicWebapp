import dataSync from "../dataSync.js";

export default {
  data: function() {
    return {
      title: "<new title>",
      attributes: [{ name: null, value: null }],
      _id: null,
      saved: false
    };
  },
  methods: {
    onRemove: function(index) {
      this.$delete(this.attributes, index);
    },
    onAdd: function() {
      this.attributes.push({ name: null, value: null });
    },
    onSubmit: function() {
      console.log("submit!");
      var payload = {
        title: this.title,
        attributes: this.attributes
      };
      if (this._id == null) {
        var self = this;
        dataSync.createItem(payload, function(response) {
          self._id = response.data._id;
          self.saved = true;
        });
      } else {
        var self = this;
        payload._id = self._id;
        dataSync.updateItem(payload, function(response) {
          self.saved = true;
        });
      }
    }
  },
  mounted() {
    var id = this.$route.params.id;
    var self = this;
    if (id != null) {
      dataSync.getItem(id,function(response){
        self._id = response.data._id;
        self.title = response.data.title;
        self.attributes = response.data.attributes;
      })
    }
    dataSync.registerPushEventHandler(dataSync.events.ITEM_CREATED_EV, function(msg){
      // if persistence is on, the server will assign final ID and send it back to the creator
      self._id = msg._id
    })
    dataSync.registerPushEventHandler(dataSync.events.ITEM_UPDATED_EV, function(msg){
      self._id = msg._id
      self.title = msg.title
      self.attributes = msg.attributes
    })
  },
  watch: {
    $route(to, from) {
      // reset data when changing route to an empty one
      if (typeof to.param === "undefined") {
        this.title = null;
        this._id = null;
        this.attributes = [];
      }
    }
  },
  template: `
    <keep-alive>
        <div>
            <h1>Item details</h1>
            <div class="input-group">
                <input class="form-control" type="text" placeholder="Item title" v-model="title">
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="button" v-on:click="onAdd(index)">Add attribute</button>
                </div>
            </div>
            <div v-for="(attribute, index) in attributes" class="input-group">
                <input type="text" aria-label="First name" class="form-control" placeholder="Attribute name" v-model="attribute.name">
                <input type="text" aria-label="Last name" class="form-control" placeholder="Attribute value" v-model="attribute.value">
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="button" v-on:click="onRemove(index)">Remove</button>
                </div>
            </div>
            <br>
            <input class="btn btn-primary" type="submit" value="Submit" v-on:click="onSubmit()">
        </div>
    </keep-alive>
    `
};
