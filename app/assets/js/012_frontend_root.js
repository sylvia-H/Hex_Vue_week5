const app = Vue.createApp({
    data() {
        return {
            products : [],
            carts: [],
            final_total:0,
            total:0,
            is_loadingItem: '',
            isLoading: true,
        }
    },
    components:{
        modal_login,
        canvas_cart
    },
    methods:{
        openLoginModel(){
            this.$refs.loginModal.openModal();
        },
        openCartCanvas(){
            this.$refs.cartCanvas.openCanvas();
        },
        getProducts(){
            axios.get(`${baseUrl}/api/${API_PATH}/products/all`)
            .then(res => {
                console.log(res.data.products);
                this.products = res.data.products;
            })
            .catch(err => {
                console.log(err.response);
            })
        },
        addCart(id,qty=1){
            const data = {
                "product_id": id,
                qty
            }
            this.is_loadingItem = id;

            axios.post(`${baseUrl}/api/${API_PATH}/cart`, { data })
            .then(res => {
                console.log(res.data);
                const name = res.data.data.product.title;
                const msg = res.data.message
                // SweetAlert：產品成功加入購物車
                swal('成功！', `${name} ${msg}`, {
                    icon: "success",
                });
                this.getCart();
                this.is_loadingItem = '';
            })
            .catch(err => {
                console.log(err.response);
            })
        },
        getCart(){
            axios.get(`${baseUrl}/api/${API_PATH}/cart`)
            .then(res => {
                this.carts = res.data.data;
                console.log(this.carts);
            })
            .catch(err => {
                console.log(err.response);
            })
        },
    },
    mounted(){
        this.isLoading = true;
        setTimeout(() => {
            this.isLoading = false
        }, 1000);
        this.getCart();
        this.getProducts();
    }
});

// 元件：vue-loading-overlay
app.component('loading', VueLoading.Component);

// 建立實體、掛載
app.mount('#app');
