# **Telejkam Fullstack E-Commerce Store**

This project is a full-stack e-commerce store called "Telejkam". It consists of a customer-facing website and an admin dashboard. The project utilizes various technologies and features to provide a comprehensive e-commerce experience.

Technologies Used:

- NextJS / Next Auth: NextJS is a React framework used for server-side rendering and building web applications. Next Auth is a library for handling authentication in NextJS applications.
- React / Redux Toolkit: React is a JavaScript library for building user interfaces. Redux Toolkit is a library that simplifies state management in React applications.
- SASS: SASS is a CSS preprocessor that extends the capabilities of CSS with features like variables, mixins, and nesting.
- Material UI (MUI): Material UI is a popular React UI framework that provides pre-designed components following the Material Design guidelines.
- Formik: Formik is a library for building forms in React applications. It simplifies form handling, validation, and submission.
- MongoDB: MongoDB is a NoSQL database used for storing and retrieving data in this project.

Key Features:

1. Authentication Management: The project uses Next Auth to manage authentication. Users can create accounts with custom passwords or log in using various providers such as Github, Facebook, Google, Twitter, Auth0, etc. It also supports password recovery by automatically sending reset password emails using Nodemailer.

2. Product Management: The project allows the management of products with multiple variants. Products can be categorized based on size and color. Each variant includes information about promotions, prices, and different images.

3. Cart Management: The project utilizes Redux Toolkit to manage the shopping cart. Users can add products with selected size and color directly to the cart.

4. Payment Integration: The project supports online payments through Paypal and Credit Card, which is facilitated by Stripe.

5. Admin Dashboard: The admin page provides CRUD operations for managing products, categories, users, and coupons.

6. Responsive Design: The website is designed to be responsive and optimized for various devices, ensuring a seamless user experience.

In addition to these features, the project includes various pages with specific functionalities:

- Homepage: Includes a banner using SwiperJS and a flash sale section with a countdown timer.
- Single Product Page: Displays detailed information about a product, including different variants and zoomable images.
- Cart Page: Allows CRUD operations on the shopping cart.
- Checkout Page: Enables users to add multiple addresses and choose a payment method (Paypal, Credit Card, or Pay on Cash).
- Profile Page: Allows users to edit their profile, view order details, select a default payment method and shipping address.
- Filter & Sort Page: Provides filtering and sorting options for products based on categories, colors, sizes, attributes, shipping options, etc.
- Authentication Page: Allows users to register and log in to their accounts. Supports login with various providers and password recovery via email.
- Admin Dashboard: Provides an interface for managing products, categories, and other administrative tasks.

Overall, this project aims to deliver a feature-rich e-commerce store with a user-friendly interface, efficient authentication, and seamless shopping experience.
