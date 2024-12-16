const bcrypt = require("bcrypt");
const saltRounds = 10;

const hashPW = async (pw) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(pw, salt);
  console.log(salt);
  console.log(hash);
};
const login = async (pw, hash) => {
  bcrypt.compare(pw, hash).then((res) => {
    if (res) {
      console.log("welcome");
    } else {
      console.log("password incorrect");
    }
  });
};
// hashPW("kucing");
login("kucing", "$2b$10$9fZo/eWH5r1/.km6zHb/e.q/I1t/U..pBQ7HLClF0XacdwnRjKAXy");
