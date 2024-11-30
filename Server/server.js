require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const DetailsModel = require('./Models/Details');
const UsersModel = require('./Models/Users');
const CourseModel = require('./Models/Course');
const DropsModel = require('./Models/Drops');
const CredentialModel = require('./Models/credentials');
const multer = require('multer');
const XLSX = require('xlsx');
const router = express.Router();
const app = express();

app.use(express.json());
app.use(cors());



mongoose.connect('mongodb+srv://vignesh:1234kiot.com@cluster0.cj8ilyk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});


function sendEmail({ recipient_email, OTP }) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const mail_configs = {
      from: process.env.MY_EMAIL,
      to: recipient_email,
      subject: 'PASSWORD RECOVERY',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>OTP Email Template</title>
        </head>
        <body>
        <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
          <div style="margin:50px auto;width:70%;padding:20px 0">
            <div style="border-bottom:1px solid #eee">
              <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">CECT Portal</a>
            </div>
            <p style="font-size:1.1em">Hi,</p>
            <p>Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes</p>
            <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
            <p style="font-size:0.9em;">Regards,<br />CDDA Director</p>
        </div>
        </body>
        </html>`,
    };

    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.error('Error sending email:', error);
        return reject({ message: 'An error has occurred' });
      }
      console.log('Email sent:', info.response);
      return resolve({ message: 'Email sent successfully' });
    });
  });
}

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.post('/send_recovery_email', async (req, res) => {
  const { recipient_email, OTP } = req.body;
  try {
    console.log('Recipient Email for Recovery:', recipient_email);
    const user = await UsersModel.findOne({ Email: recipient_email });
    if (!user) {
      return res.json({ message: 'User not found', success: false });
    } else {
      sendEmail({ recipient_email, OTP })
        .then((response) => res.json({ message: response.message, success: true }))
        .catch((error) => res.status(500).json({ message: error.message, success: false }));
    }
  } catch (err) {
    console.error('Error in /send_recovery_email:', err);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
});

app.get('/details', async (req, res) => {
  const email = req.query.Email; 
  try {
    const details = await DetailsModel.find({ Email: email});
    res.json(details);
  } catch (err) {
    console.error('Error retrieving details:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/getCount', async (req, res) => {
  try {
    // Fetch the first document from the collection
    const details = await CredentialModel.findOne();  // This will retrieve the first document

    if (details) {
      const countValue = details.count; // Access the count value
      console.log('Count Value:', countValue);
      res.json({ count: countValue });  // Send the count value in response
    } else {
      res.status(404).json({ message: 'No document found' });
    }
  } catch (err) {
    console.error('Error retrieving details:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/updateCount', async (req, res) => {
  try {
    // Increment the count field atomically
    const updatedDetails = await CredentialModel.findOneAndUpdate(
      {}, 
      { $inc: { count: 1 } }, // Increment the count by 1
      { new: true } // Return the updated document
    );

    if (updatedDetails) {
      res.json({ message: 'Count updated successfully', count: updatedDetails.count });
    } else {
      res.status(404).json({ message: 'No document found' });
    }
  } catch (err) {
    console.error('Error retrieving details:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/setupdatedCode', async (req, res) => {
  const { code, existcode } = req.body;

  try {
    // Find the course by the existing code (existcode) and update it
    const updatedCourse = await CourseModel.findOneAndUpdate(
      { code: existcode }, // Filter condition (existing code)
      { $set: { orgcoursecode: code } }, // The new code to set
      { new: true } // This ensures the updated document is returned
    );

    if (updatedCourse) {
      // Return the updated course if successful
      res.status(200).json({ message: 'Course updated successfully', updatedCourse });
      console.log("Code updated");
    } else {
      // If no course found with the existing code
      res.status(404).json({ message: 'Course with given code not found' });
    }
  } catch (err) {
    console.error('Error updating course:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});



app.get('/details1', async (req, res) => {
  const email = req.query.Email; 
  try {
    const details = await DropsModel.find({ Email: email});
    res.json(details);
  } catch (err) {
    console.error('Error retrieving details:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/detailsupdate', async (req, res) => {
  const email = req.query.Email; 
  try {
    const details = await DetailsModel.find({ Email: email, status:'Approved'});
    console.log(details)
    res.json(details);
  } catch (err) {
    console.error('Error retrieving details:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/detailsca', async (req, res) => {
  const { year, sec, dept} = req.query;
  try {
    const query = {};
    if (year) query.year = year;
    if (sec) query.sec = sec;
    if (dept) query.dept = dept;
    query.ca = 'no';
    query.status = 'Pending';
    const details = await DetailsModel.find(query);
    res.json(details);
  } catch (err) {
    console.error('Error retrieving details:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/updatesca', async (req, res) => {
  const { year, sec, dept } = req.query;

  try {
    const query = {};
    if (year) query.year = year;
    if (sec) query.sec = sec;
    if (dept) query.dept = dept;
    query.status = 'Mark Verification';
    const details = await DetailsModel.find(query);
    res.json(details);
  } catch (err) {
    console.error('Error retrieving details:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/detailshod', async (req, res) => {
  const { dept, ca} = req.query;
  try {
    const query = {};
    if (dept) query.dept = dept;
    if (ca) query.ca = ca;
    query.hod = 'no';
    query.status = 'Pending';
    const details = await DetailsModel.find(query);
    console.log(details);
    res.json(details);
  } catch (err) {
    console.error('Error retrieving details:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/detailsdir', async (req, res) => {
  const { hod} = req.query;
  try {
    const query = {};
    if (hod) query.hod = hod;
    query.dir = 'no'
    query.status = 'Pending'
    const details = await DetailsModel.find(query);
    console.log(details);
    res.json(details);
  } catch (err) {
    console.error('Error retrieving details:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/drops', async (req, res) => {
  const email = req.query.Email; 
  try {
    const details = await DropsModel.find({ Email: email });
    res.json(details);
  } catch (err) {
    console.error('Error retrieving details:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/dropsca', async (req, res) => {
  const { year, sec, dept} = req.query;
  try {
    const query = {};
    if (year) query.year = year;
    if (sec) query.sec = sec;
    if (dept) query.dept = dept;
    query.ca='no'
    query.status = 'Pending';
    const details = await DropsModel.find(query);
    res.json(details);
  } catch (err) {
    console.error('Error retrieving details:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/dropshod', async (req, res) => {
  const { dept, ca} = req.query;
  try {
    const query = {};
    if (dept) query.dept = dept;
    if (ca) query.ca = ca;
    query.hod = 'no'
    query.status = 'Pending'
    const details = await DropsModel.find(query);
    console.log(details);
    res.json(details);
  } catch (err) {
    console.error('Error retrieving details:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/dropsdir', async (req, res) => {
  const { hod} = req.query;
  try {
    const query = {};
    if (hod) query.hod = hod;
    query.dir = 'no'
    query.status = 'Pending'
    const details = await DropsModel.find(query);
    console.log(details);
    res.json(details);
  } catch (err) {
    console.error('Error retrieving details:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/approval', async (req, res) => {
  const { name, roll, sec, year, dept, Email, courseTitle, courseCode, orgcourseCode, offeredBy, modeOfStudy, duration, credits, assessmentMethod } = req.body;
  const status = "Pending";
  const type = "Approval";
  const ca="no";
  const hod="no";
  const dir="no";
  const courseLink = "Not Set";
  const mark = "Not Issued";
  const grade = "Not Issued";
  console.log(roll)
  const newDetails = new DetailsModel({
    name,
    roll,
    sec,
    year,
    dept,
    Email,
    courseTitle,
    courseCode,
    orgcourseCode,
    offeredBy,
    modeOfStudy,
    duration,
    credits,
    assessmentMethod,
    courseLink,
    mark,
    grade,
    status,
    type,
    ca,
    hod,
    dir,
  });

  try {
    await newDetails.save();
    console.log(newDetails);
   
   await sendMessage({ recipient_email: Email, role:req.body});

    res.status(201).json({ message: 'Course details saved and email sent successfully', success: true });
   
  } catch (error) {
    console.error('Error in /approval:', error);
    res.status(500).json({ message: 'Failed to save course details or send email', success: false });
  }
});

app.post('/drop', async (req, res) => {
  const { name, sec, year, dept, Email, courseName, courseCode, orgcourseCode,semester, category, credits} = req.body;
  const status = "Pending";
  const type = "Drop";
  const ca="no";
  const hod="no";
  const dir="no";
  const newDrops = new DropsModel({
    name,
    sec,
    year,
    dept,
    Email,
    courseName,
    courseCode,
    orgcourseCode,
    category,
    semester,
    credits,
    status,
    type,
    ca,
    hod,
    dir,
  });

  try {
    await newDrops.save();
    await sendMessage({recipient_email:Email, role:req.body});
    res.status(201).json({ message: 'Course details saved and email sent successfully', success: true });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save course details or send email', success: false });
  }
});


app.post('/login', async (req, res) => {
  const { Email, pass } = req.body;
  try {
    const user = await UsersModel.findOne({ Email });
    if (!user) {
      return res.json({ message: 'User not found', success: false });
    }
    const isMatch = await bcrypt.compare(pass, user.pass);
    if (!isMatch) {
      return res.json({ message: 'Incorrect password', success: false });
    }
    res.json({ message: user, success: true });
  } catch (err) {
    console.error('Error in /login:', err);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
});

function createEmailContent(role) {
  let subject = 'APPROVAL MESSAGE';
  let body = `
    <p>Your application for Approval for the credit transfer is approved by your ${role}</p>
  `;

  if (role === 'reject') {
    subject = 'REJECTED MESSAGE';
    body = `
      <p>Your application for Approval for the credit transfer was rejected</p>
    `;
  } else if (typeof role === 'object') {
    subject = 'YOUR REQUEST';
    if(role.type === 'drop'){
      body = `
      <p>Your request for course drop has been sent to your CA.</p>
      <p>Your Course Details:</p>
      <table style="border-collapse: collapse; width: 100%;">
        <tr>
          <th style="border: 1px solid #ddd; padding: 6px;">Course Name</th>
          <td style="border: 1px solid #ddd; padding: 6px;">${role.courseName}</td>
        </tr>
        <tr>
          <th style="border: 1px solid #ddd; padding: 6px;">Course Code</th>
          <td style="border: 1px solid #ddd; padding: 6px;">${role.courseCode}</td>
        </tr>
        <tr>
          <th style="border: 1px solid #ddd; padding: 6px;">Course Code</th>
          <td style="border: 1px solid #ddd; padding: 6px;">${role.orgcourseCode}</td>
        </tr>
        <tr>
          <th style="border: 1px solid #ddd; padding: 6px;">Category</th>
          <td style="border: 1px solid #ddd; padding: 6px;">${role.category}</td>
        </tr>
        <tr>
          <th style="border: 1px solid #ddd; padding: 6px;">Semester</th>
          <td style="border: 1px solid #ddd; padding: 6px;">${role.semester}</td>
        </tr>
        <tr>
          <th style="border: 1px solid #ddd; padding: 6px;">Credits</th>
          <td style="border: 1px solid #ddd; padding: 6px;">${role.credits}</td>
        </tr>
      </table>
    `;

    }else if(role.status === 'Mark Verification'){
      body = `
        <p>Your request for mark verification has been sent to your CA.</p>
        <p>Your Course Details:</p>
        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <th style="border: 1px solid #ddd; padding: 6px;">Course Title</th>
            <td style="border: 1px solid #ddd; padding: 6px;">${role.courseTitle}</td>
          </tr>
          <tr>
            <th style="border: 1px solid #ddd; padding: 6px;">Mark</th>
            <td style="border: 1px solid #ddd; padding: 6px;">${role.mark}</td>
          </tr>
          <tr>
            <th style="border: 1px solid #ddd; padding: 6px;">Grade</th>
            <td style="border: 1px solid #ddd; padding: 6px;">${role.grade}</td>
          </tr>
          <tr>
            <th style="border: 1px solid #ddd; padding: 6px;">Course Link</th>
            <td style="border: 1px solid #ddd; padding: 6px;"><a href=${role.courseLink}>Click this link to view certificate</a></td>
          </tr>
        </table>
      `;}else if(role.status === 'Mark Updated'){
        body = `
          <p>Your request for mark verification has been verified by your CA.</p>
        `;}
    else{
    body = `
      <p>Your request for course Approval has been sent to your CA.</p>
      <p>Your Course Details:</p>
      <table style="border-collapse: collapse; width: 100%;">
        <tr>
          <th style="border: 1px solid #ddd; padding: 6px;">Course Title</th>
          <td style="border: 1px solid #ddd; padding: 6px;">${role.courseTitle}</td>
        </tr>
        <tr>
          <th style="border: 1px solid #ddd; padding: 6px;">Course Code</th>
          <td style="border: 1px solid #ddd; padding: 6px;">${role.courseCode}</td>
        </tr>
        <tr>
          <th style="border: 1px solid #ddd; padding: 6px;">Course Code</th>
          <td style="border: 1px solid #ddd; padding: 6px;">${role.orgcourseCode}</td>
        </tr>
        <tr>
          <th style="border: 1px solid #ddd; padding: 6px;">Offered By</th>
          <td style="border: 1px solid #ddd; padding: 6px;">${role.offeredBy}</td>
        </tr>
        <tr>
          <th style="border: 1px solid #ddd; padding: 6px;">Mode of Study</th>
          <td style="border: 1px solid #ddd; padding: 6px;">${role.modeOfStudy}</td>
        </tr>
        <tr>
          <th style="border: 1px solid #ddd; padding: 6px;">Duration</th>
          <td style="border: 1px solid #ddd; padding: 6px;">${role.duration}</td>
        </tr>
        <tr>
          <th style="border: 1px solid #ddd; padding: 6px;">Credits</th>
          <td style="border: 1px solid #ddd; padding: 6px;">${role.credits}</td>
        </tr>
        <tr>
          <th style="border: 1px solid #ddd; padding: 6px;">Assessment Method</th>
          <td style="border: 1px solid #ddd; padding: 6px;">${role.assessmentMethod}</td>
        </tr>
      </table>
    `;}
  }

  return { subject, body };
}


function sendMessage({ recipient_email, role }) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const { subject, body } = createEmailContent(role);

    const mail_configs = {
      from: process.env.MY_EMAIL,
      to: recipient_email,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>${subject}</title>
        </head>
        <body>
        <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
          <div style="margin:50px auto;width:70%;padding:20px 0">
            <div style="border-bottom:1px solid #eee">
              <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">CECT Portal</a>
            </div>
            <p style="font-size:1.1em">Hi,</p>
            ${body}
            <p style="font-size:0.9em;">Regards,<br />CDDA Director</p>
        </div>
        </body>
        </html>`,
    };

    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.error('Error sending email:', error);
        return reject({ message: 'An error has occurred' });
      }
      console.log('Email sent:', info.response);
      return resolve({ message: 'Email sent successfully' });
    });
  });
}

function createEmailContentDrop(role) {
  let subject = 'APPROVAL MESSAGE';
  let body = `
    <p>Your application for Course drop for the credit transfer is approved by your ${role}</p>
  `;

  if (role === 'reject') {
    subject = 'REJECTED MESSAGE';
    body = `
      <p>Your application for Course drop for the credit transfer was rejected</p>
    `;
  }

  return { subject, body };
}


function sendMessageDrop({ recipient_email, role }) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const { subject, body } = createEmailContentDrop(role);

    const mail_configs = {
      from: process.env.MY_EMAIL,
      to: recipient_email,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>${subject}</title>
        </head>
        <body>
        <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
          <div style="margin:50px auto;width:70%;padding:20px 0">
            <div style="border-bottom:1px solid #eee">
              <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">CECT Portal</a>
            </div>
            <p style="font-size:1.1em">Hi,</p>
            ${body}
            <p style="font-size:0.9em;">Regards,<br />CDDA Director</p>
        </div>
        </body>
        </html>`,
    };

    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.error('Error sending email:', error);
        return reject({ message: 'An error has occurred' });
      }
      console.log('Email sent:', info.response);
      return resolve({ message: 'Email sent successfully' });
    });
  });
}

app.post('/approveca', async (req, res) => {
  const { id, Email } = req.body;
  try {
    const updatedDetails = await DetailsModel.findByIdAndUpdate(id, { status: 'Pending', ca: 'yes' }, { new: true });
    await sendMessage({ recipient_email: Email, role: 'Class Advisor' });
    res.json({ message: 'Course approval status updated to pending', success: true, updatedDetails });
  } catch (err) {
    console.error('Error in /approveca:', err);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
});

app.post('/approvehod', async (req, res) => {
  const { id, Email } = req.body;
  try {
    const updatedDetails = await DetailsModel.findByIdAndUpdate(id, { status: 'Pending', hod: 'yes' }, { new: true });
    await sendMessage({ recipient_email: Email, role: 'HOD' });
    res.json({ message: 'Course approval status updated to pending', success: true, updatedDetails });
  } catch (err) {
    console.error('Error in /approvehod:', err);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
});

app.post('/approve', async (req, res) => {
  const { id, Email } = req.body;
  try {
    const updatedDetails = await DetailsModel.findByIdAndUpdate(id, { status: 'Approved', dir: 'yes' }, { new: true });
    await sendMessage({ recipient_email: Email, role: 'CDDA Director' });
    res.json({ message: 'Course approval status updated to Approved', success: true, updatedDetails });
  } catch (err) {
    console.error('Error in /approve:', err);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
});

app.post('/approvemark', async (req, res) => {
  const { id, Email } = req.body;
  try {
    const updatedDetails = await DetailsModel.findByIdAndUpdate(id, { status: 'Approved', ca: 'yes' }, { new: true });
    await sendMessage({ recipient_email: Email, role: 'Mark Updated' });
    res.json({ message: 'Course approval status updated to Approved', success: true, updatedDetails });
  } catch (err) {
    console.error('Error in /approve:', err);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
});

app.post('/dropca', async (req, res) => {
  const { id, Email } = req.body;
  try {
    const updatedDetails = await DropsModel.findByIdAndUpdate(id, { status: 'Pending', ca: 'yes' }, { new: true });
    await sendMessageDrop({ recipient_email: Email, role: 'Class Advisor' });
    res.json({ message: 'Course approval status updated to pending', success: true, updatedDetails });
  } catch (err) {
    console.error('Error in /approveca:', err);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
});

app.post('/drophod', async (req, res) => {
  const { id, Email } = req.body;
  try {
    const updatedDetails = await DropsModel.findByIdAndUpdate(id, { status: 'Pending', hod: 'yes' }, { new: true });
    await sendMessageDrop({ recipient_email: Email, role: 'HOD' });
    res.json({ message: 'Course approval status updated to pending', success: true, updatedDetails });
  } catch (err) {
    console.error('Error in /approvehod:', err);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
});

app.post('/dropcourse', async (req, res) => {
  const { id, Email } = req.body;
  try {
    const updatedDetails = await DropsModel.findByIdAndUpdate(id, { status: 'Approved', dir: 'yes' }, { new: true });
    await sendMessageDrop({ recipient_email: Email, role: 'CDDA Director' });
    res.json({ message: 'Course approval status updated to Approved', success: true, updatedDetails });
  } catch (err) {
    console.error('Error in /approve:', err);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
});


app.post('/rejectca', async (req, res) => {
  const { id, Email } = req.body;
  console.log('Hii')
  try {
    const updatedDetails = await DetailsModel.findByIdAndUpdate(id, { status: 'Rejected' ,ca: 'no' }, { new: true });
    await sendMessageDrop({ recipient_email: Email, role: 'reject' });
    res.json({ message: 'Course approval status updated to Rejected', success: true, updatedDetails });
  } catch (err) {
    console.error('Error in /reject:', err);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
});

app.post('/rejecthod', async (req, res) => {
  const { id, Email } = req.body;
  try {
    const updatedDetails = await DetailsModel.findByIdAndUpdate(id, { status: 'Rejected', hod: 'no' }, { new: true });
    await sendMessageDrop({ recipient_email: Email, role: 'reject' });
    res.json({ message: 'Course approval status updated to Rejected', success: true, updatedDetails });
  } catch (err) {
    console.error('Error in /reject:', err);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
});

app.post('/reject', async (req, res) => {
  const { id, Email } = req.body;
  try {
    const updatedDetails = await DetailsModel.findByIdAndUpdate(id, { status: 'Rejected', dir: 'no' }, { new: true });
    await sendMessageDrop({ recipient_email: Email, role: 'reject' });
    res.json({ message: 'Course approval status updated to Rejected', success: true, updatedDetails });
  } catch (err) {
    console.error('Error in /reject:', err);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
});


app.post('/rejectsca', async (req, res) => {
  const { id, Email } = req.body;
  try {
    const updatedDetails = await DropsModel.findByIdAndUpdate(id, { status: 'Rejected' ,ca: 'no' }, { new: true });
    await sendMessageDrop({ recipient_email: Email, role: 'reject' });
    res.json({ message: 'Course approval status updated to Rejected', success: true, updatedDetails });
  } catch (err) {
    console.error('Error in /reject:', err);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
});

app.post('/rejectshod', async (req, res) => {
  const { id, Email } = req.body;
  try {
    const updatedDetails = await DropsModel.findByIdAndUpdate(id, { status: 'Rejected', hod: 'no' }, { new: true });
    await sendMessageDrop({ recipient_email: Email, role: 'reject' });
    res.json({ message: 'Course approval status updated to Rejected', success: true, updatedDetails });
  } catch (err) {
    console.error('Error in /reject:', err);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
});

app.post('/rejects', async (req, res) => {
  const { id, Email } = req.body;
  try {
    const updatedDetails = await DropsModel.findByIdAndUpdate(id, { status: 'Rejected', dir: 'no' }, { new: true });
    await sendMessageDrop({ recipient_email: Email, role: 'reject' });
    res.json({ message: 'Course approval status updated to Rejected', success: true, updatedDetails });
  } catch (err) {
    console.error('Error in /reject:', err);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
});


app.post("/reset-password", async (req, res) => {
  const { Email, newPassword } = req.body; // Changed `email` to `Email`
  
  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    const updatedUser = await UsersModel.findOneAndUpdate(
      { Email }, // Match the user by `Email`
      { pass: hashedPassword }, // Update the `pass` field with the new hashed password
      { new: true } // Option to return the updated document
    );

    if (!updatedUser) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error('Error in /reset-password:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post('/api/courses', async (req, res) => {
  const { code, name, credit, week } = req.body;
  try {
    const newCourse = new CourseModel({ code, name, credit, week });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ message: 'Error adding course', error });
  }
});

app.get('/api/courses', async (req, res) => {
  try {
    const courses = await CourseModel.find();
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const headerMapping = {
  'Course ID': 'code',
  'Course Name': 'name',
  'Duration': 'week'
};

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert the sheet to JSON using the 11th row (index 10) as the header
    const jsonData = XLSX.utils.sheet_to_json(sheet, {
      header: 1, // Get data as an array of arrays
      range: 10 // Start reading from the 11th row (index 10)
    });

    // Get headers from the 11th row and data from the 12th row onward
    const headers = jsonData[0];
    const data = jsonData.slice(1).map(row => {
      const rowData = {};
      headers.forEach((header, index) => {
        // Use the mapping to transform headers to schema fields
        const schemaField = headerMapping[header];
        if (schemaField) {
          rowData[schemaField] = row[index];
        }
      });
      return rowData;
    });

    await CourseModel.insertMany(data);
    res.status(200).send('Data successfully stored to MongoDB');
  } catch (err) {
    res.status(500).send(err);
  }
});


// Route to delete a course
app.delete('/api/courses/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await CourseModel.findByIdAndDelete(id);
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error });
  }
});

app.delete('/api/courses', async (req, res) => {
  try {
    await CourseModel.deleteMany({});
    res.status(200).json({ message: 'All courses deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting courses', error });
  }
});


app.post('/markupdation', async (req, res) => {
  const { name, sec, year, dept, Email, courseTitle, mark, grade, courseLink } = req.body;

  try {
    if (!name || !sec || !year || !dept || !Email || !courseTitle || !mark || !grade) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const updatedDetails = await DetailsModel.findOneAndUpdate(
      { name, sec, year, dept, Email, courseTitle },
      {courseLink, mark, grade, ca: 'no', status: 'Mark Verification' },
      { new: true } 
    );

    if (!updatedDetails) {
      return res.status(404).json({ message: 'Details not found' });
    }
    console.log(updatedDetails);
    await sendMessage({recipient_email:Email, role:updatedDetails});
    res.status(200).json(updatedDetails);
  } catch (error) {
    console.error('Error updating details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/detailsapproved', async (req, res) => {
  const { role } = req.query;

  if (!role) {
    return res.status(400).json({ error: 'Role is required' });
  }

  let filter = {};

  switch (role) {
    case 'ca':
      filter.ca = "yes";
      break;
    case 'hod':
      filter.hod = "yes";
      break;
    case 'dir':
      filter.dir = "yes";
      break;
    default:
      return res.status(400).json({ error: 'Invalid role' });
  }
  try {
    const details = await DetailsModel.find(filter);
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching details' });
  }
});

app.get('/detailsapproveddrop', async (req, res) => {
  const { role } = req.query;

  if (!role) {
    return res.status(400).json({ error: 'Role is required' });
  }

  let filter = {};

  switch (role) {
    case 'ca':
      filter.ca = "yes";
      break;
    case 'hod':
      filter.hod = "yes";
      break;
    case 'dir':
      filter.dir = "yes";
      break;
    default:
      return res.status(400).json({ error: 'Invalid role' });
  }
  try {
    const details = await DropsModel.find(filter);
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching details' });
  }
});

app.get('/detailsrejected', async (req, res) => {
  try {
    const details = await DetailsModel.find({status:'Rejected'});
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching details' });
  }
});

app.get('/detailsrejecteddrop', async (req, res) => {
  try {
    const details = await DropsModel.find({status:'Rejected'});
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching details' });
  }
});

app.post('/deletedetails', async (req, res) => {
  const { role } = req.query;
  console.log("Role:", role);

  if (!role) {
      return res.status(400).json({ error: 'Role is required' });
  }

  let filter = {};

  switch (role) {
      case 'ca':
          filter.ca = "yes";
          break;
      case 'hod':
          filter.hod = "yes";
          break;
      case 'dir':
          filter.dir = "yes";
          break;
      default:
          return res.status(400).json({ error: 'Invalid role' });
  }

  try {
      const details = await DetailsModel.deleteMany(filter);
      res.json({ message: 'Details deleted successfully', details });
  } catch (error) {
      console.error('Error deleting details:', error);
      res.status(500).json({ error: 'Error deleting details' });
  }
});

app.post('/deletedetailsdrop', async (req, res) => {
  const { role } = req.query;


  if (!role) {
      return res.status(400).json({ error: 'Role is required' });
  }

  let filter = {};

  switch (role) {
      case 'ca':
          filter.ca = "yes";
          break;
      case 'hod':
          filter.hod = "yes";
          break;
      case 'dir':
          filter.dir = "yes";
          break;
      default:
          return res.status(400).json({ error: 'Invalid role' });
  }

  try {
      const details = await DropsModel.deleteMany(filter);
      res.json({ message: 'Details deleted successfully', details });
  } catch (error) {
      console.error('Error deleting details:', error);
      res.status(500).json({ error: 'Error deleting details' });
  }
});



app.post('/deletedetails1', async(req,res) =>{
  try{
    await DetailsModel.deleteMany({status:"Rejected"});
    res.json({ message: 'Details deleted successfully'});
  }catch(err){
    console.error(err);
  }
})

app.post('/deletedetailsdrop1', async(req,res) =>{
  try{
    await DropsModel.deleteMany({status:"Rejected"});
    res.json({ message: 'Details deleted successfully'});
  }catch(err){
    console.error(err);
  }
})

app.post('/approveallhod', async (req, res) => {
  try {
    const { ids } = req.body;
    for (const id of ids) {
      const student = await DetailsModel.findByIdAndUpdate(id, { hod:'yes' }, { new: true });
      if (student) {
        console.log(student.Email)
        await sendMessage({recipient_email:student.Email,role:'HOD'}); 
      }
    }

    res.status(200).json({ success: true});
  } catch (error) {
    console.error('Error')}})

    app.post('/approveallhoddrop', async (req, res) => {
      try {
        const { ids } = req.body;
        for (const id of ids) {
          const student = await DropsModel.findByIdAndUpdate(id, { hod:'yes' }, { new: true });
          if (student) {
            await sendMessage({recipient_email:student.Email,role:'HOD'}); 
          }
        }
    
        res.status(200).json({ success: true});
      } catch (error) {
        console.error('Error')}})

    app.post('/approveall', async (req, res) => {
      try {
        const { ids } = req.body;
        
    
        for (const id of ids) {
          const student = await DetailsModel.findByIdAndUpdate(id, { dir:'yes', status:"Approved" }, { new: true });
          if (student) {
           
            await sendMessage({recipient_email:student.Email,role:'CDDA Director '}); 
          }
        }
    
        res.status(200).json({ success: true });
      } catch (error) {
        console.error('Error')}})

        app.post('/approvealldrop', async (req, res) => {
          try {
            const { ids } = req.body;
            
        
            for (const id of ids) {
              const student = await DropsModel.findByIdAndUpdate(id, { dir:'yes', status:"Approved" }, { new: true });
              if (student) {
               
                await sendMessage({recipient_email:student.Email,role:'HOD'}); 
              }
            }
        
            res.status(200).json({ success: true });
          } catch (error) {
            console.error('Error')}})


app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
