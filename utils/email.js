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

const triggerClaimEmails = async (messages) => {
  const promises = [];

  messages.forEach(async (item) => {
    const { heir = {}, user = {}, assetId, type } = item;
    const { firstName, middleName, lastName, percentage } = heir;
    const { firstName: uFirstName, lastName: uLastName } = user;

    const msg = {
      to: heir.email,
      from: process.env.FROM_EMAIL,
      subject: 'Assets to be claimed',
      html: `Hi ${firstName} ${middleName} ${lastName}, <br/><br/> ${uFirstName} ${uLastName} has declared you as legal heir for the below assets which can be claimed.<br/><br/>  <b>Asset Type:</b> ${type}  <br/> <b>Asset ID:</b> ${assetId}  <br/> <b>Percentage :</b> ${percentage}%`,
    };

    promises.push(await sgMail.send(msg));
  });

  return Promise.all(promises);
};

module.exports = { sendNewUserEmail, triggerClaimEmails };
