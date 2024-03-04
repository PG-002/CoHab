const nodemailer = require('nodemailer');
const UserVerification = require('../Models/UserVerification');

const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : process.env.EMAIL_ADDRESS,
        pass : process.env.EMAIL_PASS
    }
});

const generateCode = () => {
    let code = '';
    const digits = 6;

    for(let i = 0; i < digits; ++i)
        code += Math.floor(Math.random() * 10);

    return code;
};

const sendVerificationCode = async (name, emailTo) => {
    const code = generateCode();

    const mailOptions = {
        from : process.env.EMAIL_ADDRESS,
        to : emailTo,
        subject : 'Cohab account verification code',
        text : 'Hi ' + name + ',\n\nYour account verification code is: ' + code + '\n\nKind regards,\nCohab Team'
    };

    return await UserVerification.create({
        email : emailTo,
        code : code
    }).then(async () => {
        await transporter.sendMail(mailOptions, (err, info) => err ? err : info)
        return 'Message sent!'
    })
    .catch(err => err);
};

const checkVerificationCode = async (email, code) => {
    const user = await UserVerification.findOne({ email : email });
    if(!user)
        return 'This email address does not have a verification code.';

    if(user.code !== code)
        return 'The code is incorrect.';

    await UserVerification.deleteOne({ email : email });

    return 'User verified!';
};  

module.exports = { sendVerificationCode, checkVerificationCode };