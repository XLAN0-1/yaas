const { google } = require("googleapis");
const nodemailer = require("nodemailer");

const CLIENT_ID = "890188043598-ggm0sukb0s4ea1fb7n70f4tjirt5t1p0.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REFRESH_TOKEN = "1//04vEwbs9vuBDACgYIARAAGAQSNwF-L9IruVj8cVarI7s6Ly7J0ygtNBAfiyJiD-ZjugFx0yPFxwiBMU1dpUpr60L7kUsmqLaOmuA";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);


oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMessage(address, subject,  message) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "John55olu@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    let mailOptions = {
      from: "John55olu@gmail.com",
      to: address,
      subject: subject,
      html: message,

    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.log(error);
  }
}

// sendMessage()
//   .then((result) => console.log("Email sent.."))
//   .catch((error) => console.log(error));


module.exports = sendMessage;