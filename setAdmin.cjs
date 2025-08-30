const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const adminEmails = ['aczaao12@gmail.com', '23129398@st.hcmuaf.edu.vn', 'dh23vt.ceft@gmail.com',];

async function setAdminClaims() {
  for (const email of adminEmails) {
    try {
      const user = await admin.auth().getUserByEmail(email);
      await admin.auth().setCustomUserClaims(user.uid, { admin: true });
      console.log(`Successfully set admin claim for ${email}`);
    } catch (error) {
      console.error(`Error setting admin claim for ${email}:`, error.message);
    }
  }
  process.exit();
}

setAdminClaims();
