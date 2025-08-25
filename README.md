<img width="1000" alt="bluebox" src="https://github.com/user-attachments/assets/91b09535-1171-41c1-9c8b-680cf375360f" />

![TypeScript](https://img.shields.io/badge/typescript-%233178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2361DAFB.svg?style=for-the-badge&logo=react&logoColor=white)
![Next.js](https://img.shields.io/badge/next.js-%23000000.svg?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Bootstrap](https://img.shields.io/badge/bootstrap-%237952B3.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
![Sass](https://img.shields.io/badge/sass-%23CC6699.svg?style=for-the-badge&logo=sass&logoColor=white)
![MongoDB](https://img.shields.io/badge/mongodb-%2347A248.svg?style=for-the-badge&logo=mongodb&logoColor=white)

# Description
Bluebox is a self hostable file hosting site/service, which doesn't require emails, passwords or any other PII (Personally Identifiable Information). You register by completing a POW captcha and the server will generate a unique secret ID for you which will be used to authenticate you. The project also has Altcha POW captcha integration to prevent bots from mass registering account.

**TLDR: Bluebox is like pastebin, but for files**

## What makes this project unique?
- **No PII.** 
- **It's intended to upload files publicly, not to be accessed via some private link or only by the uploader.**
- **No access logs. No activity logs. No registration logs. Nothing**

## Roadmap
- [x] **Basic features (upload, download, login, logout, register, delete account)**
- [x] **Admin account and it's basic features (banning, deleting files etc)**
- [ ] **Admin can change max upload size and max amount of files per acco**
- [x] **Admin can change captcha hardness level**
- [x] **Admin can make downloads require captcha**
- [x] **Paged results**
- [ ] **2FA**
- [ ] **Comments**
- [ ] **Likes**
- [ ] **Sorting**
- [ ] **Searching**
- [ ] **Public profiles? (would harm anonymity)**

## Installation/Usage
1. Set up mongo db
```bash
docker run --name bluebox-mongo -d -p 27017:27017 mongo:latest mongod --replSet rs
docker exec -d bluebox-mongo mongosh --eval "rs.initiate({_id: 'rs', members: [{_id: 0, host: 'localhost:27017'}]})"
```

2. Set up bluebox
```bash
git clone https://github.com/varppi/bluebox
cd bluebox
npm i
npm run build
npm run start
```

3. Visit http://127.0.0.1:3000

## Configuration
**The following variables should be defined in your .env file:**
- **DATABASE_URL:** Point this to your MongoDB instance. eg. `DATABASE_URL="mongodb://localhost:27017/bluebox"`
- **JWT_SECRET:** Secret used to sign JWT tokens for users. eg. `JWT_SECRET="hf82gmalg92hgmam8vjsb2ngam"`
- **DEBUG:** Wether to send back error messages or not. Please disable in production. eg. `DEBUG=true` / `DEBUG=false`
- **MAX_RESULTS_PER_PAGE:** Maximum files shown per page in the file repository site. eg. `MAX_RESULTS_PER_PAGE=5`
- **ADMIN_ID:** If you want to moderate the site you can do it by setting this to your user id. (found by copy pasting your session token into jwt.io and getting the 'id' field). eg. `ADMIN_ID="4004591c-22ce-4569-805f-15fa7799ea37"`
- **MASTER_PASSWORD:** Sets a master password everyone who tries to register must have. Prevents random people from signing up. eg. `MASTER_PASSWORD="helloworld"`
- **DEFAULT_THEME:** Default theme for users. eg. `DEFAULT_THEME=light` or `dark`
- **DOWNLOAD_CAPTCHA:** Enable or disable needing to complete a captcha before downloading a file. eg. `DOWNLOAD_CAPTCHA=true` or `false`
- **CAPTCHA_DIFFICULTY:** Changes how long the captcha takes. The bigger the number, the more time it will take. eg. `CAPTCHA_DIFFICULTY=500000`

## Security
I have fixed all the bugs I could, but the nature of this project makes it inherently more susceptible to security vulnerabilities. With that being said, I created the whole project with the idea of "I'm going to make a file hosting service that stores so little information it won't matter if it's breached" so please treat the service as compromised from the beginning, because that's a sure way you can avoid getting anything of value leaked. It is **NOT** a cloud backup service, it is **NOT** a personal file vault, it is a gateway to get whatever you have on your computer in front of the entire internet. 
