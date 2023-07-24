// import  {faker} from "faker"

// const createRandomProducts = () => {
//   return {
//       // id: faker.string.uuid(),
//       title: faker.commerce.product(),
//       description: faker.commerce.productDescription(),
//       price: faker.number.float({ min: 1, max: 1000000, precision: 0.01 }),
//       thumbnail: faker.image.urlLoremFlickr({ category: 'fashion' }),
//       code: faker.string.nanoid(10),
//       stock: faker.number.int({ min: 0, max: 100 }),
//       status: faker.datatype.boolean({ probability: 0.8 }),
//       category: faker.commerce.department()
//   };
// }

// export const productsMocks = faker.helpers.multiple(createRandomProducts, {
//   count: 100,  //Cantidad a generar
// });