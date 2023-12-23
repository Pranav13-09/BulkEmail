const express = require("express");
const app = express();
const User = require("./models/userModal");
const Contact = require("./models/contactModal");
const sgMail = require("@sendgrid/mail");
const axios = require("axios");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { createPass } = require("./helpers/createPass");
dotenv.config();

app.use(express.json());

sgMail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY);

app.post("/sendBulkEmail", async (req, res) => {
  try {
    const { userId } = req.body;
    const issuer = await User.findOne({ _id: req.body.userId });
    if (!issuer) {
      return res.status(400).json({ message: "User not found" });
    }

    const contacts = await Contact.find({ user: userId }).select("_id");
    const contactIds = contacts.map((contact) => contact._id);
    console.log(contactIds, "i am here");

    if (contactIds.length > issuer.email_counter) {
      return res.status(400).json({
        message: `You are exceeding your monthly limit of sending emails.You have ${issuer.email_counter} email credits left for this month`,
      });
    }

    const contactPromises = contactIds.map(async (contactId) => {
      try {
        const contact = await Contact.findOne({ _id: contactId });

        if (contact.referral_link_shared) {
          console.log("here i am ");
          return;
        }

        const issuerId = "3388000000022217914";

        const classId = `${issuerId}.multiple`;
        const data = {
          email: contact.email,
          firstname: contact.firstname,
          lastname: contact.lastname,
          uniqueLink: contact.referral_link,
          issuer: {
            profile_image: issuer.profile_image,
            firstname: issuer.firstname,
            lastname: issuer.lastname,
            _id: issuer._id,
            phone: issuer.phone,
            email: issuer.email,
            username: issuer.username,
            role: issuer.role,
          },
          phone: issuer.phone,
        };

        //createing google wallet pass
        const walletUrl = await createPass(data);
        console.log(walletUrl, "i am walletUrl");

        //creating apple wallet pass
        const applePass = await axios({
          method: "POST",
          url: "http://13.40.55.32:8080/create",
          data: {
            data: data,
          },
        });

        console.log(applePass.data, "i am data");

        let date = new Date();

        let updatedContact = await Contact.updateOne(
          { _id: contact._id },
          {
            $set: {
              apple_wallet_pass_created_date: date.toString(),
              google_wallet_pass_created_date: date.toString(),
              referral_link_shared: true,
              referral_link_last_shared: date.toString(),
              apple_wallet_pass: applePass.data,
              google_wallet_pass: walletUrl,
            },
          },
          { new: true }
        );

        console.log(updatedContact, "here it is");

        const msg = {
          to: `${contact.email}`, // Change to your recipient
          from: {
            name: "ReferMe",
            email: "contact@referme.uk",
          }, // Change to your verified sender
          subject: `${issuer.organization} - Here is our new ReferMe profile, You Can Share & Earn Rewards By Sending Us Referrals`,
          html: ` <!DOCTYPE html>
        <html>
        <head>
            <style>
            @media only screen and (max-width: 600px) {
                /* Add your mobile-specific styles here */
            }
            body {
                font-family: Arial, sans-serif;
                line-height: 1.5;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
            }

            </style>
        </head>

        <body style="margin: 0; padding: 0">
            <table
            role="presentation"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
            width="100%"
            class="container"
            style="max-width: 600px"
            >
            <tr>
                <td style="padding: 40px 30px 40px 30px">
                <table
                    role="presentation"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    width="100%"
                >
                    <tr>
                    <td style="text-align: center">
                        <img
                        src="https://referme-user-images.s3.eu-west-2.amazonaws.com/final-logo.png"
                        alt="Company Logo"
                        width="200"
                        style="display: block; margin: 0 auto"
                        />
                    </td>
                    </tr>
                    <tr>
                    <td style="padding: 20px 0 30px 0; text-align: center">
                        <h1 style="font-size: 24px; margin: 0">Dear ${
                          contact.firstname
                        },</h1>
                    </td>
                    </tr>
                    <tr>
                    <td style="font-size: 16px; line-height: 22px">
                        <p style="margin: 0 0 20px 0">
                        I hope this message finds you well. At ${
                          issuer.organization
                        }, we truly value your loyalty and the trust you've placed in us. As a token of our appreciation, we're excited to introduce our new referral program that allows you to earn fantastic rewards by sharing your positive experiences with others.
                        </p>
                        <p style="margin: 0 0 20px 0">
                        Here's how it works:
                        </p>
                        <ul style="margin: 0 0 20px 20px; padding: 0">
                            <li>Unique Referral Link: We've created a unique referral link just for you. You can share this link with your friends, family, and colleagues who may benefit from our services. This link will track the referrals you bring in.</li>
                            <li>QR Code: For your convenience, we've also generated a QR code linked to your unique referral URL. Simply add the QR code to your wallet to share it with your contacts when you are out and about and face to face with people.</li>
                            <li>Earn Rewards: Whenever someone you refer becomes our valued customer, you'll be rewarded! We offer £${
                              contact.referral_amount
                            } ${
            contact.payment_method
              ? contact.payment_method === "amazon_gift"
                ? "Amazon Gift Card"
                : "Via Bank Transfer"
              : ""
          }  on completion of sale. Social media is a good place to start sharing!</li>
                        </ul>
                        <p style="margin: 0 0 20px 0">
                        You can store my business card with the QR code in your apple or google walltet, just click the buttons below to add them:
                        </p>
                     <a href='${walletUrl}'>
                                    <img
                                    src="https://referme-user-images.s3.eu-west-2.amazonaws.com/wallet-button.png"
                                    alt="Business Card"
                                    style="
                                        display: block;
                                        margin: 0 auto;
                                        max-width: 200px;
                                        height: auto;
                                    "
                                    />
                                </a>
                         <p style="text-align: center; margin: 14px 0 20px 0">
                                <a href='${
                                  applePass.data
                                }' download='BusinessCard.pkpass'>
                                    <img
                                    src="https://referme-user-images.s3.eu-west-2.amazonaws.com/US-UK_Add_to_Apple_Wallet_RGB_101421+1.png"
                                    alt="Add to Apple Wallet"
                                    style="display: block; margin: 0 auto; height: 15mm"
                                    />
                                </a>
                                </p>
                                        <p>
                        Note: If you are a Apple user please use Safari to open the Apple wallet pass
                      </p>
                        <p style="margin: 0 0 20px 0">
                        You can also use the below unique referral link:
                        </p>
                                   <p style="text-align: center; margin: 16px 0 20px 0">
                                <a href='${contact.referral_link}' >
                                    Referral Link
                                </a>
                                </p>
                        <p style="margin: 0 0 20px 0">
                        Feel free to start sharing your link and QR code today. The more referrals you bring in, the more rewards you'll earn, making it a win-win for everyone.
                        </p>
                        <p style="margin: 0 0 20px 0">
                        We're confident that your personal recommendation will resonate with those you refer, and we look forward to welcoming new customers who share your trust in our services.
                        </p>
                        <p style="margin: 0 0 20px 0">
                        If you have any questions or need assistance with the referral process, please don't hesitate to contact me. 
                        </p>
                        <p style="margin: 0">Thank you once again for choosing ${
                          issuer.organization
                        }. Your support means the world to us, and we can't wait to reward you for helping us grow.</p>
                        <p style="margin: 0">Warm regards,</p>
                        <p style="margin: 0">${
                          issuer.firstname + " " + issuer.lastname
                        }</p>
                        <p style="margin: 0">${issuer.role}</p>
                        <p style="margin: 0">${issuer.organization}</p>
                    </td>
                    </tr>
                </table>
                </td>
            </tr>
            </table>
        </body>
        </html>`,
        };
        try {
          await sgMail.send(msg);
          console.log(" mail sent");
        } catch (e) {
          console.log(e, "this is send grid errror");
          console.log(e, " this is error");
          return { contactId, error: e };
          // return res
          //   .status(400)
          //   .json({ message: "Something unusual happened" });
        }

        return { contactId };
      } catch (error) {
        return { contactId, error: error.message };
      }
    });

    const chunkedPromises = [];
    for (let i = 0; i < contactPromises.length; i += 750) {
      chunkedPromises.push(
        Promise.allSettled(contactPromises.slice(i, i + 750))
      );
    }
    issuer.email_counter -= contactIds.length;
    await issuer.save();

    try {
      const results = await Promise.allSettled(chunkedPromises);
      console.log("All contacts processed:", results);

      const errors = [];

      results.forEach((result) => {
        if (result.status === "fulfilled") {
          console.log(result);
        } else {
          errors.push(result.reason);
        }
      });

      console.log("Errors:", errors);

      return res.status(200).json({
        message: "User Updated Successfully",
        whatsapp_credit: issuer.whatsapp_counter,
        email_credit: issuer.email_counter,
        errors: errors, // Sending the errors array in the response
      });
    } catch (error) {
      console.error("Error processing contacts:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } catch (e) {
    res.status(400).send("failure");
  }
});

app.get("/test", async (req, res) => {
  console.log("I am working");
  return res.status(200).json({ message: "This endpoint working fine" });
});

module.exports = app;
