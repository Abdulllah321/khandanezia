const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
      required: true,
      match: /.+\@.+\..+/,
    },
    password: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      default: "Male",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
    phoneNumbers: {
      type: [String],
      validate: {
        validator: function (value) {
          const age = new Date().getFullYear() - this.dob.getFullYear();
          // Check if the user is over 18 and requires at least one phone number
          return age < 18 || value.length > 0; // If under 18, skip validation
        },
        message:
          "At least one phone number is required for users older than 18.",
      },
      required: function () {
        const age = new Date().getFullYear() - this.dob.getFullYear();
        return age >= 18; // Require phone numbers if user is 18 or older
      },
    },
    roles: {
      type: [String],
      default: ["user"],
    },
    bio: {
      type: String,
      trim: true,
    },
    socialLinks: {
      facebook: String,
      twitter: String,
      linkedin: String,
      instagram: String,
      custom: Schema.Types.Mixed,
    },
    children: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    parent: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    secretKey: {
      type: String,
      default: () => Math.random().toString(36).substr(2, 9),
      unique: true,
    },
    education: [
      {
        schoolName: String,
        degree: String,
        fieldOfStudy: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],
    work: [
      {
        companyName: String,
        position: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],
    marriageDetails: [
      {
        spouse: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        marriageDate: Date,
        placeOfMarriage: {
          type: String,
          trim: true,
        },
      },
    ],
    events: [
      {
        eventName: String,
        eventDate: Date,
        description: String,
      },
    ],
    photos: [
      {
        photoUrl: String,
        caption: String,
      },
    ],
    privacySettings: {
      showEmail: {
        type: Boolean,
        default: false,
      },
      showPhone: {
        type: Boolean,
        default: true,
      },
      showAddress: {
        type: Boolean,
        default: false,
      },
      showDob: {
        type: Boolean,
        default: false,
      },
      profilePublic: {
        type: Boolean,
        default: true,
      },
      allowedAccess: [
        {
          userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          accessLevel: {
            type: String,
            enum: ["view", "edit", "none"],
            default: "view",
          },
        },
      ],
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
