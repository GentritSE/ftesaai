const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const nodemailer = require('nodemailer');

const INVITATIONS_FILE = path.join(__dirname, '../data/invitations.json');
const UPLOADS_DIR = path.join(__dirname, '../uploads');

// Storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `proof-${req.params.id}-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

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

// POST /api/invitations — create new invitation
router.post('/', (req, res) => {
  const {
    brideNameAlb, groomNameAlb, brideNameEng, groomNameEng,
    weddingDate, weddingTime, venue, venueAddress,
    rsvpPhone, rsvpEmail, templateId, customMessage,
  } = req.body;

  if (!brideNameAlb || !groomNameAlb || !weddingDate || !templateId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const invitation = {
    id: uuidv4(),
    status: 'pending_payment',
    templateId: templateId || 'template1',
    brideNameAlb: brideNameAlb || '',
    groomNameAlb: groomNameAlb || '',
    brideNameEng: brideNameEng || '',
    groomNameEng: groomNameEng || '',
    weddingDate: weddingDate || '',
    weddingTime: weddingTime || '',
    venue: venue || '',
    venueAddress: venueAddress || '',
    rsvpPhone: rsvpPhone || '',
    rsvpEmail: rsvpEmail || '',
    customMessage: customMessage || '',
    generatedTextAlb: '',
    generatedTextEng: '',
    payerName: '',
    payerEmail: '',
    transactionRef: '',
    proofFilePath: '',
    createdAt: new Date().toISOString(),
    approvedAt: '',
  };

  const invitations = readInvitations();
  invitations.push(invitation);
  writeInvitations(invitations);

  res.status(201).json(invitation);
});

// POST /api/invitations/:id/generate — generate AI text
router.post('/:id/generate', async (req, res) => {
  const invitations = readInvitations();
  const idx = invitations.findIndex(inv => inv.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Invitation not found' });

  const inv = invitations[idx];

  let albanian, english;

  if (!process.env.GROQ_API_KEY) {
    // Mock text for development
    albanian = `Me gëzim të madh, familjet tona ju ftojnë të ndani gëzimin e martesës së\n\n${inv.brideNameAlb} dhe ${inv.groomNameAlb}\n\nData: ${inv.weddingDate} në orën ${inv.weddingTime}\nVendi: ${inv.venue}, ${inv.venueAddress}\n\n${inv.customMessage ? inv.customMessage + '\n\n' : ''}Ju lutemi konfirmoni praninë tuaj në:\nTel: ${inv.rsvpPhone}\nEmail: ${inv.rsvpEmail}`;
    english = `With great joy, our families invite you to share in the celebration of the marriage of\n\n${inv.brideNameEng} and ${inv.groomNameEng}\n\nDate: ${inv.weddingDate} at ${inv.weddingTime}\nVenue: ${inv.venue}, ${inv.venueAddress}\n\n${inv.customMessage ? inv.customMessage + '\n\n' : ''}Kindly confirm your attendance:\nPhone: ${inv.rsvpPhone}\nEmail: ${inv.rsvpEmail}`;
  } else {
    try {
      const Groq = require('groq-sdk');
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

      const userPrompt = `Generate a bilingual wedding invitation text in both Albanian and English.
Bride: ${inv.brideNameAlb} / ${inv.brideNameEng}
Groom: ${inv.groomNameAlb} / ${inv.groomNameEng}
Date: ${inv.weddingDate} at ${inv.weddingTime}
Venue: ${inv.venue}, ${inv.venueAddress}
Custom message from couple: ${inv.customMessage || 'None'}

Return JSON with exactly this structure:
{
  "albanian": "full formal Albanian invitation text",
  "english": "full formal English invitation text"
}`;

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a bilingual (Albanian and English) wedding invitation text writer. Write elegant, formal text for wedding invitations. Return only valid JSON.',
          },
          { role: 'user', content: userPrompt },
        ],
        model: 'llama3-8b-8192',
        temperature: 0.7,
        max_tokens: 1024,
      });

      const content = chatCompletion.choices[0]?.message?.content || '{}';
      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        albanian = parsed.albanian || '';
        english = parsed.english || '';
      } else {
        throw new Error('Invalid JSON response from Groq');
      }
    } catch (err) {
      console.error('Groq API error:', err.message);
      albanian = `Me gëzim të madh ju ftojmë në dasmën e ${inv.brideNameAlb} dhe ${inv.groomNameAlb} më datë ${inv.weddingDate} në ${inv.venue}.`;
      english = `We joyfully invite you to celebrate the wedding of ${inv.brideNameEng} and ${inv.groomNameEng} on ${inv.weddingDate} at ${inv.venue}.`;
    }
  }

  invitations[idx].generatedTextAlb = albanian;
  invitations[idx].generatedTextEng = english;
  writeInvitations(invitations);

  res.json(invitations[idx]);
});

// GET /api/invitations/:id
router.get('/:id', (req, res) => {
  const invitations = readInvitations();
  const invitation = invitations.find(inv => inv.id === req.params.id);
  if (!invitation) return res.status(404).json({ error: 'Invitation not found' });
  res.json(invitation);
});

// POST /api/invitations/:id/payment-proof
router.post('/:id/payment-proof', upload.single('proof'), async (req, res) => {
  const invitations = readInvitations();
  const idx = invitations.findIndex(inv => inv.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Invitation not found' });

  const { payerName, payerEmail, transactionRef } = req.body;
  if (!payerName || !payerEmail || !transactionRef) {
    return res.status(400).json({ error: 'payerName, payerEmail, and transactionRef are required' });
  }

  invitations[idx].payerName = payerName;
  invitations[idx].payerEmail = payerEmail;
  invitations[idx].transactionRef = transactionRef;
  invitations[idx].status = 'pending_approval';
  if (req.file) {
    invitations[idx].proofFilePath = req.file.filename;
  }
  writeInvitations(invitations);

  // Send admin notification email
  const transporter = getTransporter();
  if (transporter && process.env.ADMIN_EMAIL) {
    try {
      const inv = invitations[idx];
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.ADMIN_EMAIL,
        subject: 'Kërkesë e re për aprovim - FtesaAI',
        html: `
          <h2>Kërkesë e re për aprovim</h2>
          <p><strong>ID:</strong> ${inv.id}</p>
          <p><strong>Nusja:</strong> ${inv.brideNameAlb} / ${inv.brideNameEng}</p>
          <p><strong>Dhëndri:</strong> ${inv.groomNameAlb} / ${inv.groomNameEng}</p>
          <p><strong>Data:</strong> ${inv.weddingDate}</p>
          <hr/>
          <h3>Informacioni i paguesit</h3>
          <p><strong>Emri:</strong> ${payerName}</p>
          <p><strong>Email:</strong> ${payerEmail}</p>
          <p><strong>Referenca:</strong> ${transactionRef}</p>
          <hr/>
          <p><a href="${clientUrl}/admin">Shko te paneli i adminit</a></p>
        `,
      });
    } catch (err) {
      console.error('Failed to send admin email:', err.message);
    }
  } else {
    console.log('[DEV] Admin email would be sent for invitation:', req.params.id);
  }

  res.json({ success: true, message: 'Payment proof submitted successfully' });
});

// GET /api/invitations/:id/export/pdf
router.get('/:id/export/pdf', (req, res) => {
  const invitations = readInvitations();
  const invitation = invitations.find(inv => inv.id === req.params.id);
  if (!invitation) return res.status(404).json({ error: 'Invitation not found' });
  if (invitation.status !== 'approved') {
    return res.status(403).json({ error: 'Invitation not yet approved' });
  }
  res.json(invitation);
});

// GET /api/invitations/:id/export/png
router.get('/:id/export/png', (req, res) => {
  const invitations = readInvitations();
  const invitation = invitations.find(inv => inv.id === req.params.id);
  if (!invitation) return res.status(404).json({ error: 'Invitation not found' });
  if (invitation.status !== 'approved') {
    return res.status(403).json({ error: 'Invitation not yet approved' });
  }
  res.json(invitation);
});

module.exports = router;
