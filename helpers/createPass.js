const { GoogleAuth } = require("google-auth-library");
const jwt = require("jsonwebtoken");

const { v4: uuidv4 } = require("uuid");

// TODO: Define Issuer ID
const issuerId = "3388000000022237346";

// TODO: Define Class ID
const classId = `${issuerId}.multiple`;

const baseUrl = "https://walletobjects.googleapis.com/walletobjects/v1";

const credentials = require("./referme.json");

const httpClient = new GoogleAuth({
  credentials: credentials,
  scopes: "https://www.googleapis.com/auth/wallet_object.issuer",
});

exports.createPass = async (data) => {
  let response;
  try {
    // Check if the class exists already
    response = await httpClient.request({
      url: `${baseUrl}/genericClass/${classId}`,
      method: "GET",
    });
  } catch (err) {
    if (err.response && err.response.status === 404) {
      // Class does not exist
      // Create it now
      response = await httpClient.request({
        url: `${baseUrl}/genericClass`,
        method: "POST",
        data: genericClass,
      });
    } else {
      // Something else went wrong
    }
  }

  // TODO: Create a new Generic pass for the user
  // TODO: Create a new Generic pass for the user
  //   let objectSuffix = `${req.body.email.replace(/[^\w.-]/g, "_")}`;
  let objectId = `${issuerId}.${uuidv4()}`;
  let genericObject = {
    id: `${objectId}`,
    classId: classId,
    genericType: "GENERIC_TYPE_UNSPECIFIED",
    logo: {
      sourceUri: {
        uri: data.issuer.profile_image,
      },
      contentDescription: {
        defaultValue: {
          language: "en",
          value: "LOGO_IMAGE_DESCRIPTION",
        },
      },
    },
    cardTitle: {
      defaultValue: {
        language: "en",
        value: "Referme Business Card",
      },
    },
    subheader: {
      defaultValue: {
        language: "en",
        value: data.issuer.role,
      },
    },
    header: {
      defaultValue: {
        language: "en",
        value: data.issuer.firstname + " " + data.issuer.lastname,
      },
    },
    linksModuleData: {
      uris: [
        {
          uri: data.uniqueLink,
          description: "Your Referral Link",
          id: "LINK_MODULE_URI_ID",
        },
        {
          uri: `tel:+44${data.issuer.phone}`,
          description: "Contact",
          id: "LINK_MODULE_TEL_ID",
        },
        {
          uri: `mailto:${data.issuer.email}`,
          description: "Email",
          id: "LINK_MODULE_EMAIL_ID",
        },
        {
          uri: `https://referme.uk`,
          description: "Join Referme",
          id: "LINK_MODULE_EMAIL_ID",
        },
      ],
    },
    barcode: {
      type: "QR_CODE",
      value: data.uniqueLink,
      alternateText: null,
    },
    hexBackgroundColor: "#6909CF",
    heroImage: {
      sourceUri: {
        uri: "https://referme-user-images.s3.eu-west-2.amazonaws.com/ReferMe_logo_for_google_pass.png",
      },
      contentDescription: {
        defaultValue: {
          language: "en",
          value: "Referme Logo",
        },
      },
    },
  };
  // TODO: Create the signed JWT and link
  const claims = {
    iss: credentials.client_email,
    aud: "google",
    origins: [],
    typ: "savetowallet",
    payload: {
      genericObjects: [genericObject],
    },
  };

  const token = jwt.sign(claims, credentials.private_key, {
    algorithm: "RS256",
  });
  const saveUrl = `https://pay.google.com/gp/v/save/${token}`;

  return saveUrl;
};
