import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId ;
      },
      select: false,
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    authType: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    // Campos adicionales necesarios
    favoriteMovies: [
      {
        type: Number,
        ref: "Movie",
      },
    ],
    reviews: [
      {
        movieId: {
          type: Number,
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    // Si es un usuario de OAuth, no debería usar este método
    if (this.authType !== "local") {
      console.log("Usuario OAuth intentando usar comparación de contraseña");
      return false;
    }

    // Asegurarse de que tenemos la contraseña
    if (!this.password) {
      console.log("No hay contraseña para comparar");
      return false;
    }

    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    console.error("Error comparando contraseñas:", error);
    return false;
  }
};

userSchema.pre("save", async function (next) {
  // Solo hashear la contraseña si ha sido modificada o es nueva
  if (!this.isModified("password")) return next();

  try {
    // Generar un salt
    const salt = await bcrypt.genSalt(10);
    // Hashear la contraseña
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);

export default User;
