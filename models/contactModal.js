const mongoose = require("mongoose");
const currentDate = new Date();

const contactSchema = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
    index: true,
  },
  lastname: {
    type: String,
    required: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    index: true,
  },
  occupation: {
    type: String,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  review_status: {
    type: Boolean,
    default: false,
  },
  referral_count: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
  },
  referral_link: {
    type: String,
    unique: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  referral_amount: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  review_requested: {
    type: Boolean,
  },
  review_requested_date: {
    type: String,
  },
  review_submitted_date: {
    type: String,
  },
  referral_link_shared: {
    type: Boolean,
  },
  referral_link_last_shared: {
    type: String,
  },
  google_wallet_pass: {
    type: String,
  },
  apple_wallet_pass: {
    type: String,
  },
  google_wallet_pass_created_date: {
    type: String,
  },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
  },
  payment_method: {
    type: Number,
  },
  payment_type: {},
  apple_wallet_pass_created_date: {
    type: String,
  },
  account_created_date: {
    type: String,
  },
  account_id: {
    type: String,
  },
  account_created: {
    type: Boolean,
  },
  account_creation_link_shared: {
    type: Boolean,
  },
  account_details_submitted: {
    type: Boolean,
  },
  account_creation_email_sent: {
    type: Boolean,
  },
  total_amount_generated: {
    type: Number,
  },
  otp: {
    type: String,
    default: null, // Default to null, it will be set when the OTP is generated
  },
  otp_expiring_time: {
    type: Date,
    default: null, // Default to null, it will be set along with the OTP
  },
  isAffilate: {
    type: Boolean,
    default: false,
  },
  referral_amount_informed: {
    type: Boolean,
  },
  lead_generated: [
    {
      lead_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
});

module.exports =
  mongoose.models.Contact || mongoose.model("Contact", contactSchema);
