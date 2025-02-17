import bcrypt from "bcrypt";
import { isEmail, isMobilePhone, isURL, isStrongPassword } from "validator";
import { Schema, model, Error as MongoError } from "mongoose";
import { IUser } from "../interfaces/entities";

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, "Username required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password required"],
    validate: [
      (str: string) =>
        isStrongPassword(str, {
          minLength: 8,
          minUppercase: 1,
          minLowercase: 1,
          minSymbols: 1,
          minNumbers: 1,
          returnScore: false,
        }),
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one symbol",
    ],
  },
  salt: {
    type: String,
  },
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Email required"],
    unique: true,
    validate: [isEmail, "Invalid email"],
  },
  birthdate: {
    type: Date,
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
    validate: [isMobilePhone, "Invalid phone number"],
  },
  profile_img: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    validate: isURL,
  },
  rating: { type: Number },
  address: { type: String },
  preferences: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  new_user: { type: Boolean, default: true },
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      timestamps: true,
      toJSON: { virtuals: true },
    },
  ],
  events: [
    {
      type: Schema.Types.ObjectId,
      ref: "Event",
      timestamps: true,
    },
  ],
});

UserSchema.methods.validatePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = bcrypt.genSaltSync(8);
  this.salt = salt;
  return bcrypt.hash(this.password, this.salt).then((hash) => {
    this.password = hash;
  });
});

UserSchema.post<IUser>(
  "save",
  function (error: Error, _: IUser, next: (err?: MongoError) => void) {
    if (error.name !== "MongoServerError") return next(error);

    const field = Object.keys((error as any).keyValue)[0];
    const messages: { [key: string]: string } = {
      email: "Email already in use",
      phone: "Phone number already in use",
      username: "Username already in use",
    };
    const message = messages[field] || "An error occurred";
    return next(new Error(message));
  }
);

export default model<IUser>("User", UserSchema);
