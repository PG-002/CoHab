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

const getExpDate = (days = 1) => new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000);

const generateCode = (digits = 6) => {
    let code = '';
    for(let i = 0; i < digits; ++i)
        code += Math.floor(Math.random() * 10);

    return code;
};

const sendCode = async (user) => {
    let code = generateCode();
    while(await VerificationEntry.findOne({ userId : user._id, code : code }))
        code = generateCode();

    const type = user.verified ? 'password change' : 'account';

    const mailOptions = {
        from : process.env.EMAIL_ADDRESS,
        to : user.email,
        subject : 'Cohab ' + type + ' verification code',
        text : 'Hi ' + user.firstName + ' ' + user.lastName + ',\n\nYour ' + type + ' verification code is: ' + code + '\nThis code will expire in 24 hours.\n\nKind regards,\nCohab Team'
    };

    const entry = await VerificationEntry.findOne({ userId : user._id, type : type });
    if(entry)
        return await VerificationEntry.updateOne({ userId : user._id }, { code : code, expDate : getExpDate() })
            .then(async () =>
                await transporter.sendMail(mailOptions)
                    .then(() => ({ sent : true, error : '' }))
                    .catch(() => ({ sent : false, error : 'Email could not be sent.' })))
            .catch(() => ({ sent : false, error : 'Verification code could not be updated.' }));

    return await VerificationEntry.create({ userId : user._id, type: type, code : code, expDate : getExpDate() })
        .then(async () =>
            await transporter.sendMail(mailOptions)
                .then(() => ({ sent : true , error : '' }))
                .catch(() => ({ sent : false, error : 'Email could not be sent.' })))
        .catch(() => ({ sent : false, error : 'VerificationEntry could not be created.' }));
};

const sendInvite = async (user, house) => {
    let code = generateCode();
    while(await VerificationEntry.findOne({ userId : user._id, code : code }))
        code = generateCode();

    const mailOptions = {
        from : process.env.EMAIL_ADDRESS,
        to : user.email,
        subject : 'Cohab: You have been invited to join \'' + house.houseName + '\'.',
        text : 'Hi ' + user.firstName + ' ' + user.lastName + ',\n\nYou have been invited to join \'' + house.houseName + '\'. Your join code is ' + code + '\nThis code will expire in 24 hours.\n\nKind regards,\nCohab Team'
    };

    return await VerificationEntry.create({ userId : user._id, type : 'invite', code : code, houseId : house._id, expDate : getExpDate() })
        .then(async () => 
            await transporter.sendMail(mailOptions)
                .then(() => ({ sent : true, error : '' }))
                .catch(() => ({ sent : false, error : 'Could not send email.' })))
        .catch(() => ({ sent : false, error : 'VerificationEntry could not be created.' }));
}

const verifyCode = async (user, code) => {
    const entry = await VerificationEntry.findOne({ userId : user._id })
        .catch(() => null);

    if(!entry)
        return 'User does not have any verification codes.';
    else if(entry.code !== code)
        return 'The code provided does not match.';
    else if(entry.expDate < Date.now())
    {
        await VerificationEntry.deleteOne({ userId : user._id })
            .catch(() => null);
        return 'The code has expired.'
    }
};  

const getHouse = async (userId, code) => 
    await VerificationEntry.findOne({ userId : userId, code : code })
        .then(entry => entry.houseId)
        .catch(() => null);

const deleteCode = async (user, code) => await VerificationEntry.deleteOne({ userId : user._id, code : code })
    .then(() => ({ verified : true, error : '' }))

module.exports = { sendCode, sendInvite, getHouse, verifyCode, deleteCode };