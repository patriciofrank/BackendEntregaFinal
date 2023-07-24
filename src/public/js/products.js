const productsContainer = document.getElementById("products-container");
const productsTemplate = document.getElementById("products-template").innerHTML;
const userTemplate = document.getElementById("user-template").innerHTML;

let page = 1;
let limit = 3;
let sort = "price_asc";
let category = "";
let currentPage;


function renderProducts(products) {
  const data = {
    products: products.payload,
    pagination: products,
    category: category,
    currentPage: currentPage
  };
  const html = Handlebars.compile(productsTemplate)(data);
  productsContainer.innerHTML = html;
}

function renderUser(user) {

  const data = {
    user: user
  };

  const html = Handlebars.compile(userTemplate)(data);

  const userContainer = document.getElementById("user-container");
  if (userContainer) {
    userContainer.innerHTML = html;
  }
}


function fetchProducts() {
  const url = `http://localhost:8080/api/products?limit=${limit}&page=${page}&sort=${sort}&category=${category}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data.payload);
      currentPage = data.page;
      renderProducts(data.payload);
    })
    .catch(error => console.error(error));
}

function changeLimit() {
  limit = parseInt(this.value);
  page = 1;
  fetchProducts();
}

function changeSort() {
  sort = this.value;
  page = 1;
  fetchProducts();
}

function filterByCategory() {
  category = this.getAttribute("data-category");
  page = 1;
  fetchProducts();
}

const limitSelect = document.getElementById("limit");
limitSelect.addEventListener("change", changeLimit);

const sortSelect = document.getElementById("sort");
sortSelect.addEventListener("change", changeSort);

const categoryLinks = document.querySelectorAll("[data-category]");
categoryLinks.forEach(link => {
  link.addEventListener("click", filterByCategory);
});

const user = JSON.parse(sessionStorage.getItem('user'));
if (user) {
  renderUser(user);
  console.log(user);
}

fetchProducts();