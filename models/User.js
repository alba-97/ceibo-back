const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const {
  isEmail,
  isMobilePhone,
  isURL,
  isStrongPassword,
} = require("validator");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Ingrese un nombre de usuario"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Ingrese una contraseña"],
    validate: [
      (str) =>
        isStrongPassword(str, {
          minLength: 8,
          minUppercase: 1,
          minSymbols: 0,
          minNumbers: 0,
          returnScore: false,
        }),
      "La contraseña debe tener mínimo 8 caracteres y 1 mayúscula",
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
    required: [true, "Ingrese un email"],
    unique: true,
    validate: [isEmail, "Ingrese un email válido"],
  },
  birthdate: {
    type: Date,
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
    validate: [isMobilePhone, "Ingrese un número de teléfono válido"],
  },
  profile_img: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    validate: isURL,
  },
  address: { type: String },
  preferences: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  new_user: { type: Boolean, default: true },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      timestamps: true,
      toJSON: { virtuals: true },
    },
  ],
});

UserSchema.methods.validatePassword = async function (password) {
  const hash = await bcrypt.hash(password, this.salt);
  const checking = hash === this.password;
  return checking;
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

UserSchema.post("save", function (error, _, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    let message;
    if (error.message.includes("email")) {
      message = "Ya hay una cuenta con ese email";
    } else if (error.message.includes("phone")) {
      message = "El número de teléfono ya fue utilizado";
    } else if (error.message.includes("username")) {
      message = "El usuario ya existe";
    }
    next(new Error(message));
  } else {
    next(error);
  }
});

UserSchema.post("validate", function (error, _, next) {
  if (error.name === "ValidationError") {
    let message;
    if (error.errors.email) {
      message = error.errors.email.message;
    } else if (error.errors.password) {
      message = error.errors.password.message;
    } else if (error.errors.phone) {
      message = error.errors.phone.message;
    }
    next(new Error(message));
  } else {
    next(error);
  }
});

module.exports = mongoose.model("User", UserSchema);
