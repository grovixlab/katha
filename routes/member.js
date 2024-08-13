const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const QRCode = require('qrcode');
let mongoose = require('mongoose');
let ObjectId = mongoose.Types.ObjectId;

const isAuthorised = (req, res, next) => {
    try {
        if (!req.session.logged) {
            res.redirect('/auth/login');
        } else {
            next();
        }
    } catch (error) {
        console.error(error);
        console.error("Error:", err);
    }
}

const isNotAuthorised = (req, res, next) => {
    try {
        if (!req.session.logged) {
            next();
        } else {
            res.redirect('/');
        }
    } catch (error) {
        console.error(error);
        console.error("Error:", err);
    }
}

async function generateUniqueId() {
    let uniqueId = await 'LR' + Math.floor(10000 + Math.random() * 90000);
    let student = await Member.findOne({ studentId: uniqueId }).lean();
    student ? uniqueId = await 'LR' + Math.floor(10000 + Math.random() * 90000) : null;
    return uniqueId;
}


// Member Registration Route
router.get('/register', isAuthorised, (req, res) => {
    res.render('student-register', { title: "Register Member" });
});

router.post('/register', isAuthorised, async (req, res) => {
    const { studentName, registerNumber, standard, division } = req.body;
    let student = await Member.findOne({ registerNumber: registerNumber }).lean();
    if (student) {
        return res.render('student-register', { title: "Register Member", error: { message: 'Member already registered.' } });
    }
    const studentId = await generateUniqueId();

    try {
        // Create a document
        const doc = new PDFDocument();
        const student = new Member({ studentName, registerNumber, standard, division, studentId: studentId });
        await student.save();

        // Generate QR code 
        const qrData = JSON.stringify({ studentId, studentName, registerNumber, standard, division });
        const qrCodeUrl = await QRCode.toDataURL(qrData);

        doc.fontSize(16).text('Luminara', { align: 'center' });
        doc.fontSize(12).text(`Member ID: ${studentId}`);
        doc.text(`Name: ${studentName}`);
        doc.text(`Register Number: ${registerNumber}`);
        doc.text(`Standard: ${standard}`);
        doc.text(`Division: ${division}`);
        doc.text(' ');
        doc.image(qrCodeUrl, { fit: [100, 100], align: 'center' });

        doc.pipe(res);

        doc.end();

        // res.redirect('/students/register');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Fetch Member by ID
router.get('/api/student/:id', async (req, res) => {
    const studentId = req.params.id;

    if (!studentId) {
        return res.status(400).json({ message: 'Invalid student ID' });
    }

    try {
        const student = await Member.findOne({ studentId: studentId });
        if (student) {
            res.json({ studentName: student.studentName });
        } else {
            res.status(404).json({ message: 'Member not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
