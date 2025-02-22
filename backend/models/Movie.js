import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    tmdbId: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    overview: {
      type: String,
      required: false,
      default: "Sin descripción disponible",
    },
    posterPath: {
      type: String,
      default: "",
    },
    backdropPath: {
      type: String,
      default: "", 
    },
    releaseDate: Date,
    voteAverage: Number,
    popularity: Number,
    genres: [
      {
        id: Number,
        name: String,
      },
    ],
    runtime: Number,
    videos: [
      {
        site: String,
        key: String,
        type: String,
        name: String,
      },
    ],
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        username: {
          type: String,
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
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

movieSchema.methods.needsUpdate = function () {
  const ONE_DAY = 24 * 60 * 60 * 1000;
  return Date.now() - this.lastUpdated > ONE_DAY;
};

export default mongoose.model("Movie", movieSchema);
