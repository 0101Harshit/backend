import express from "express";
import expressAsyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import { isAuth } from "../utils.js";

const productRouter = express.Router();

productRouter.get("/", isAuth, async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

productRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newProduct = new Product({
      name: 'sample name ' + Date.now(),
      slug: 'sample-name-' + Date.now(),
      image: '/images/p1.jpg',
      price: 0,
      category: 'sample category',
      brand: 'sample brand',
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description: 'sample description',
    });
    const product = await newProduct.save();
    res.send({ message: 'Product Created', product });
  })
);

productRouter.get('/category/products', isAuth, expressAsyncHandler(async (req, res) => {
  const { query } = req;

  const category = query.category || '';

  const categoryFilter = category && category !== 'all' ? { category: category } : {};

  const products = await Product.find({ ...categoryFilter })
  res.send(products);

}))

productRouter.get(
  '/categories', isAuth,
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('brand');
    res.send(categories);
  })
);

productRouter.get("/:id", isAuth, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Product Not Found" });
  }
});

export default productRouter;
