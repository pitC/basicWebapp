var list_entry = Vue.extend(
    {

    // methods:{
    //     delete: function(event){
    //         console.log("delete "+this.item._id);
    //     }
    // },
    
    template: '<p>test</p>'

})

Vue.component('list-entry',list_entry)

// <button type="button" class="btn btn-outline-danger btn-lg" v-on:click="delete">
// <span class="glyphicon glyphicon-remove-circle"></span>
// </button>

new Vue({
    el: 'app',
    data: function () {
        return {
            items: [
                { _id: 1111111111111 },
                { _id: 2222222222222 }
            ]
        }
    },
    mounted() {
        axios
            .get('http://localhost:3000/objects')
            .then(response => {
                // this.items = response.data;
            });
    }
})
