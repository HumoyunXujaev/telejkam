import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message } = req.body;
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN; // Your bot token
    const telegramChatId = process.env.TELEGRAM_CHAT_ID; // Your chat ID

    try {
      const response = await axios.post(
        `https://api.telegram.org/bot${telegramBotToken}/sendMessage?chat_id=${telegramChatId}&text=${message}&parse_mode=HTML`
      );
      res.status(200).json({ success: true, data: response.data });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
