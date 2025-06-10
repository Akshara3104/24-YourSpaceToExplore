# 24 - Your Space To Explore

*24* is a MERN-stack based career-focused social networking platform created for students aged 14 and above. It’s a space where young minds can connect beyond STEM, explore career interests, join niche communities, and get mentorship from experienced professionals.

---


## Live demo

https://24-your-space-to-explore.vercel.app

## 🌟 Features

* ### User Profiles
  Create personal profiles including career interests, bio, and more.

* ### Community Building
  Join or explore communities based on career paths.

* ### Mentorship & Messaging
  Chat with mentors and peers directly through an integrated messaging system.

* ### Post, Like & Comment
  Share your thoughts, experiences, and engage with the community.

* ### Search Functionality
  Search users and communities with ease.

* ### Modern UI Design
  Clean and user-friendly design, built for large screens.

* ### Cloudinary Integration
  All images (including profile pictures and post images) are hosted securely on [Cloudinary](https://cloudinary.com/).

---

## ⚙ How to Clone & Run This Project Locally

### Prerequisites

* Node.js
* MongoDB (local or cloud instance)
* Git
* .env file (see below for required environment variables)

### 1. Clone the Repository

bash
git clone https://github.com/AbhiVardhan020/24-YourSpaceToExplore
cd 24-YourSpaceToExplore


### 2. Install Dependencies

bash
# For backend
cd backend
npm install

# For frontend
cd ../frontend
npm install


### 3. Environment Variables

Create a .env file in the frontend folder with the following variables:

bash
REACT_APP_BACKEND_URL = http://localhost:3001
REACT_APP_CLOUDINARY_API = your_api_key
REACT_APP_CLOUD_NAME = your_cloudinary_cloud_name


Create a .env file in the backend folder with the following variables:

bash
MONGODB_URL = your_mongodb_url



### 4. Run the Project

bash
# In one terminal for frontend
cd frontend
npm start

# In another terminal for backend
cd backend
npm start


### 5. Visit the App

Open your browser and go to:
http://localhost:3000

---

## ⚠ Notes

* The website is *designed only for large screens* (PCs, laptops).
* Mobile and tablet responsiveness is not supported at the moment.

---

## 📸 Image Hosting

All user-uploaded images, profile pictures, and post media are stored on *Cloudinary* to ensure fast and reliable image delivery.

---

## 📬 Contributing

Contributions are welcome! Feel free to open issues or submit PRs to improve the platform.

---

## 📄 License

This project is licensed under the MIT License.

---

Feel free to reach out if you’re interested in collaborating or contributing to the growth of 24!

---

*24 - Your Space To Explore* 🌐
