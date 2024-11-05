const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Test simple
app.get('/', (req, res) => {
    res.send('Serveur Agora Token actif');
});

// Route de génération de token
app.get('/generate-token', (req, res) => {
    console.log('Requête reçue pour generate-token');
    console.log('Paramètres:', req.query);
    
    const appID = "caaf7fcfa25f49c99f00c37a0d149bbc";
    const appCertificate = "79b39c7b15534f2fbc10ad0effd88bd9";
    const channelName = req.query.channel;
    const uid = parseInt(req.query.uid);
    
    if (!channelName || isNaN(uid)) {
        console.log('Paramètres invalides:', { channelName, uid });
        return res.status(400).json({ 
            error: 'Channel name et UID requis'
        });
    }

    try {
        const expirationTimeInSeconds = 24 * 3600;
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

        const token = RtcTokenBuilder.buildTokenWithUid(
            appID,
            appCertificate,
            channelName,
            uid,
            RtcRole.PUBLISHER,
            privilegeExpiredTs
        );

        console.log('Token généré avec succès');
        
        res.json({
            token: token,
            expires: privilegeExpiredTs,
            channel: channelName,
            uid: uid
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ 
            error: 'Erreur génération token'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur Agora Token actif sur le port ${PORT}`);
});
