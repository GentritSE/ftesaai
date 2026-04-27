const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const INVITATIONS_FILE = path.join(__dirname, '../data/invitations.json');

function readInvitations() {
  try {
    const data = fs.readFileSync(INVITATIONS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeInvitations(invitations) {
  fs.writeFileSync(INVITATIONS_FILE, JSON.stringify(invitations, null, 2));
}

function checkAdminKey(req, res) {
  const adminKey = req.query.adminKey;
  if (!adminKey || adminKey !== process.env.SECRET_ADMIN_KEY) {
    res.status(401).json({ error: 'Unauthorized: Invalid admin key' });
    return false;
  }
  return true;
}

function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// GET /api/admin/invitations
router.get('/invitations', (req, res) => {
  if (!checkAdminKey(req, res)) return;
  const invitations = readInvitations();
  res.json(invitations);
});

// POST /api/admin/invitations/:id/approve
router.post('/invitations/:id/approve', async (req, res) => {
  if (!checkAdminKey(req, res)) return;

  const invitations = readInvitations();
  const idx = invitations.findIndex(inv => inv.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Invitation not found' });

  invitations[idx].status = 'approved';
  invitations[idx].approvedAt = new Date().toISOString();
  writeInvitations(invitations);

  const inv = invitations[idx];

  // Send approval email to user
  const transporter = getTransporter();
  if (transporter && inv.payerEmail) {
    try {
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: inv.payerEmail,
        subject: 'Ftesa juaj është gati! - FtesaAI',
        html: `
          <h2>Ftesa juaj është aprovuar! 🎉</h2>
          <p>Përshëndetje ${inv.payerName},</p>
          <p>Ftesa e dasmës për <strong>${inv.brideNameAlb} dhe ${inv.groomNameAlb}</strong> është gati!</p>
          <p>Mund ta shkarkoni ftesën tuaj duke klikuar linkun më poshtë:</p>
          <p><a href="${clientUrl}/preview/${inv.id}" style="background:#e11d48;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;">Shkarko Ftesën</a></p>
          <p>Urime dhe lumturi!</p>
          <p>Ekipi FtesaAI</p>
        `,
      });
    } catch (err) {
      console.error('Failed to send approval email:', err.message);
    }
  } else {
    console.log('[DEV] Approval email would be sent to:', inv.payerEmail);
  }

  res.json({ success: true, invitation: invitations[idx] });
});

module.exports = router;
