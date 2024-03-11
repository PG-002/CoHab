const nodemailer = require('nodemailer');
const VerificationEntry = require('../Models/VerificationEntry');

const transporter = nodemailer.createTransport({
    service : 'gmail',
    secure : true,
    auth : {
        user : process.env.EMAIL_ADDRESS,
        pass : process.env.EMAIL_PASS
    }
});

const generateCode = (digits = 6) => {
    let code = '';
    for(let i = 0; i < digits; ++i)
        code += Math.floor(Math.random() * 10);

    return code;
};

const sendCode = async (user, type) => {
    let code = generateCode();
    while(await VerificationEntry.findOne({ userId : user._id, code : code }))
        code = generateCode();

    const mailOptions = {
        from : process.env.EMAIL_ADDRESS,
        to : user.email,
        subject : 'Cohab ' + type + ' verification code',
        text : 'Hi ' + user.firstName + ' ' + user.lastName + ',\n\nYour ' + type + ' verification code is: ' + code + '\n\nKind regards,\nCohab Team'
    };

    const entry = await VerificationEntry.findOne({ type : type, userId : user._id });
    if(entry)
        return await VerificationEntry.updateOne({ type : type, userId : user._id }, { code : code, expDate : Date.now() + 1})
            .then(async () => await transporter.sendMail(mailOptions)
                .then(() => ({ sent : true, error : '' }))
                .catch(() => ({ sent : false, error : 'Email could not be sent.' })))
            .catch(() => ({ sent : false, error : 'Verification code could not be updated.' }))

    return await VerificationEntry.create({ type : type, userId : user._id, code : code, expDate : Date.now() + 1 })
        .then(async () => await transporter.sendMail(mailOptions)
            .then(() => ({ sent : true , error : '' }))
            .catch(() => ({ sent : false, error : 'Email could not be sent.' })))
        .catch(() => ({ sent : false, error : 'VerificationEntry could not be created.' }));
};

const verifyCode = async (user, code) => {
    const entry = await VerificationEntry.findOne({ userId : user._id })

    if(!entry)
        return 'User does not have any verification codes.';
    else if(entry.code !== code)
        return 'The code provided does not match.';
    else if(entry.expDate < Date.now())
    {
        await VerificationEntry.deleteOne({ userId : user._id }).catch(() => null);
        return 'The code has expired.'
    }
};  

const deleteCode = async (user, code) => await VerificationEntry.deleteOne({ userId : user._id, code : code })
    .then(() => ({ verified : true, error : '' }))
    .catch(() => ({ verified : false, error : 'VerificationEntry could not be deleted.' }));

module.exports = { sendCode, verifyCode, deleteCode };