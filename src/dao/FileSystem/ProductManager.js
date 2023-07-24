import fs from 'fs';

export class ProductManager {
  constructor(path) {
    this.path = path;
    ProductManager.initFile(this.path);
  }

  async establecerID() {
    this.products = JSON.parse(await fs.promises.readFile(`${this.path}`, 'utf-8'));
    if(this.products.length === 0) {
        return 1;
    } else {
        let nextId = Math.max(...this.products.map(product => product.id)) + 1; 
        return nextId;
    }
  }

  static initFile(path) {
    if(!fs.existsSync(path)){
      fs.writeFileSync(`${path}`, JSON.stringify([]));
    }
  }

  async addProduct(product) {

    this.products = JSON.parse(await fs.promises.readFile(`${this.path}`, 'utf-8'));
    const id = await this.establecerID();
    product = {id, ...product};

    this.products = [...this.products, product];

    await fs.promises.writeFile(`${this.path}`, JSON.stringify(this.products));
    return "Producto creado satisfactoriamente";
  }

  async getProducts() {

    try {
      this.products = JSON.parse(await fs.promises.readFile(`${this.path}`, 'utf-8'));
      return this.products;
    } catch (error) {
      return error.message;
    }
  }

  async getProductById(id) {

    this.products = JSON.parse(await fs.promises.readFile(`${this.path}`, 'utf-8'));
    const product = this.products.find(product => product.id === parseInt(id)) || 'Product not found';
    return product;
  }

  async updateProduct(id, fields) {

    this.products = JSON.parse(await fs.promises.readFile(`${this.path}`, 'utf-8'));

    if(this.products.some(product => product.id === parseInt(id))){
      let index = this.products.findIndex(product => product.id === parseInt(id));
      this.products[index].title = fields.title
      this.products[index].description = fields.description
      this.products[index].price = fields.price
      this.products[index].thumbnail = fields.thumbnail
      this.products[index].code = fields.code
      this.products[index].stock = fields.stock
      this.products[index].status = fields.status
      this.products[index].category = fields.category
      await fs.promises.writeFile(`${this.path}`, JSON.stringify(this.products));
      return 'Producto actualizado';
    }else{
      return 'Producto no encontrado';
    }
  }

  async deleteProduct(id) {
    this.products = JSON.parse(await fs.promises.readFile(`${this.path}`, 'utf-8'));
    if (this.products.some(product => product.id === parseInt(id))) {
      this.products = this.products.filter(product => product.id !== parseInt(id));
      await fs.promises.writeFile(`${this.path}`, JSON.stringify(this.products));
      return 'Producto eliminado';
    } else {
      return 'Producto no encontrado';
    }
  }
}