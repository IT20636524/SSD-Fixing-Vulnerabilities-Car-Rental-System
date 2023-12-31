const router = require("express").Router();
// const jwtoken = require("./jwt");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const sendTokenResponse = async (res, user, message) => {
  const accessToken = generateToken(user)

  res.status(200).json({
    data: { user, access_token: accessToken },
    message
  })
}


const generateToken = (user) => {
  return jwt.sign({ data: user }, process.env.JWT_SECRET || 'jsecret', {
    expiresIn: `30d`
  })
}

const decodeJwtToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'jsecret')
}

//Register
router.post("/register", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  //vulnerability-if password is empty hash value will generate
  //vulnerability-if password is undefined results in internal server error
  if (req.body.password === undefined || req.body.password === "") {
    return res.status(400).json({ message: "Password is required!" });
  }
  const hashedPass = await bcrypt.hash(req.body.password, salt);
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPass,
    profile_pic: req.body.profile_pic,
  });
  try {
    const usercount = await User.count();
    newUser.user_id = "U00" + (parseInt(usercount) + 1);
    try {
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (err) {
      if (err.code === 11000) {
        res.status(409).json({ message: "Email already exists!" });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/validate", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (user) {
      const validated = user.firebase_uid === req.body.firebase_uid
      if (!validated) {
        res.status(400).json("Authentication Failed!")
      } else {
        const { password, ...others } = user._doc;
        sendTokenResponse(res, others, 'successful')
      }
    }
    else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        profile_pic: req.body.profile_pic,
        firebase_uid: req.body.firebase_uid,
      });
      try {
        const lastUserDocument = await User.find().sort({ _id: -1 }).limit(1);
        newUser.user_id = "U00" + (Number(lastUserDocument[0].user_id.slice(3)) + 1);
        try {
          const savedUser = await newUser.save();
          const { password, ...others } = savedUser
          sendTokenResponse(res, others, 'successful')
        } catch (err) {
          res.status(err.code).json("Unable to create an account");
        }
      } catch (err) {
        console.log(err);
      }
    }
  } catch (error) {
    res.status(error.code).json({ message: "We couldn't serve your request. Please try again later!" })
  }
})


//Login
router.post("/login", async (req, res) => {
  // console.log(req);
  try {
    //fixing NoSQL injection
    // const user = await User.findOne({ email : req.body.email})
    let query = { email: req.body.email.toString() };
    const user = await User.findOne(query)

    console.log(req.body.password);
    if (!user) {

      res.status(400).json("Wrong credentials")
    } else {

      const validated = await bcrypt.compare(req.body.password, user.password)
      // !validated && res.status(400).json("Wrong credentials")
      if (!validated) {

        res.status(400).json("Wrong credentials")
      } else {

        const { password, ...others } = user._doc;
        console.log(others)
        sendTokenResponse(res, others, 'successful')
        // res.status(200).json(res, others);
      }

    }

  } catch (err) {
    res.status(500).json(err)
  }
});

//Get users
router.get("/:user_id", async (req, res) => {
  try {
    const user = await User.findOne({ 'user_id': req.params.user_id });
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

//JWT
// const users = [
//     {
//       id: "1",
//       email: "john@test.com",
//       password: "John0908",
//       isAdmin: true,
//     },
//     {
//       id: "2",
//       email: "jane@test.com",
//       password: "Jane0908",
//       isAdmin: false,
//     },
//   ];

//   let refreshTokens = [];

//   router.post("/api/refresh", (req, res) => {
//     //take the refresh token from the user
//     const refreshToken = req.body.token;

//     //send error if there is no token or it's invalid
//     if (!refreshToken) return res.status(401).json("You are not authenticated!");
//     if (!refreshTokens.includes(refreshToken)) {
//       return res.status(403).json("Refresh token is not valid!");
//     }
//     jwt.verify(refreshToken, "myRefreshSecretKey", (err, user) => {
//       err && console.log(err);
//       refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

//       const newAccessToken = generateAccessToken(user);
//       const newRefreshToken = generateRefreshToken(user);

//       refreshTokens.push(newRefreshToken);

//       res.status(200).json({
//         accessToken: newAccessToken,
//         refreshToken: newRefreshToken,
//       });
//     });

//     //if everything is ok, create new access token, refresh token and send to user
//   });

//   const generateAccessToken = (user) => {
//     return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, "mySecretKey", {
//       expiresIn: "5s",
//     });
//   };

//   const generateRefreshToken = (user) => {
//     return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, "myRefreshSecretKey");
//   };

//   router.post("/api/login", (req, res) => {
//     const { email, password } = req.body;
//     const user = users.find((u) => {
//       return u.email === email && u.password === password;
//     });
//     if (user) {
//       //Generate an access token
//       const accessToken = generateAccessToken(user);
//       const refreshToken = generateRefreshToken(user);
//       refreshTokens.push(refreshToken);
//       res.json({
//         email: user.email,
//         isAdmin: user.isAdmin,
//         accessToken,
//         refreshToken,
//       });
//     } else {
//       res.status(400).json("Email or password incorrect!");
//     }
//   });

//   const verify = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (authHeader) {
//       const token = authHeader.split(" ")[1];

//       jwt.verify(token, "mySecretKey", (err, user) => {
//         if (err) {
//           return res.status(403).json("Token is not valid!");
//         }

//         req.user = user;
//         next();
//       });
//     } else {
//       res.status(401).json("You are not authenticated!");
//     }
//   };

//   router.delete("/api/users/:userId", verify, (req, res) => {
//     if (req.user.id === req.params.userId || req.user.isAdmin) {
//       res.status(200).json("User has been deleted.");
//     } else {
//       res.status(403).json("You are not allowed to delete this user!");
//     }
//   });

//   router.post("/api/logout", verify, (req, res) => {
//     const refreshToken = req.body.token;
//     refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
//     res.status(200).json("You logged out successfully.");
//   });

module.exports = router;