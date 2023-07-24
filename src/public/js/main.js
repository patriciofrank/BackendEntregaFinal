const socket = io();
const productForm = document.getElementById('productForm');
const url = 'http://localhost:8080/api/products'

socket.emit('mensaje', "Hola me estoy conectando")

socket.on('evento-admin', datos => {
  console.log(datos)
})

socket.on('ListProducts', products => {
  document.getElementById('realTimeProductsContainer').innerHTML = updateList(products);
});

updateList = (products) => {
  const realTimeProductsTemplate = `
  <div id="realTimeProducts-template" type="text/x-handlebars-template" class="table-responsive">
    <table class="table table-hover align-middle">
      <thead>
        <tr>
          <th scope="col">Id</th>
          <th scope="col">Title</th>
          <th scope="col">Description</th>
          <th scope="col">Price</th>
          <th scope="col">Thumbnail</th>
          <th scope="col">Code</th>
          <th scope="col">Stock</th>
          <th scope="col">Status</th>
          <th scope="col">Category</th>
          <th scope="col">Eliminar</th>
        </tr>
      </thead>
      <tbody>
        {{#each productsReal}}
        <tr>
          <th scope="row">{{id}}</th>
          <td>{{title}}</td>
          <td>{{description}}</td>
          <td>{{price}}</td>
          <td>
            <div class="sizeThumbnails text-break">{{thumbnail}}</div>
          </td>
          <td>{{code}}</td>
          <td>{{stock}}</td>
          <td>{{status}}</td>
          <td>{{category}}</td>
          <td>
          {{deleteProduct id}}
          </td>
        </tr>
        {{/each}}
      </tbody>
    </table>
  </div>
  `
  let template = Handlebars.compile(realTimeProductsTemplate);
  let html = template({ productsReal: products });
  return html;
};

productForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const { title, description, price, thumbnail, code, stock, status, category } = event.target
  addProduct({
    title: title.value,
    description: description.value,
    price: price.value,
    thumbnail: thumbnail.value,
    code: code.value,
    stock: stock.value,
    status: true,
    category: category.value,
  })
})

addProduct = ({ title, description, price, thumbnail, code, stock, status, category }) => {

  const newProduct = { title, description, price, thumbnail, code, stock, status, category };

  fetch("http://localhost:8080/api/products", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newProduct),
  })
  .then((res) => {
    socket.emit('addProduct');
    productForm.reset();
  })
  .catch((error) => {
    console.error(error);
  });
};
  

Handlebars.registerHelper('deleteProduct', function(id) {
  return new Handlebars.SafeString(
    "<button class='btn btn-danger' onClick='deleteProduct(\"" + id + "\")'>Eliminar</button>"
  );
});

deleteProduct = (id) => {
  fetch(`http://localhost:8080/api/products/${id}`, {
    method: 'DELETE',
  })
  .then((res) => {
    socket.emit('deleteProduct');
    console.log(`Producto ${id} eliminado`);
  })
  .catch((error) => {
    console.error(error);
  });
}