export const generateUserErrorInfo = (user) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * first_name: needs to be a String, received ${user.first_name}
    * last_name: needs to be a String, received ${user.last_name}
    * email: needs to be a String, received ${user.email}`;
  }
  
  export const generateProductErrorInfo = (product) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * title: needs to be a String, received ${product.title}
    * description: needs to be a String, received ${product.description}
    * price: needs to be a Number, received ${product.price}
    * thumbnail: needs to be a String, received ${product.thumbnail}
    * code: needs to be a String, received ${product.code}
    * stock: needs to be a Number, received ${product.stock}
    * category: needs to be a String, received ${product.category}`;
  };
  
  
  export const generateCartErrorInfo = (cart) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * products: needs to be an Array of objects with the following structure:
      - product: needs to be an ObjectId referencing 'products', received ${cart.products.product}
      - quantity: needs to be a Number, received ${cart.products.quantity}`;
  };
  
  export const generateTicketErrorInfo = (ticket) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * code: needs to be a String, received ${ticket.code}
    * purchase_datetime: needs to be a Date, received ${ticket.purchase_datetime}
    * amount: needs to be a Number, received ${ticket.amount}
    * purchaser: needs to be a String, received ${ticket.purchaser}`;
  };