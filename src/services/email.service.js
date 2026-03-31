
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});


// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"SG Bank of India" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendEmailtoUser (email, name) {
    // console.log("heyyyy")
    const subject = `Welcome to Our Website`
    const text = `
        Hi ${name},

Welcome and thank you for registering with us!

We’re excited to have you as part of our community. Your account has been successfully created, and you can now explore all the features available on our platform.

Here’s what you can do next:

* Log in to your account
* Complete your profile
* Start exploring our services

If you have any questions or need help, feel free to reply to this email — we’re always here to help.

Thanks again for joining us!

Best regards,
SG Bank of India
    `

    const html = `
    <!DOCTYPE html>

<html>
<head>
<meta charset="UTF-8">
<title>Welcome Email</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f4f6f8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;padding:30px;">
          <tr>
            <td align="center">
              <h2 style="margin:0;color:#333333;">Welcome ${name}🎉</h2>
              <p style="color:#555555;font-size:16px;">
                Thank you for registering with us! Your account has been successfully created.
              </p>
            </td>
          </tr>


      <tr>
        <td>
          <p style="color:#555555;font-size:15px;">Here’s what you can do next:</p>
          <ul style="color:#555555;font-size:15px;">
            <li>Log in to your account</li>
            <li>Complete your profile</li>
            <li>Explore our features</li>
          </ul>
        </td>
      </tr>

      <tr>
        <td align="center" style="padding:20px;">
          <a href="#" style="background:#4CAF50;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:5px;display:inline-block;">
            Go to Dashboard
          </a>
        </td>
      </tr>

      <tr>
        <td align="center">
          <p style="color:#999999;font-size:13px;">
            If you need any help, just reply to this email. We’re happy to assist you.
          </p>
          <p style="color:#333333;font-size:14px;">— SG Bank of India</p>
        </td>
      </tr>

    </table>
  </td>
</tr>


  </table>
</body>
</html>

    `
    await sendEmail(email, subject, text, html)
    
}

async function sendMailLogin(email, name) {
 const  html = `
  <!DOCTYPE html>

<html>
<head>
<meta charset="UTF-8">
<title>Login Alert</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f4f6f8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;padding:30px;">


      <tr>
        <td align="center">
          <h2 style="margin:0;color:#333333;">New Login Detected 🔐</h2>
          <p style="color:#555555;font-size:16px;">
            Hello ${name}, your account has just been logged in successfully.
          </p>
        </td>
      </tr>

      <tr>
        <td>
          <p style="color:#555555;font-size:15px;">
            If this was you, no action is needed. You can continue using our services normally.
          </p>
          <p style="color:#555555;font-size:15px;">
            If you did not log in, please secure your account immediately by changing your password.
          </p>
        </td>
      </tr>

      <tr>
        <td align="center" style="padding:20px;">
          <a href="#" style="background:#e53935;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:5px;display:inline-block;">
            Secure My Account
          </a>
        </td>
      </tr>

      <tr>
        <td align="center">
          <p style="color:#999999;font-size:13px;">
            This is an automated security notification. Please do not reply directly to this email.
          </p>
          <p style="color:#333333;font-size:14px;">— SG Bank of India</p>
        </td>
      </tr>

    </table>
  </td>
</tr>


  </table>
</body>
</html>

  `
  const subject = `New Login to Your Account 🔐`
  const text = ``
  await sendEmail(email, subject, text, html)

}

async function sendAuthority(name, email, userId) {

const subject = `Request for Account Verification Approval`

const  html = `
  <!DOCTYPE html>

<html>
<head>
<meta charset="UTF-8">
<title>Verification Request</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f4f6f8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;padding:30px;">


      <tr>
        <td align="center">
          <h2 style="margin:0;color:#333333;">Verification Request</h2>
          <p style="color:#555555;font-size:16px;">
            A new account application requires your verification.
          </p>
        </td>
      </tr>

      <tr>
        <td>
          <p style="color:#555555;font-size:15px;">
            Dear Authority,
          </p>
          <p style="color:#555555;font-size:15px;">
            A user has submitted a request to create a bank account. Kindly review the submitted details and take appropriate action.
          </p>

          <p style="color:#555555;font-size:15px;"><strong>User Details:</strong></p>
          <ul style="color:#555555;font-size:15px;">
            <li>Name: ${name}</li>
            <li>Email: ${email}</li>
            <li>Creatting link: http://localhost:7000/api/account?userId=${userId}</li>
          </ul>

          <p style="color:#555555;font-size:15px;">
            Please verify the details and choose one of the following actions:
          </p>
          <ul style="color:#555555;font-size:15px;">
            <li>Approve → Bank account will be created</li>
            <li>Reject → Account will not be created</li>
          </ul>
        </td>
      </tr>

      <tr>
        <td align="center" style="padding:20px;">
          <a href="http://localhost:7000/api/account?userId=${userId}" style="background:#4CAF50;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:5px;margin-right:10px;display:inline-block;">
            Approve
          </a>
          <a href="http://localhost:7000/api/account?userId=reject" style="background:#e53935;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:5px;display:inline-block;">
            Reject
          </a>
        </td>
      </tr>

      <tr>
        <td align="center">
          <p style="color:#999999;font-size:13px;">
            This is an automated request. Please take action at your earliest convenience.
          </p>
          <p style="color:#333333;font-size:14px;">— System Notification</p>
        </td>
      </tr>

    </table>
  </td>
</tr>


  </table>
</body>
</html>

`
const text =``

  sendEmail(email, subject, text, html)
  
}

module.exports ={ sendEmailtoUser, sendMailLogin, sendAuthority }