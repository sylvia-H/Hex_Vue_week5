// 元件 - Modal 後台人員登入介面
const modal_login = {
    data(){
        return{
            modal:'',
            userInfo:{
                username: '',
                password: ''
            }
        }
    },
    template:`
    <div class="modal fade" ref="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-dark text-white">
                    <h5 class="modal-title" id="loginModalLabel">
                        管理後台入口
                    </h5>
                </div>
                <div class="modal-body">
                    <p class="text-center | my-6">
                        後台管理人員請輸入帳號密碼進行驗證
                    </p>
                    <form id="form">
                        <div class="form-floating mb-3">
                            <input v-model="userInfo.username" type="email" class="form-control" id="username"
                            placeholder="name@example.com" required autofocus>
                            <label for="username">Email address</label>
                        </div>
                        <div class="form-floating mb-3">
                            <input v-model="userInfo.password" type="password" class="form-control" id="password"
                            placeholder="Password" required>
                            <label for="password">Password</label>
                        </div>
                        <button @click="loginIn" class="btn btn-lg btn-primary w-100 mt-3" type="button">
                            登入
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>`,
    methods: {
        openModal() {
            this.modal.show();
        },
        loginIn(){
            axios.post(`${baseUrl}/admin/signin`, this.userInfo)
            .then(res => {
                const { token, expired } = res.data;
                // 用 cookie 儲存資料，myToken 是自定義名稱
                document.cookie = `myToken=${ token }; expires=${new Date(expired)};`;
                window.location = './backend.html';
            })
            .catch(err => {
                console.log(err.response);
                const errTitle = err.response.data.message;
                const errMSG = err.response.data.error.message;
                //登入失敗，sweetalert 跳出提示訊息視窗
                swal(`${errTitle}！`, errMSG, {
                    icon: "error",
                });
            })
        },
    },
    mounted(){
        this.modal = new bootstrap.Modal(this.$refs.loginModal);
    }
}


const canvas_cart = {
    data(){
        return{
            canvas:'',
            innerCarts:[],
        }
    },
    props:['carts'],
    watch: {
      carts(){
        this.innerCarts = this.carts;
      }
    },
    template:`
    <div ref="cart_canvas" class="offcanvas offcanvas-end bg-dark" tabindex="-1" aria-labelledby="cartLabel">
    
        <!-- Cart 購物車 offcanvas-header -->
        <div class="offcanvas-header pt-8 ps-8">
            <h2 id="cartLabel" class="text-white">購物車列表</h2>
        </div>

        <!-- Cart 購物車 offcanvas-body -->
        <div class="offcanvas-body fashion-scrollbar ps-8 h-100">
            
            <!-- Card 購物車卡片01 -->
            <div v-for="item in innerCarts.carts" :key="item.id"
             class="card rounded-2 py-6 px-4 mb-3 position-relative">
                <button @click="delCart(item.id, item.product.title)"
                    class="btn-close position-absolute top-0 end-0 m-2" type="button" aria-label="Close">
                </button>
                <div class="row g-0 align-items-center">
                    <div class="col-3">
                        <img class="img-cover w-100 h-100" :src="item.product.imageUrl" alt="...">
                    </div>
                    <div class="col-9 ps-4">
                        <div class="row">
                            <div class="col-7 d-flex flex-column align-items-center justify-content-center">
                                <h5 class="card-title mb-4">
                                    {{ item.product.title }}
                                </h5>
                                <p class="card-text">
                                    單價 NT 
                                    <span v-if="item.product.origin_price !== item.product.price" class="text-gray">
                                        <s>{{ item.product.origin_price }}</s>
                                    </span>
                                     {{ item.product.price }} 元
                                </p>
                            </div>
                            <div class="col-5 d-flex align-items-end">
                                <div class="btn-group d-flex justify-content-around align-items-center" 
                                     role="group" aria-label="Basic">
                                    <button @click="editCart(item.id, item.qty-1)"
                                        :disabled="item.qty-1 === 0"
                                        type="button" class="btn btn-warning fw-bold">－</button>
                                    <input :value="item.qty" type="text" 
                                        class="form-control-plaintext p-0 border-0 fw-bold text-black text-center" >
                                    <button @click="editCart(item.id, item.qty+1)"
                                        type="button" class="btn btn-warning fw-bold">＋</button>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>

        </div>
        
        <!-- Cart 購物車 offcanvas-footer -->
        <div class="offcanvas-footer d-flex justify-content-between align-items-center py-6 px-8">
            <div class="d-flex ai-c">
                <p class="h5 text-white me-24">小計</p>
                <span class="h5 text-white">NT$ {{ innerCarts.total }}</span>
            </div>
            <div class="d-flex ai-c">
                <button @click="delCart(null)"
                        :disabled="carts.carts?.length === 0"
                        class="btn btn-outline-danger px-4 py-2 me-6">
                    清空購物車
                </button>
                <form action="checkout-order.html">
                    <button type="submit" class="btn btn-danger px-4 py-2" 
                        :disabled="carts.carts?.length === 0">
                        前往結帳
                    </button>
                </form>
            </div>
        </div>

    </div>
    `,
    methods:{
        openCanvas(){
            this.canvas.show();
        },
        editCart(id,qty){
            const data = {
                "product_id": id,
                qty
            }
            axios.put(`${baseUrl}/api/${API_PATH}/cart/${id}`, { data })
            .then(res => {
                console.log(res.data);
                this.$emit('emit-cart');
            })
            .catch(err => {
                console.log(err.response);
            })
        },
        delCart(id, title){
            let url = '';
            if(id){
                url = `${baseUrl}/api/${API_PATH}/cart/${id}`;

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
                          this.$emit('emit-cart');
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
            } else {
                url = `${baseUrl}/api/${API_PATH}/carts`;

                swal({
                    title: `確定要清空購物車嗎？`,
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
                .then((willDelete) => {
                    if (willDelete) {
                    swal(`您已將購物車清空了！`, {
                        icon: "success",
                    });
                    axios.delete(url)
                    .then(res => {
                        console.log(res);
                        //成功刪除產品，sweetalert 跳出提示訊息視窗
                        swal('成功！', `已清空購物車`, {
                            icon: "success",
                        });
                        this.$emit('emit-cart');
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
            }

        }
    },
    mounted(){
        this.innerCarts = this.carts;
        this.canvas = new bootstrap.Offcanvas(this.$refs.cart_canvas);
    }
}




