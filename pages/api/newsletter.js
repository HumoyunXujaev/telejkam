import axios from 'axios';

import { createRouter } from 'next-connect';
const router = createRouter();
router.post(async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ message: 'Пожалуйста введите ваш адресс электроноой почты' });
    }
    const { url, data, headers } = mailchimphandler(email);
    await axios.post(url, data, { headers });
    return res
      .status(200)
      .json({ message: 'Вы были успешно добавлены в наши новости' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router.handler();

function mailchimphandler(email) {
  const { MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID } = process.env;

  const DATACENTER = MAILCHIMP_API_KEY.split('-')[1];

  const url = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`;
  const data = {
    email_address: email,
    status: 'subscribed',
  };

  const base64Key = Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString(
    'base64'
  );

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Basic ${base64Key}`,
  };
  return { url, data, headers };
}
