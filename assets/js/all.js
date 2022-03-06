"use strict";

var baseUrl = 'https://vue3-course-api.hexschool.io/v2';
var API_PATH = 'sylviah';
var AUTH_TOKEN = document.cookie.replace(/(?:(?:^|.*;\s*)myToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
"use strict";

// 元件 - Modal 後台人員登入介面
var modal_login = {
  data: function data() {
    return {
      modal: '',
      userInfo: {
        username: '',
        password: ''
      }
    };
  },
  template: "\n    <div class=\"modal fade\" ref=\"loginModal\" tabindex=\"-1\" aria-labelledby=\"loginModalLabel\" aria-hidden=\"true\">\n        <div class=\"modal-dialog\">\n            <div class=\"modal-content\">\n                <div class=\"modal-header bg-dark text-white\">\n                    <h5 class=\"modal-title\" id=\"loginModalLabel\">\n                        \u7BA1\u7406\u5F8C\u53F0\u5165\u53E3\n                    </h5>\n                </div>\n                <div class=\"modal-body\">\n                    <p class=\"text-center | my-6\">\n                        \u5F8C\u53F0\u7BA1\u7406\u4EBA\u54E1\u8ACB\u8F38\u5165\u5E33\u865F\u5BC6\u78BC\u9032\u884C\u9A57\u8B49\n                    </p>\n                    <form id=\"form\">\n                        <div class=\"form-floating mb-3\">\n                            <input v-model=\"userInfo.username\" type=\"email\" class=\"form-control\" id=\"username\"\n                            placeholder=\"name@example.com\" required autofocus>\n                            <label for=\"username\">Email address</label>\n                        </div>\n                        <div class=\"form-floating mb-3\">\n                            <input v-model=\"userInfo.password\" type=\"password\" class=\"form-control\" id=\"password\"\n                            placeholder=\"Password\" required>\n                            <label for=\"password\">Password</label>\n                        </div>\n                        <button @click=\"loginIn\" class=\"btn btn-lg btn-primary w-100 mt-3\" type=\"button\">\n                            \u767B\u5165\n                        </button>\n                    </form>\n                </div>\n            </div>\n        </div>\n    </div>",
  methods: {
    openModal: function openModal() {
      this.modal.show();
    },
    loginIn: function loginIn() {
      axios.post("".concat(baseUrl, "/admin/signin"), this.userInfo).then(function (res) {
        var _res$data = res.data,
            token = _res$data.token,
            expired = _res$data.expired; // 用 cookie 儲存資料，myToken 是自定義名稱

        document.cookie = "myToken=".concat(token, "; expires=").concat(new Date(expired), ";");
        window.location = './backend.html';
      })["catch"](function (err) {
        console.log(err.response);
        var errTitle = err.response.data.message;
        var errMSG = err.response.data.error.message; //登入失敗，sweetalert 跳出提示訊息視窗

        swal("".concat(errTitle, "\uFF01"), errMSG, {
          icon: "error"
        });
      });
    }
  },
  mounted: function mounted() {
    this.modal = new bootstrap.Modal(this.$refs.loginModal);
  }
};
var canvas_cart = {
  data: function data() {
    return {
      canvas: '',
      innerCarts: []
    };
  },
  props: ['carts'],
  watch: {
    carts: function carts() {
      this.innerCarts = this.carts;
    }
  },
  template: "\n    <div ref=\"cart_canvas\" class=\"offcanvas offcanvas-end bg-dark\" tabindex=\"-1\" aria-labelledby=\"cartLabel\">\n    \n        <!-- Cart \u8CFC\u7269\u8ECA offcanvas-header -->\n        <div class=\"offcanvas-header pt-8 ps-8\">\n            <h2 id=\"cartLabel\" class=\"text-white\">\u8CFC\u7269\u8ECA\u5217\u8868</h2>\n        </div>\n\n        <!-- Cart \u8CFC\u7269\u8ECA offcanvas-body -->\n        <div class=\"offcanvas-body fashion-scrollbar ps-8 h-100\">\n            \n            <!-- Card \u8CFC\u7269\u8ECA\u5361\u724701 -->\n            <div v-for=\"item in innerCarts.carts\" :key=\"item.id\"\n             class=\"card rounded-2 py-6 px-4 mb-3 position-relative\">\n                <button @click=\"delCart(item.id, item.product.title)\"\n                    class=\"btn-close position-absolute top-0 end-0 m-2\" type=\"button\" aria-label=\"Close\">\n                </button>\n                <div class=\"row g-0 align-items-center\">\n                    <div class=\"col-3\">\n                        <img class=\"img-cover w-100 h-100\" :src=\"item.product.imageUrl\" alt=\"...\">\n                    </div>\n                    <div class=\"col-9 ps-4\">\n                        <div class=\"row\">\n                            <div class=\"col-7 d-flex flex-column align-items-center justify-content-center\">\n                                <h5 class=\"card-title mb-4\">\n                                    {{ item.product.title }}\n                                </h5>\n                                <p class=\"card-text\">\n                                    \u55AE\u50F9 NT \n                                    <span v-if=\"item.product.origin_price !== item.product.price\" class=\"text-gray\">\n                                        <s>{{ item.product.origin_price }}</s>\n                                    </span>\n                                     {{ item.product.price }} \u5143\n                                </p>\n                            </div>\n                            <div class=\"col-5 d-flex align-items-end\">\n                                <div class=\"btn-group d-flex justify-content-around align-items-center\" \n                                     role=\"group\" aria-label=\"Basic\">\n                                    <button @click=\"editCart(item.id, item.qty-1)\"\n                                        :disabled=\"item.qty-1 === 0\"\n                                        type=\"button\" class=\"btn btn-warning fw-bold\">\uFF0D</button>\n                                    <input :value=\"item.qty\" type=\"text\" \n                                        class=\"form-control-plaintext p-0 border-0 fw-bold text-black text-center\" >\n                                    <button @click=\"editCart(item.id, item.qty+1)\"\n                                        type=\"button\" class=\"btn btn-warning fw-bold\">\uFF0B</button>\n                                </div>\n                            </div>\n                            \n                        </div>\n                    </div>\n                </div>\n            </div>\n\n        </div>\n        \n        <!-- Cart \u8CFC\u7269\u8ECA offcanvas-footer -->\n        <div class=\"offcanvas-footer d-flex justify-content-between align-items-center py-6 px-8\">\n            <div class=\"d-flex ai-c\">\n                <p class=\"h5 text-white me-24\">\u5C0F\u8A08</p>\n                <span class=\"h5 text-white\">NT$ {{ innerCarts.total }}</span>\n            </div>\n            <div class=\"d-flex ai-c\">\n                <button @click=\"delCart(null)\"\n                        :disabled=\"carts.carts?.length === 0\"\n                        class=\"btn btn-outline-danger px-4 py-2 me-6\">\n                    \u6E05\u7A7A\u8CFC\u7269\u8ECA\n                </button>\n                <form action=\"checkout-order.html\">\n                    <button type=\"submit\" class=\"btn btn-danger px-4 py-2\" \n                        :disabled=\"carts.carts?.length === 0\">\n                        \u524D\u5F80\u7D50\u5E33\n                    </button>\n                </form>\n            </div>\n        </div>\n\n    </div>\n    ",
  methods: {
    openCanvas: function openCanvas() {
      this.canvas.show();
    },
    editCart: function editCart(id, qty) {
      var _this = this;

      var data = {
        "product_id": id,
        qty: qty
      };
      axios.put("".concat(baseUrl, "/api/").concat(API_PATH, "/cart/").concat(id), {
        data: data
      }).then(function (res) {
        console.log(res.data);

        _this.$emit('emit-cart');
      })["catch"](function (err) {
        console.log(err.response);
      });
    },
    delCart: function delCart(id, title) {
      var _this2 = this;

      var url = '';

      if (id) {
        url = "".concat(baseUrl, "/api/").concat(API_PATH, "/cart/").concat(id);
        swal({
          title: "\u78BA\u5B9A\u8981\u5C07".concat(title, "\u522A\u9664\u55CE\uFF1F"),
          icon: "warning",
          buttons: true,
          dangerMode: true
        }).then(function (willDelete) {
          if (willDelete) {
            swal("\u60A8\u5DF2\u5C07".concat(title, "\u522A\u9664\u4E86\uFF01"), {
              icon: "success"
            });
            axios["delete"](url).then(function (res) {
              console.log(res); //成功刪除產品，sweetalert 跳出提示訊息視窗

              swal('成功！', "\u5DF2\u522A\u9664 ".concat(title), {
                icon: "success"
              });

              _this2.$emit('emit-cart');
            })["catch"](function (err) {
              console.log(err.response); //刪除失敗，sweetalert 跳出提示訊息視窗

              swal('失敗！', '請再試一次', {
                icon: "error"
              });
            });
          }
        });
      } else {
        url = "".concat(baseUrl, "/api/").concat(API_PATH, "/carts");
        swal({
          title: "\u78BA\u5B9A\u8981\u6E05\u7A7A\u8CFC\u7269\u8ECA\u55CE\uFF1F",
          icon: "warning",
          buttons: true,
          dangerMode: true
        }).then(function (willDelete) {
          if (willDelete) {
            swal("\u60A8\u5DF2\u5C07\u8CFC\u7269\u8ECA\u6E05\u7A7A\u4E86\uFF01", {
              icon: "success"
            });
            axios["delete"](url).then(function (res) {
              console.log(res); //成功刪除產品，sweetalert 跳出提示訊息視窗

              swal('成功！', "\u5DF2\u6E05\u7A7A\u8CFC\u7269\u8ECA", {
                icon: "success"
              });

              _this2.$emit('emit-cart');
            })["catch"](function (err) {
              console.log(err.response); //刪除失敗，sweetalert 跳出提示訊息視窗

              swal('失敗！', '請再試一次', {
                icon: "error"
              });
            });
          }
        });
      }
    }
  },
  mounted: function mounted() {
    this.innerCarts = this.carts;
    this.canvas = new bootstrap.Offcanvas(this.$refs.cart_canvas);
  }
};
"use strict";

var app = Vue.createApp({
  data: function data() {
    return {
      products: [],
      carts: [],
      final_total: 0,
      total: 0,
      is_loadingItem: '',
      isLoading: true
    };
  },
  components: {
    modal_login: modal_login,
    canvas_cart: canvas_cart
  },
  methods: {
    openLoginModel: function openLoginModel() {
      this.$refs.loginModal.openModal();
    },
    openCartCanvas: function openCartCanvas() {
      this.$refs.cartCanvas.openCanvas();
    },
    getProducts: function getProducts() {
      var _this = this;

      axios.get("".concat(baseUrl, "/api/").concat(API_PATH, "/products/all")).then(function (res) {
        console.log(res.data.products);
        _this.products = res.data.products;
      })["catch"](function (err) {
        console.log(err.response);
      });
    },
    addCart: function addCart(id) {
      var _this2 = this;

      var qty = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var data = {
        "product_id": id,
        qty: qty
      };
      this.is_loadingItem = id;
      axios.post("".concat(baseUrl, "/api/").concat(API_PATH, "/cart"), {
        data: data
      }).then(function (res) {
        console.log(res.data);
        var name = res.data.data.product.title;
        var msg = res.data.message; // SweetAlert：產品成功加入購物車

        swal('成功！', "".concat(name, " ").concat(msg), {
          icon: "success"
        });

        _this2.getCart();

        _this2.is_loadingItem = '';
      })["catch"](function (err) {
        console.log(err.response);
      });
    },
    getCart: function getCart() {
      var _this3 = this;

      axios.get("".concat(baseUrl, "/api/").concat(API_PATH, "/cart")).then(function (res) {
        _this3.carts = res.data.data;
        console.log(_this3.carts);
      })["catch"](function (err) {
        console.log(err.response);
      });
    }
  },
  mounted: function mounted() {
    var _this4 = this;

    this.isLoading = true;
    setTimeout(function () {
      _this4.isLoading = false;
    }, 1000);
    this.getCart();
    this.getProducts();
  }
}); // 元件：vue-loading-overlay

app.component('loading', VueLoading.Component); // 建立實體、掛載

app.mount('#app');
"use strict";

// 元件 - 後臺產品列表分頁元件
var pagination_products = {
  props: ['pagination'],
  template: '#pagination-template'
}; // 元件 - Modal 編輯產品樣板

var modal_edit = {
  data: function data() {
    return {
      is_uploadImg: 0,
      uploadImgFile: {
        imageUrl: '',
        message: ''
      }
    };
  },
  props: ['tempItemInfo', 'is_addNewProduct'],
  template: '#edit-modal-template',
  methods: {
    uploadProductImg: function uploadProductImg() {
      var _this = this;

      // 圖片上傳中
      this.is_uploadImg = 1; //清空預設

      this.uploadImgFile = {
        imageUrl: '',
        message: ''
      };
      var btn_uploadImg = document.querySelector('#btn_uploadImg');
      var file = btn_uploadImg.files[0];
      console.dir(file); // 先對 input 內容進行觀察

      var formData = new FormData(); //建立表單格式的物件
      // 對應平台 API 格式：<input type="file" name="file-to-upload">

      formData.append('file-to-upload', file);
      axios.post("".concat(baseUrl, "/api/").concat(API_PATH, "/admin/upload"), formData).then(function (res) {
        console.log(res.data.imageUrl);
        _this.uploadImgFile.imageUrl = res.data.imageUrl; // 圖片上傳完成

        _this.is_uploadImg = 0; // 清空上傳檔案

        btn_uploadImg.value = '';
      })["catch"](function (err) {
        console.log(err.response.message);
        _this.uploadImgFile.message = err.response.message; // 圖片上傳失敗，重設狀態

        _this.is_uploadImg = 0;
      });
    },
    copyText: function copyText() {
      var clipboard = new ClipboardJS('#btn_copyLink');
      clipboard.on('success', function (e) {
        console.info('Action:', e.action);
        console.info('Text:', e.text);
        console.info('Trigger:', e.trigger);
        e.clearSelection(); //取消選取
      });
      clipboard.on('error', function (e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
      });
    }
  }
}; // 元件 - Modal 刪除產品樣板

var modal_del = {
  props: ['tempItemInfo'],
  template: '#del-modal-template'
};
"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var editModal = '';
var delModal = '';
var app2 = Vue.createApp({
  data: function data() {
    return {
      products: [],
      pagination: {},
      tempItemInfo: {
        imagesUrl: []
      },
      // 是否新增新產品，預設狀態:"0-否"
      is_addNewProduct: 0
    };
  },
  components: {
    pagination_products: pagination_products,
    modal_edit: modal_edit,
    modal_del: modal_del
  },
  methods: {
    checkLogin: function checkLogin() {
      var _this = this;

      AUTH_TOKEN = document.cookie.replace(/(?:(?:^|.*;\s*)myToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
      axios.post("".concat(baseUrl, "/api/user/check")).then(function () {
        _this.getProducts();
      })["catch"](function (err) {
        console.log(err.response);
        window.location = './index.html';
      });
    },
    getProducts: function getProducts() {
      var _this2 = this;

      var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      axios.get("".concat(baseUrl, "/api/").concat(API_PATH, "/admin/products?page=").concat(page)).then(function (res) {
        console.log(res.data.products);
        _this2.products = res.data.products;
        _this2.pagination = res.data.pagination;
      })["catch"](function (err) {
        console.log(err.response);
      });
    },
    changeStatus: function changeStatus(id) {
      var _this3 = this;

      this.is_addNewProduct = 0;
      this.products.forEach(function (item) {
        if (item.id === id) {
          item.is_enabled ? item.is_enabled = 0 : item.is_enabled = 1;
          console.log(item);

          _this3.editProduct(item, id);
        }
      });
    },
    editProduct: function editProduct(item, id) {
      var _this4 = this;

      if (item) {
        this.tempItemInfo = item;
      }

      var dataObj = {
        "data": this.tempItemInfo
      };
      var httpStatus = '';
      var url = '';

      if (this.is_addNewProduct) {
        httpStatus = 'post';
        url = "".concat(baseUrl, "/api/").concat(API_PATH, "/admin/product");
      } else {
        httpStatus = 'put';
        url = "".concat(baseUrl, "/api/").concat(API_PATH, "/admin/product/").concat(this.tempItemInfo.id || id);
      }

      axios[httpStatus](url, dataObj).then(function (res) {
        console.log(res.data);

        if (httpStatus === 'post') {
          //成功新增產品，sweetalert 跳出提示訊息視窗
          swal('成功！', "\u6210\u529F\u65B0\u589E ".concat(_this4.tempItemInfo.title), {
            icon: "success"
          });
        } else {
          //成功更新產品，sweetalert 跳出提示訊息視窗
          swal('成功！', "\u5DF2\u66F4\u65B0 ".concat(_this4.tempItemInfo.title, " \u7684\u8CC7\u8A0A"), {
            icon: "success"
          });
        }

        _this4.getProducts(_this4.pagination.current_page);
      })["catch"](function (err) {
        console.log(err.response);
        var errMSG = err.response.data.message;
        var msg = '';
        errMSG.forEach(function (el) {
          return msg += el + '。\n';
        }); //更新失敗，sweetalert 跳出提示訊息視窗

        swal('失敗！請重新輸入資訊。', msg, {
          icon: "error"
        });
      }); // 清空上傳圖片區

      this.uploadImgFile = {
        imageUrl: '',
        message: ''
      }; // 關閉 modal

      editModal.hide();
    },
    openEditModal: function openEditModal(is_addNewProduct, item) {
      this.is_addNewProduct = is_addNewProduct;
      this.tempItemInfo = {
        imagesUrl: []
      };

      if (item) {
        this.tempItemInfo = JSON.parse(JSON.stringify(item));

        if (!this.tempItemInfo.imagesUrl) {
          this.tempItemInfo.imagesUrl = [];
        }
      }

      editModal.show();
    },
    openDelModal: function openDelModal(item) {
      this.tempItemInfo = _objectSpread({}, item);
      delModal.show();
    },
    delProduct: function delProduct() {
      var _this5 = this;

      var dataID = this.tempItemInfo.id;
      axios["delete"]("".concat(baseUrl, "/api/").concat(API_PATH, "/admin/product/").concat(dataID)).then(function (res) {
        //成功刪除產品，sweetalert 跳出提示訊息視窗
        swal('成功！', "\u5DF2\u522A\u9664 ".concat(_this5.tempItemInfo.title, " \u7684\u8CC7\u8A0A"), {
          icon: "success"
        });

        _this5.getProducts(_this5.pagination.current_page);
      })["catch"](function (err) {
        console.log(err.response); //刪除失敗，sweetalert 跳出提示訊息視窗

        swal('失敗！', '請再試一次', {
          icon: "error"
        });
      });
      delModal.hide();
    }
  },
  mounted: function mounted() {
    this.checkLogin();
    editModal = new bootstrap.Modal(document.querySelector('#productModal'));
    delModal = new bootstrap.Modal(document.querySelector('#delProductModal'));
  }
});
app2.mount('#app2');
"use strict";

var _VeeValidate = VeeValidate,
    defineRule = _VeeValidate.defineRule,
    Form = _VeeValidate.Form,
    Field = _VeeValidate.Field,
    ErrorMessage = _VeeValidate.ErrorMessage,
    configure = _VeeValidate.configure;
var _VeeValidateRules = VeeValidateRules,
    required = _VeeValidateRules.required,
    email = _VeeValidateRules.email,
    min = _VeeValidateRules.min,
    max = _VeeValidateRules.max;
var _VeeValidateI18n = VeeValidateI18n,
    localize = _VeeValidateI18n.localize,
    loadLocaleFromURL = _VeeValidateI18n.loadLocaleFromURL;
defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);
loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');
configure({
  generateMessage: localize('zh_TW'),
  // 語系設定
  validateOnInput: true // 調整為：輸入文字時，就立即進行驗證

});
var app3 = Vue.createApp({
  data: function data() {
    return {
      carts: [],
      formData: {
        "user": {
          "name": '',
          "email": '',
          "tel": '',
          "address": ''
        },
        "message": ''
      },
      isLoading: true
    };
  },
  components: {
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage
  },
  methods: {
    getCart: function getCart() {
      var _this = this;

      axios.get("".concat(baseUrl, "/api/").concat(API_PATH, "/cart")).then(function (res) {
        _this.carts = res.data.data;
        console.log(_this.carts);
      })["catch"](function (err) {
        console.log(err.response);
      });
    },
    editCart: function editCart(id, qty) {
      var _this2 = this;

      var data = {
        "product_id": id,
        qty: qty
      };
      axios.put("".concat(baseUrl, "/api/").concat(API_PATH, "/cart/").concat(id), {
        data: data
      }).then(function (res) {
        console.log(res.data);

        _this2.getCart();
      })["catch"](function (err) {
        console.log(err.response);
      });
    },
    delCart: function delCart(id, title) {
      var _this3 = this;

      var url = "".concat(baseUrl, "/api/").concat(API_PATH, "/cart/").concat(id);
      swal({
        title: "\u78BA\u5B9A\u8981\u5C07".concat(title, "\u522A\u9664\u55CE\uFF1F"),
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(function (willDelete) {
        if (willDelete) {
          swal("\u60A8\u5DF2\u5C07".concat(title, "\u522A\u9664\u4E86\uFF01"), {
            icon: "success"
          });
          axios["delete"](url).then(function (res) {
            console.log(res); //成功刪除產品，sweetalert 跳出提示訊息視窗

            swal('成功！', "\u5DF2\u522A\u9664 ".concat(title), {
              icon: "success"
            });

            _this3.getCart();
          })["catch"](function (err) {
            console.log(err.response); //刪除失敗，sweetalert 跳出提示訊息視窗

            swal('失敗！', '請再試一次', {
              icon: "error"
            });
          });
        }
      });
    },
    submitOrder: function submitOrder() {
      var _this4 = this;

      var data = this.formData;
      axios.post("".concat(baseUrl, "/api/").concat(API_PATH, "/order"), {
        data: data
      }).then(function (res) {
        console.log(res.data);

        _this4.$refs.form.resetForm();

        swal('成功！', "\u5DF2\u9001\u51FA\u8A02\u55AE\uFF01\u7E3D\u91D1\u984D NT$ ".concat(res.data.total, " \u5143"), {
          icon: "success"
        }).then(function (check) {
          if (check) {
            window.location = "./index.html";
          }
        });
      })["catch"](function (err) {
        console.log(err.response); //刪除失敗，sweetalert 跳出提示訊息視窗

        swal('失敗！', '送出訂單失敗，請再試一次！', {
          icon: "error"
        });
      });
    }
  },
  mounted: function mounted() {
    var _this5 = this;

    this.getCart();
    this.isLoading = true;
    setTimeout(function () {
      _this5.isLoading = false;
    }, 1000);
  }
}); // 元件：vue-loading-overlay

app3.component('loading', VueLoading.Component); // 建立實體、掛載

app3.mount('#app3');
//# sourceMappingURL=all.js.map
