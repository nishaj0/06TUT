const userDB = {
   users: require("../model/users.json"),
   setUsers: function (data) {
      this.users = data;
   },
};

const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
   const { user, pwd } = req.body;
   if (!user || !pwd) {
      return res
         .status(400)
         .json({ message: "Username and password are required" });
   }
   // check for duplicate usernames in the db
   const duplicate = userDB.users.find((person) => person.username === user);
   if (duplicate) return res.sendStatus(409); //Conflict
   try {
      //encrypt the password
      const hashPwd = await bcrypt.hash(pwd, 10);
      //store the new user
      const newUser = { userName: user, password: hashPwd };
      userDB.setUsers([...userDB.users, newUser]);
      await fsPromises.writeFile(
         path.join(__dirname, "..", "model", "users.json"),
         JSON.stringify(userDB.users)
      );
      console.log(userDB.user)
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};
