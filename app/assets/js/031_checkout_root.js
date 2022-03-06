const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');
configure({
    generateMessage: localize('zh_TW'), // 語系設定
    validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

const app3 = Vue.createApp({
    data() {
        return {
            carts: [
            ],
            formData:{
                "user": {
                    "name": '',
                    "email": '',
                    "tel": '',
                    "address": ''
                },
                "message": ''
            },
            isLoading: true,
        }
    },
    components: {
      VForm: Form,
      VField: Field,
      ErrorMessage: ErrorMessage,
    },
    methods:{
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
        editCart(id,qty){
            const data = {
                "product_id": id,
                qty
            }
            axios.put(`${baseUrl}/api/${API_PATH}/cart/${id}`, { data })
            .then(res => {
                console.log(res.data);
                this.getCart();
            })
            .catch(err => {
                console.log(err.response);
            })
        },
        delCart(id, title){
            const url = `${baseUrl}/api/${API_PATH}/cart/${id}`;

            swal({
                title: `確定要將${title}刪除嗎？`,
                icon: "warning",
                buttons: true,
                dangerMode: true,
                })
                .then((willDelete) => {
                if (willDelete) {
                    swal(`您已將${title}刪除了！`, {
                    icon: "success",
                    });
                    axios.delete(url)
                    .then(res => {
                        console.log(res);
                        //成功刪除產品，sweetalert 跳出提示訊息視窗
                        swal('成功！', `已刪除 ${title}`, {
                            icon: "success",
                        });
                        this.getCart();
                    })
                    .catch(err => {
                        console.log(err.response);
                        //刪除失敗，sweetalert 跳出提示訊息視窗
                        swal('失敗！', '請再試一次', {
                            icon: "error",
                        });
                    });
                }
            });

        },
        submitOrder(){
            const data = this.formData;
            axios.post(`${baseUrl}/api/${API_PATH}/order`, { data })
            .then(res => {
                console.log(res.data);
                this.$refs.form.resetForm();
                swal('成功！', `已送出訂單！總金額 NT$ ${res.data.total} 元`, {
                    icon: "success",
                }).then( check => {
                    if(check){
                        window.location = "./index.html";
                    }
                })
                
            })
            .catch(err => {
                console.log(err.response);
                //刪除失敗，sweetalert 跳出提示訊息視窗
                swal('失敗！', '送出訂單失敗，請再試一次！', {
                    icon: "error",
                });
            })
        }
    },
    mounted(){
        this.getCart();
        this.isLoading = true;
        setTimeout(() => {
            this.isLoading = false
        }, 1000);
    }
});

// 元件：vue-loading-overlay
app3.component('loading', VueLoading.Component);

// 建立實體、掛載
app3.mount('#app3');
