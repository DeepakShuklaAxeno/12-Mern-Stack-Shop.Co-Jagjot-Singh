# 12-Mern-Stack-Shop.Co-Jagjot-Singh
Shop.co MERN stack variant with full functionality and categories page.

## Backend API

The backend is an Express/Mongoose REST API mounted at `/api`.

- `POST /auth/signup`, `POST /auth/login`, `POST /auth/logout`
- `GET /auth/me`, `PATCH /auth/profile` (authenticated)
- `GET /products`, `GET /products/:productId`
- `GET /categories`, `GET /categories/:categoryId`
- `GET /cart`, `POST /cart/items`, `PATCH /cart/items/:itemId`, `DELETE /cart/items/:itemId`, `DELETE /cart`
- `POST /cart/coupon` with `WELCOME10` or `SALE20`
- `POST /orders/checkout`, `GET /orders`, `GET /orders/:orderId` (authenticated)
- `GET /admin/dashboard`, product/category CRUD, and order status updates (admin only)

Product search and filtering are handled by MongoDB through `/products` query parameters:
`search`, `category`, `minPrice`, `maxPrice`, `availability`, `sort`, `page`, and `limit`.

Inventory is validated on the cart and checkout endpoints. Checkout recalculates prices from MongoDB, atomically reduces stock, creates the order, and clears the cart. Products with `stockQuantity <= 5` are reported as low stock in the admin dashboard.

Set `MONGO_CONSTRING`, `JWT_SECRET`, `PORT`, `UI_BASE_URL`, and `NODE_ENV` in `backend/.env`. Never commit real database credentials or JWT secrets; use `backend/.env.example` as the template.
