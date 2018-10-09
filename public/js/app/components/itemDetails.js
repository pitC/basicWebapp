export default {
  data: function() {
    return {
      title: "<new title>",
      attributes: [{ name: null, value: null }],
      _id: null
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
        axios.post("http://localhost:3000/objects/", payload).then(response => {
          console.log(response);
          this._id = response.data._id;
        });
      } else {
        axios.put("http://localhost:3000/objects/"+this._id, payload).then(response => {
          console.log(response);
        });
      }
    }
  },
  mounted() {
    var id = this.$route.params.id;
    if (id != null){
        axios.get("http://localhost:3000/objects/"+id).then(response => {
      this._id = response.data._id;
      this.title = response.data.title;
      this.attributes = response.data.attributes;
    });
    }
    
    console.log("Mounted! "+this.$route.params.id);
    
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
