var app = new Vue({
    el: '#v-table',
    data: {

        items: []

    },
    mounted() {
        axios
            .get('http://localhost:3000/objects')
            .then(response => {
                this.items = response.data;
            });
    }
});