const mongoose = require('mongoose');
const aws = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const s3 = new aws.S3();

const PostSchema = new mongoose.Schema({
  name: String,
  size: Number,
  key: String,
  url: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

PostSchema.pre('save', function() {
  if (!this.url) {
    this.url = `${process.env.APP_URL}:${process.env.APP_PORT}/files/${this.key}`;
  }
});

PostSchema.pre('remove', function() {
  if (process.env.APP_STORAGE === 's3') {
    var params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: this.key
    };

    return s3
      .deleteObject(params, function(err) {
        if (err) console.log(err, err.stack);
        // an error occurred
      })
      .promise();

    /* return s3
      .deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: this.key
      })
      .promisse(); */
  } else {
    return promisify(fs.unlink)(
      path.resolve(__dirname, '..', '..', 'tmp', 'uploads', this.key)
    );
  }
});

module.exports = mongoose.model('Post', PostSchema);
