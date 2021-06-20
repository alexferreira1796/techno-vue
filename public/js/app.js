const vm = new Vue({
  el: "#app",
  data: {
    products: [],
    product: false,
    cart: [],
    message: "",
    active: false,
    cartActive: false,
  },
  filters: {
    convertCurrency(value) {
      return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },
  },
  computed: {
    cartTotal(valor) {
      const total = this.cart.reduce((acc, next) => acc + next.preco, 0);
      return total;
    },
  },
  methods: {
    async api(endpoint) {
      try {
        const res = await fetch(`./api/${endpoint}`);
        const json = await res.json();
        return json;
      } catch (error) {
        console.log(error);
      }
    },
    async getProducts() {
      this.products = await this.api("produtos.json");
    },
    async getProduct(id) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      this.product = await this.api(`produtos/${id}/dados.json`);
    },
    closeModal({ target, currentTarget }) {
      if (target === currentTarget) {
        this.product = false;
      }
    },
    closeCart({ target, currentTarget }) {
      if (target === currentTarget) {
        this.carActive = false;
      }
    },
    addCart() {
      const { id, nome, preco } = this.product;
      this.cart.push({ id, nome, preco });
      this.product.estoque--;
      this.alert(`${nome} foi adicionado ao carrinho`);
    },
    removeItem(id) {
      this.cart.splice(id, 1);
    },
    getCart() {
      const local = window.localStorage.getItem("@cart");
      if (local) {
        this.cart = JSON.parse(local);
      }
    },
    compare() {
      const items = this.cart.filter(({ id }) => id === this.product.id);
      this.product.estoque -= items.length;
    },
    alert(msg) {
      this.message = msg;
      this.active = true;
      setTimeout(() => {
        this.active = false;
        this.message = "";
      }, 1500);
    },

    router() {
      const hash = document.location.hash;
      if (hash) {
        this.getProduct(hash.replace("#", ""));
      }
    },
  },
  watch: {
    product() {
      document.title = this.product.nome || "Techno";
      const hash = this.product.id || "";
      history.pushState(null, null, `#${hash}`);
      if (this.product) {
        this.compare();
      }
    },
    cart() {
      window.localStorage.setItem("@cart", JSON.stringify(this.cart));
    },
  },
  created() {
    this.getProducts();
    this.getCart();
    this.router();
  },
});
