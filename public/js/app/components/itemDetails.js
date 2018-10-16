import dataSync from "../dataSync.js";


export default {
  data: function() {
    return {
      saved: true
    };
  },

  props:{
    itemDetails:{
      type : Object,
      default: function() {
        return {_id:null,title:"",attributes:[]}
      }
    } 
  },
  methods: {
    onRemove: function(index) {
      this.$delete(this.itemDetails.attributes, index);
    },
    onAdd: function() {
      this.itemDetails.attributes.push({ name: null, value: null });
    },
    onSubmit: function() {
      console.log("submit!");
      var payload = {
        title: this.itemDetails.title,
        attributes: this.itemDetails.attributes
      };
      if (this.itemDetails._id == null) {
        var self = this;
        dataSync.createItem(payload, function(response) {
          self.itemDetails._id = response.data._id;
          self.saved = true;
        });
      } else {
        var self = this;
        payload._id = self.itemDetails._id;
        dataSync.updateItem(payload, function(response) {
          self.saved = true;
        });
      }
    },
    onItemChange: function(){
      this.saved = false;
    }
  },
  mounted() {
    var id = this.$route.params.id;
    var self = this;
    if (id != null) {
      dataSync.getItem(id,function(response){
        self.itemDetails._id = response.data._id;
        self.itemDetails.title = response.data.title;
        self.itemDetails.attributes = response.data.attributes;
      })
    }
    dataSync.registerPushEventHandler(dataSync.events.ITEM_CREATED_EV, function(msg){
      // if persistence is on, the server will assign final ID and send it back to the creator
      self.itemDetails._id = msg._id
    })
    dataSync.registerPushEventHandler(dataSync.events.ITEM_UPDATED_EV, function(msg){
      self.itemDetails._id = msg._id
      self.itemDetails.title = msg.title
      self.itemDetails.attributes = msg.attributes
    })
  },
  watch: {
    $route(to, from) {
      // reset data when changing route to an empty one
      if (typeof to.param === "undefined") {
        this.itemDetails.title = null;
        this.itemDetails._id = null;
        this.itemDetails.attributes = [];
      }
    }

  },
  template: `
    
        <div>
            <h1>Item details</h1>
            <div class="input-group">
                <input class="form-control" type="text" placeholder="Item title" v-model="itemDetails.title" v-on:input="onItemChange">
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="button" v-on:click="onAdd()">Add attribute</button>
                </div>
            </div>
            <div v-for="(attribute, index) in itemDetails.attributes" class="input-group">
                <input type="text" aria-label="First name" class="form-control" placeholder="Attribute name" v-model="attribute.name" v-on:input="onItemChange">
                <input type="text" aria-label="Last name" class="form-control" placeholder="Attribute value" v-model="attribute.value" v-on:input="onItemChange">
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="button" v-on:click="onRemove(index)">Remove</button>
                </div>
            </div>
            <br>

            <input v-if="saved" class="btn btn-primary disabled" type="submit" value="Submit" disabled>
            <input v-else class="btn btn-primary" type="submit" value="Submit" v-on:click="onSubmit()">
        </div>
    
    `
};
