export interface Invitation {
  id: string;
  status: 'pending_payment' | 'pending_approval' | 'approved';
  templateId: string;
  brideNameAlb: string;
  groomNameAlb: string;
  brideNameEng: string;
  groomNameEng: string;
  weddingDate: string;
  weddingTime: string;
  venue: string;
  venueAddress: string;
  rsvpPhone: string;
  rsvpEmail: string;
  customMessage: string;
  generatedTextAlb: string;
  generatedTextEng: string;
  payerName: string;
  payerEmail: string;
  transactionRef: string;
  proofFilePath: string;
  createdAt: string;
  approvedAt: string;
}

export interface CreateFormData {
  brideNameAlb: string;
  groomNameAlb: string;
  brideNameEng: string;
  groomNameEng: string;
  weddingDate: string;
  weddingTime: string;
  venue: string;
  venueAddress: string;
  rsvpPhone: string;
  rsvpEmail: string;
  customMessage: string;
  templateId: string;
}
