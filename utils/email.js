const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendNewUserEmail = async (payload) => {
  const { email, firstName, middleName = '', lastName, password } = payload;

  const msg = {
    to: email,
    from: process.env.FROM_EMAIL,
    subject: 'Account created',
    html: `Hi ${firstName} ${middleName} ${lastName}, <br/><br/> Please use the following details to login into the portal. <br/><br/> <a href="http://localhost:3000/user/login">Visit Portal</a> <br/><br/> <b>Email:</b> ${email}  <br/> <b>Password:</b> ${password}`,
  };

  return await sgMail.send(msg);
};

module.exports = { sendNewUserEmail };
