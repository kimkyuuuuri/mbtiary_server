const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3")

AWS.config.update({
  region: "ap-northeast-2",
  accessKeyId: "AKIAQ5EZKOU7QAF3DZHX",
  secretAccessKey: "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",
});

const s3 = new AWS.S3();

// const allowedExtensions = [".png", ".jpg", ".jpeg", "bmp"];

const profileImageUploader = multer({
  storage: multerS3({
    s3: s3,
    bucket: "mbtiary",
    key: (req, file, callback) => {
      callback(null, `ProfileImage/${Date.now()}_${file.originalname}`);
    },
    acl: "public-read-write",
  }),

});

const diaryImageUploader = multer({
  storage: multerS3({
    s3: s3,
    bucket: "mbtiary",
    key: (req, file, callback) => {
      callback(null, `DiaryImage/${Date.now()}_${file.originalname}`);
    },
    acl: "public-read-write",
  }),
});

module.exports = profileImageUploader;
module.exports = diaryImageUploader;
