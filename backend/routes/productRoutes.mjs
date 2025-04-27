import express from 'express';
import { addProduct,getAllProducts,deleteProduct, updateProduct  } from '../controller/productController.mjs';
import { uploadImage } from '../Middleware/upload.mjs';

const router = express.Router();

router.get('/', getAllProducts);
router.post('/add', uploadImage, addProduct);
// DELETE product by ID
router.delete('/:id', deleteProduct);

// PUT/UPDATE product by ID
router.put('/:id', uploadImage, updateProduct);


export default router;