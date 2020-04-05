# Starting Mongo DB
```
mongod --dbpath=data --bind_ip 127.0.0.1
```

# Exercise: REST API with Express, MongoDB, and Mongoose Part 1
```
npm install mongoose@5.8.7 mongoose-currency@0.2.0
```

# Exercise: Express Sessions Part 1
npm i is shorthand for npm install
```
npm i express-session@1.17.0 session-file-store@1.4.0
```

# Exercise: User Authentication with Passport
```
npm i passport@0.4.1 passport-local@1.0.0 passport-local-mongoose@6.0.1
```

# Exercise: User Authentication with Passport and JSON Web Token
```
npm i passport-jwt@4.0.0 jsonwebtoken@8.5.1
```

# Mongo setup Admin User
```
db.users.update({"username": "admin"}, {$set: {"admin": true}});
```

# Exercise: Uploading Files
```
npm install multer@1.4.2
```

# Exercise: Cross Origin Resource Sharing
```
npm install cors@2.8.5
```

# Exercise: Using OAuth with Passport and Facebook
```
npm i passport-facebook-token@3.3.0
```

# Database Commands
```
db.favorites.find( {_id: ObjectId("5e889c981c8bb6f613e4c09a")}).pretty();
db.favorites.remove( {_id: ObjectId("5e889c981c8bb6f613e4c09a")})

```