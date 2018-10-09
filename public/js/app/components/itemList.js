export default {
  data: function() {
    return {
      items: []
    };
  },
  mounted() {
    axios.get("http://localhost:3000/objects").then(response => {
      this.items = response.data;
    });
  },
  methods: {
    onDelete: function(index) {
      console.log("delte " + index);
      var item = this.items[index];
      axios
        .delete("http://localhost:3000/objects/" + item._id)
        .then(response => {
          this.$delete(this.items, index);
        });
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
