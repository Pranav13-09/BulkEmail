const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  firstname: {
    type: String,
    required: true,
  },
  isFirstTimeLogin: {
    type: Boolean,
    default: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  profileLinkClicks: {
    type: Number,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  profile_preview_image: {
    type: String,
  },
  profile_image: {
    type: String,
    default:
      "https://referme-user-images.s3.eu-west-2.amazonaws.com/Profile+Icon+(1).jpeg",
  },
  isUploadingContactsPending: {
    type: Boolean,
    default: false,
  },
  default_payment_method: {
    type: String,
    enum: ["bank_transfer", "amazon_gift"],
  },
  default_payment_type: {
    type: String,
    enum: ["after_sale", "after_referral"],
  },
  totalContactsToUpload: {
    type: Number,
  },
  pendingContactsToUpload: {
    type: Number,
  },
  totalContactsBeforeUpload: {
    type: Number,
  },
  username: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  aboutme: {
    type: String,
    default: null,
  },
  phone: {
    type: String,
    default: null,
  },
  date_joined: {
    type: Date,
    default: Date.now,
  },
  email_verified: {
    type: Boolean,
    default: false,
  },
  cover_image: {
    type: String,
    default:
      "https://referme-user-images.s3.eu-west-2.amazonaws.com/default_cover.jpeg",
  },
  services: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
  ],
  businessAddress: {
    postcode: {
      type: String,
      default: null,
    },
    calendly: {
      type: String,
      default: null,
    },
    address_line_1: {
      type: String,
      default: null,
    },
    address_line_2: {
      type: String,
      default: null,
    },

    distance: {
      type: String,
      default: null,
    },
  },
  socials: {
    facebook: {
      type: String,
      default: null,
    },
    twitter: {
      type: String,
      default: null,
    },
    instagram: {
      type: String,
      default: null,
    },
    linkedin: {
      type: String,
      default: null,
    },
    // Add other social media platforms as needed
  },
  business_address: {
    address: {
      type: String,
    },
    location: {
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
    },
  },
  contacts: [
    {
      contact_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contact",
      },
    },
  ],
  referrals_received: {
    type: Number,
    default: 0,
  },
  contact_limit: {
    type: Number,
    default: 5,
  },
  total_reviews: {
    type: Number,
    default: 0,
  },
  total_income: {
    type: Number,
    default: 0,
  },
  total_spend: {
    type: Number,
    default: 0,
  },
  role: {
    type: String,
  },
  organization: {
    type: String,
  },
  total_sales: {
    type: Number,
    default: 0,
  },
  average_spend: {
    type: Number,
    default: 0,
  },
  conversion_rate: {
    type: Number,
    default: 0,
  },
  reset_password_token: {
    type: String,
    default: null,
  },
  reset_password_expire: {
    type: String,
    default: null,
  },
  otp: {
    type: Number,
    default: null,
  },
  otp_expiration_time: {
    type: String,
    default: null,
  },
  reviews: [
    {
      review_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    },
  ],
  images: [
    {
      date_added: Date,
      image_uri: String,
    },
  ],
  additional_information: {
    type: String,
  },
  fees: {
    type: String,
  },
  trainings: {
    type: String,
  },
  video_url: {
    type: String,
  },
  preview_regenerate: {
    type: Boolean,
    default: true,
  },
  accreditation: {
    type: String,
    default: null,
  },
  isAffilateLinkGenerated: {
    type: Boolean,
    default: false,
  },
  AffilatedContactCount: {
    type: Number,
    default: 0,
  },
  post_count: {
    type: Number,
    default: 0,
  },
  email_count: {
    type: Number,
    default: 0,
  },
  whatsapp_count: {
    type: Number,
    default: 0,
  },
  payment_plan: {
    type: String,
    default: "free",
  },
  current_subscription_id: {
    type: String,
    default: null,
  },
  current_subscription_start_date: {
    type: Date,
  },
  current_subscription_expiry_date: {
    type: Date,
  },
  subscription_active: {
    type: Boolean,
    default: false,
  },
  gpt_counter: {
    type: Number,
    default: 10,
  },
  email_counter: {
    type: Number,
    default: 35,
  },
  promo_code: {
    type: String,
  },
  whatsapp_counter: {
    type: Number,
    default: 0,
  },
  googleAvgRating: {
    type: Number,
    default: 0,
  },
  terms: {
    type: String,
    default: null,
  },
  referral_active: {
    type: Boolean,
    default: false,
  },
  referral_amount: {
    type: Number,
  },
});

module.exports = mongoose.models?.User || mongoose.model("User", userSchema);
