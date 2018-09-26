new Vue({
    el: 'app',
    data: {
        items: []
    },
    methods: {
        onDelete: function (index) {
            console.log("delte " + index);
            var item = this.items[index];
            axios
                .delete('http://localhost:3000/objects/' + item._id)
                .then(response => {
                    this.$delete(this.items, index)
                })
        }
    }
    ,
    mounted() {
        axios
            .get('http://localhost:3000/objects')
            .then(response => {
                this.items = response.data;
            });
    }
})
