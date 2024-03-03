//signController.js

const { UserRefreshClient } = require('google-auth-library');
const User = require('../models/User');
const {OAuth2Client} = require('google-auth-library');

// class UserRepo {
//     constructor() {
//       this.users = new User();
//     }
  
//     async addUser(user) {
//       await this.users.insertOne(user);
//     }
//     async findUser(username) {
//       return await User.find({username});
//     }
//     async authenticateUser(username, password) {
//       return await this.users.findOne({username,password});
//     }
//     async updateProfile(username,password,email) {
//       const user = await this.users.findUser(username);
//       if(user && user.password === password) {
//         // user.avatar = avatar; 
//         user.email = email;
//         // await this.users.updateOne({username : username}, {$set: {avatar: avatar}});
//         await this.users.updateOne({username : username}, {$set: {email: email}});  
//         return true;
//       }
//       return false;
  
//     }
  
//   }
const userRepo = new UserRepo();
exports.init = async (req, res) => {
    res.redirect('/login');
 };

exports.signup = async (req, res) => {
    const { username, password} = req.body;


    try{
      const existUser = await User.findOne({username});
      if(existUser){
        res.status(400).send('User already exists');
      }else{
        const newUser = new User({username, password, email: ''});
        await newUser.save();
        res.status(200).send('User created');
      }
  
    }catch(err){
      console.error('Error in creating the user', err);
      res.status(400).send('Error in creating the user');
    }
};

exports.login = async (req, res) => {   
    const { username, password} = req.body;
    if(!username || !password) {
      res.status(400).send('Username and password are required');
    }
  
    if(idToken){
      // verify with the google singn-In token 
   
      const client = new OAuth2Client(CLIENT_ID);
      try {
          const ticket =  await client.verifyIdToken({
            idToken,
            audience: CLIENT_ID,  
          });
          const payload = ticket.getPayload();
          const userid = payload['sub'];
          const existUser = await User.findOne({username:userid});
          if(existUser){
            res.status(200).send('User authenticated');
          }else {
            res.status(400).send('Invalid username or password');
          }
        
      } catch (err) {
        console.error("erroe in verifying the token",err);
        res.status(400).send('Invalid google Sign-in Token');
      
      }
    }else{
      try{
        const user = await User.findOne({username,password});
      if(user) {
        res.status(200).send('User authenticated');
      } else if(!user){
        res.redirect('/signup');
  
      }else {
        res.status(400).send('Invalid username or password');
      }
      }catch(err){
        console.error('Error in authenticating the user', err);
        res.status(400).send('Error in authenticating the user');
      }
    }
    
};
exports.getProfile = async (req, res) => {  
  const userId = req.params.userId;
  try{
    const user = await User.findOne(userId);
    if(user) {
      res.status(200).send(user);
    } else {
      res.status(400).send('User not found');
    }
  }catch (err){
    console.error('Error in getting the user', err);
    res.status(400).send('Error in getting the user');
  }
};
exports.updateProfile = async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password) {
    res.status(400).send('Username and password are required');
  }
  try {
    const user = await User.findOne({ username });
    if (user && user.password === password) {
      user.email = email;
      await user.save();
      res.status(200).send('Profile updated');
    } else {
      res.status(400).send('Invalid username or password');
    }
  } catch (err) {
    console.error('Error in updating the profile', err);
    res.status(400).send('Error in updating the profile');
  }
};