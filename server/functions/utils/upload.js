const mime = require("mime");
const BusBoy = require("busboy");
const path = require("path");
const os = require("os");
const fs = require("fs");
const { Storage } = require("@google-cloud/storage");

const { config } = require("../scripts/utils");

const storage = new Storage({
  projectId: config.firebaseConfig.projectId,
  credentials: config.privateCertificate
});

const bucket = storage.bucket(config.firebaseConfig.storageBucket);

const getPublicUrl = storageName => {
  return `https://firebasestorage.googleapis.com/v0/b/${
    config.firebaseConfig.storageBucket
  }/o/${encodeURIComponent(storageName)}?alt=media`;
};

const uploadToBucket = (filepath, fileName, mimetype) => {
  return new Promise((resolve, reject) => {
    bucket
      .upload(filepath, {
        destination: fileName,
        uploadType: "media",
        metadata: {
          contentType: mimetype
        }
      })
      .then(data => resolve(getPublicUrl(data[0].name)))
      .catch(error => reject(error));
  });
};

exports.upload = (req, allowedExtensions) => {
  const busboy = new BusBoy({ headers: req.headers });
  let fileToBeUploaded = {};
  let valid = true;
  return new Promise((resolve, reject) => {
    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      const fileExtension = mime.getExtension(mimetype);
      valid = allowedExtensions.includes(fileExtension);
      // 32756238461724837.png
      const newFileName = `${Math.round(
        Math.random() * 1000000000000
      ).toString()}.${fileExtension}`;
      const filepath = path.join(os.tmpdir(), newFileName);
      file.pipe(fs.createWriteStream(filepath));
      fileToBeUploaded = { filepath, fileName: newFileName, mimetype };
    });
    busboy.on("finish", () => {
      if (valid) {
        uploadToBucket(
          fileToBeUploaded.filepath,
          fileToBeUploaded.fileName,
          fileToBeUploaded.mimetype
        )
          .then(publicUrl => resolve(publicUrl))
          .catch(error => reject(error));
      } else {
        const error = { status: 400, error: "Wrong file type submitted" };
        reject(error);
      }
    });
    busboy.end(req.rawBody);
  });
};
