import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  email: {
    type: String,
    unique: [true, 'Email already exists!'],
    required: [true, 'Email is required!'],
  },
  username: {
    type: String,
    required: [true, 'Username is required!'],
  },
  image: {
    type: String,
  },
  college: {
    type: String,
    required: [true, 'Email is required!'],
  },
  number: {
    type: String
  },
  bio: {
    type: String
  }

});

const User = models.User || model("User", UserSchema);

export default User;