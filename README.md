# Building 404 Gamers - A Modern Game Store Web Application 🎮

Hey Dev Community! 👋

I’m excited to share my latest project, **404 Gamers**, a modern and responsive web application designed for gamers to browse, discover, and purchase their favorite games. This project was a fantastic opportunity to dive deeper into **React**, **Next.js**, and **Tailwind CSS**, while integrating real-world APIs and implementing advanced features.

## 🛠️ What is 404 Gamers?
404 Gamers is a game store web application that provides users with a seamless experience to explore games, add them to their cart or wishlist, and view detailed information about each game. The app is designed to be fast, responsive, and visually engaging, catering to both casual and hardcore gamers.

## 🌟 Key Features

### Dynamic Landing Page
- Engaging hero section with a carousel of trending games.
- Featured games grid showcasing popular titles.
- Promotional banners for special offers and discounts.

### Game Browsing
- Filter and search games by genre, platform, and popularity.
- Real-time data integration using the RAWG Game Database API.

### Game Details Page
- Comprehensive game information, including images, descriptions, pricing, and platform details.
- "Add to Cart" and "Add to Wishlist" functionality.

### Cart & Wishlist
- Persistent cart and wishlist system using localStorage.
- Real-time updates with React Context API.

### Responsive Design
- Fully optimized for desktop, tablet, and mobile devices.
- Clean and modern UI built with Tailwind CSS.

### Performance Optimization
- Lazy loading for images and components.
- Responsive images for better performance across devices.
- Core Web Vitals improvements for a smooth user experience.

## 💻 Tech Stack
- **Frontend**: React, Next.js, Tailwind CSS
- **State Management**: React Context API
- **API Integration**: RAWG Game Database API
- **Tools**: Git, VS Code, Figma for UI/UX design

## 🚀 Challenges Faced
- **Hydration Errors**: Handling server-side rendering (SSR) with client-side localStorage was tricky. I resolved this by adding an isLoaded state to ensure localStorage data was only accessed on the client side.
  
- **Responsive Design**: Ensuring the app looked great on all devices required careful planning and testing, especially for complex components like the hero carousel and game grids.

- **Performance Optimization**: Balancing high-quality visuals with fast load times was a challenge. I used lazy loading and responsive images to improve performance.

## 🎉 What I Learned
- **Next.js**: Leveraging SSR and client-side rendering for better performance and SEO.
- **State Management**: Using React Context API to manage cart and wishlist functionality.
- **API Integration**: Fetching and displaying real-time data from the RAWG API.
- **Responsive Design**: Building a mobile-first design with Tailwind CSS.
- **Performance Optimization**: Techniques to improve Core Web Vitals and overall app speed.

## 🔗 Check It Out
I’m proud of how this project turned out and would love to hear your feedback! Feel free to reach out if you have any questions or suggestions. 😊

Let’s connect and build something awesome together! 🚀
