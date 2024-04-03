const express = require('express');
const RandomToUser = require('../schemas/RandomToUser');
const User = require('../schemas/User');
const send_email = require('../utils/email')
const router = express.Router();
require('dotenv').config();

// GENERATE FORGET PASSWORD ROUTE
// post with {email}
router.post('/', async (req, res) => {
    try {
        const { email } = req.body;
        if (email === '')
            return res.status(202).json({ err: 'All Fields Required' });

        const user = await User.findOne({ email: email });
        if (!user)
            return res.status(202).json({ err: 'User does not Exist' });

        const latest_data = (await RandomToUser.find({ email: email }).sort({ time_created: 'desc' }).exec()).at(0);

        let random_id;

        if (Date.now() - latest_data.time_created > latest_data.expiry) {
            do {
                random_id = crypto.randomUUID();
            } while (await RandomToUser.findOne({ random_id: random_id }));

            const new_entry = new RandomToUser({
                email: user.email,
                random_id: random_id,
            });
            await new_entry.save();
        } else {
            random_id = latest_data.random_id;
        }

        const data = {
            subject: 'Update Your Password',
            body: `Go to this link to update your password: ${req.headers.referer}changepass?q=${random_id}`
        }

        send_email(user.email, data)
            .then(() => {
                return res.status(200).json({ msg: 'Please check your Email' });
            })
            .catch((error) => {
                return res.status(202).json({ err: 'Cannot send Email', error: error });
            });
    } catch (error) {
        return res.status(500).json({ msg: "Internal Error", err: error });
    }
});

module.exports = router;