# Blogging Website for mini project (Group 5)
**concept:** Just like Youtube but instead of videos user watch or upload Blogs/articles  
> If you dont know git please learn git and how to contribute to git porjects  

Before forking the repository:  

1. Downlaod [Nodejs](https://nodejs.org/en/download/current)  and [vscode](https://code.visualstudio.com/download)  as well as [git](https://git-scm.com/downloads)  
2. After donwnloading Nodejs, vscode & git,  fork the repository  
3. git clone your  forked repository  
4. cd to the cloned repository through cmd and type ". code" this will open the vs code  
5. type "npm install" to install the required modules

Team members:
- PAYEL DEBBARMA
- PREETI JAMATIA
- MOU DEBNATH
- SAHIL DEBBARMA
- SACHALANG DEBBARMA
- SEASON DEBBARM
- RAJDEEP DEBBARMA
  
# User Table  
`CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`

# blog table
`CREATE TABLE Blog (
    blog_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    thumbnail VARCHAR(255),
    content TEXT,
    user_id INT,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    thumbnail_path VARCHAR(255),
    username VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
`

