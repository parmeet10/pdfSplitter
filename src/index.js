const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { PDFDocument } = require('pdf-lib');

const splitPDF = async (pdfFilePath) => {
  const data = await fs.promises.readFile(pdfFilePath);
  const readPdf = await PDFDocument.load(data);
  const { length } = readPdf.getPages();

  for (let i = 0, n = length; i < n; i += 1) {
    const writePdf = await PDFDocument.create();
    const [page] = await writePdf.copyPages(readPdf, [i]);
    writePdf.addPage(page);
    const bytes = await writePdf.save();
    const filePath = `${i+1}.pdf`;
    await fs.promises.writeFile(filePath, bytes);
     uploadToS3(filePath,i);
  }
};

const uploadToS3 = async(file,index) => {
const s3 = new AWS.S3({
    accessKeyId:'',  // your accessKeyId
    secretAccessKey:'', // your secretAccessKey
    s3UseArnRegion: true
  });

  s3Params = {};
  s3Params.Bucket = 'msil-s3-assist-public';
  s3Params.Key = `temp/${file}`;
  s3Params.Body = fs.readFileSync(file);
  s3Params.ACL = 'public-read';
  let result =  s3.putObject(s3Params).promise();
  
};  
splitPDF('Grand Vitara-Draft OM.pdf');   // your pdf file path


