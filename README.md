<a id="top"></a>
<div style="display:none;" align="center">
<h1><font size="10"> Style Share </font></h1>

<!-- repo intro -->

</div>
<div align="center">

<h3><font size="4">A simple web-based platform where users can easily create, explore, and share Tailwind CSS components and designs with fellow users.</h3>
<br>
Make sure you star the repository and show your love to us💗
</font>
<br>
<br>
 
</div>

<details>
    <summary><h2>:pushpin:Table of Contents: </h2></summary>


1. [Project Description](#project-description)
2. [TechStack](#techstack)
3. [Screenshots](#screenshots)
4. [Code of Conduct](#code-of-conduct)
5. [Setting Up on your machine](#setting-up-on-your-machine)
6. [License](#license)

</details>
<hr>

## Project Description

Style Share is a collaborative platform designed to streamline the process of creating and sharing Tailwind CSS components. Users can explore a wide range of design components created by the community, contribute their own, and engage with fellow designers and developers to enhance their web development projects.

## TechStack

- TypeScript
- Express
- React
- Recoil
- Prisma + MongoDB
- Tailwind

<hr>

<details>
    <summary><h2>📷 Screenshots: </h2></summary>
    
![alt text](./screenshots/Screenshot_home.png)
![alt text](./screenshots/Screenshot_aboutus.png)
![alt text](./screenshots/Screenshot_signup.png)
![alt text](./screenshots/Screenshot_signin.png)
![alt text](./screenshots/Screenshot_posts.png)
![alt text](./screenshots/Screenshot_codeeditor.png)
![alt text](./screenshots/Screenshot_newpost.png)
![alt text](./screenshots/Screenshot_leaderboard.png)
![alt text](./screenshots/Screenshot_profile.png)
![alt text](./screenshots/Screenshot_faqs.png)
![alt text](./screenshots/Screenshot_favourites.png)
![alt text](./screenshots/Screenshot_footer.png)

</details>


 
## Setting Up on your machine

1. Go to the backend folder and create a .env file similar to [.env.example](https://github.com/VaibhavArora314/StyleShare/blob/main/backend/.env.example)

 <h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; setup .env file</h4>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; I. `DATABASE_URL="mongodb+srv://<username>:<password>@<cluster-name>/syleshare"` (replace `<username>`, `<password>`, and `<cluster-name>` with your actual MongoDB credentials)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; II. `JWT_SECRET="secret"`

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; III. `PORT=3001`

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; IV. `EMAIL_USER=example@gmail.com` (replace with your actual email address)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; V. `EMAIL_PASS=lmkgpafolrjudvpc` (16-digit password generated in Google, change this with yours)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; VI. `SEND_EMAIL=true` (If you set it true ,you can able to send email otherwise it wont send)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; VII. `API_KEY="your google gemini api key"` (replace with your actual Google Gemini API key)

 <h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; For getting EMAIL_PASS</h4>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; I.[EMAIL_PASS Generation video link](https://www.youtube.com/watch?v=MkLX85XU5rU&t=116s&ab_channel=HarishBhathee)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; II.Remove spaces and add the password

2. Run the following commands in the backend folder

   ```sh
   npm install
   npm run build
   npm run dev
   ```

   The npm run build cmd will handle the Prisma migrations, and also build the frontend folder which will be served by the express server.

   Possible Problems:

   - Prisma may give error for MongoDB replica set, in such case use Mongodb atlas for the database instead of the local database or start a Mongo docker container with the replica set.

3. In case you are modifying the frontend and you want hot module reloading, then run the following commands in the frontend directory
   ```sh
   npm install
   npm run dev
   ```
   Also, set the default base URL of the backend (don't push this to GitHub) or simply uncomment the following:
   [App.tsx lines 17-18](https://github.com/VaibhavArora314/StyleShare/blob/ffb31d5bd3f68fbd76b300a736d56c2a0f1f77ac/frontend/src/App.tsx#L17-L18)

<hr>

<details>
 <summary><h2>:sparkles:How to Contribute</h2></summary>
    

We welcome contributions from the community! To contribute:

1. Fork the repository.
2. Clone the repository.
   ```sh
   git clone https://github.com/VaibhavArora314/StyleShare.git
   ```
3. Create a new branch.
   ```sh
   git checkout -b your-branch-name
   ```
4. Make your changes.
5. Commit your changes.
   ```sh
   git commit -m 'Add some feature'
   ```
6. Push to the branch.
   ```sh
   git push origin your-branch-name
   ```
7. Open a pull request.

</details>

<hr>


 
</div>

<hr>
<!-- License -->
<div>
<h2><img src = "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Page%20with%20Curl.png" width="35" height="35"> License:</h2>
</div>

This project is licensed under the MIT License. See the [LICENSE](https://github.com/VaibhavArora314/StyleShare/blob/main/LICENSE) file for more details.

<hr>
<div>
  Don't forget to leave a star<img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f31f/512.webp" width="35" height="30"> for this project!
</div> <br>

<a href="#top" style="position: fixed; bottom: 20px; right: 20px; background-color: black ; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; font-family: Arial; font-size: 16px;">Go to Top</a>
