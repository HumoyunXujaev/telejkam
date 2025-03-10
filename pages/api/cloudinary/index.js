import nextConnect from 'next-connect';
import cloudinary from 'cloudinary';
import bodyParser from 'body-parser';
import fs from 'fs';
import fileUpload from 'express-fileupload';
import os from 'os';
import path from 'path';
import { imgMiddleware } from '@/middleware/imgMiddleware';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

import { createRouter } from 'next-connect';
const router = createRouter();
const tempDir = path.join(os.tmpdir(), 'myapp');
fs.mkdirSync(tempDir, { recursive: true });

router.use(fileUpload({ useTempFiles: true, tempFileDir: tempDir }));
//Dùng middleware imgMiddleware
router.use(imgMiddleware);

// export const config = {
//   api: {
//     bodyParser: {
//       sizeLimit: '20mb', // Increase to 10MB or adjust as needed
//     },
//     responseLimit: false,
//   },
// };
export const config = {
  api: {
    bodyParser: false, // Disable built-in body parser
  },
};

//Handle request upload ảnh
router.post(async (req, res) => {
  try {
    //Extract path từ body - path là path của folder mà ta muốn lưu ảnh
    const { path } = req.body;

    //Truy cập file thông qua req.files nhờ middleware express-fileUpload
    let files = Object.values(req.files).flat();

    let images = [];

    for (const file of files) {
      const img = await uploadToCloudinaryHandler(file, path);
      images.push(img);

      //Sau khi upload ảnh lên Cloudinary thành công, xoá ảnh trong folder tmp
      removeTmp(file.tempFilePath);
    }
    return res.json(images);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//Handle request delete ảnh
router.delete(async (req, res) => {
  let image_id = req.body.public_id;
  cloudinary.v2.uploader.destroy(image_id, (err, res) => {
    if (err) {
      return res.status(404).json({ success: false, err });
    }

    res.json({ success: true });
  });
});

const uploadToCloudinaryHandler = async (file, path) => {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      { folder: path },
      (err, res) => {
        if (err) {
          removeTmp(file.tempFilePath);
          console.log(err);
          return res.status(400).json({ message: 'Upload image failed.' });
        }

        resolve({ url: res.secure_url, public_url: res.public_id });
      }
    );
  });
};

const removeTmp = (path) => {
  fs.unlink(path, (error) => {
    if (error) throw error;
  });
};

export default router.handler();
