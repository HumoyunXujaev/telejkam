const fs = require('fs');

export const imgMiddleware = async (req, res, next) => {
  try {
    if (!req.files) {
      return res.status(400).json({ message: 'No files were chosen.' });
    }

    let files = Object.values(req.files).flat();

    for (const file of files) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
        removeTmp(file.tempFilePath);
        return res.status(400).json({
          message:
            'File format is incorrect, only JPEG, PNG, WEBP are allowed.',
        });
      }

      if (file.size > 1024 * 1024 * 10) {
        removeTmp(file.tempFilePath);
        return res.status(400).json({
          message: 'File size is too large, maximum 10MB allowed.',
        });
      }
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeTmp = (path) => {
  fs.unlink(path, (error) => {
    if (error) throw error;
  });
};
