// Global memory buffer
let lastReceivedData = {
    connected: false,
    username: "Disconnected",
    userId: 0,
    moneyPerSec: "$0/s",
    speed: 0,
    totalEggs: 0,
    eggsList: [],
    lastPingTimestamp: 0,
    lastUpdated: "Belum Ada Data"
};

export default function handler(req, res) {
    // CORS Header Lengkap agar Delta Executor tidak di-block
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const currentTime = Date.now();

    if (req.method === 'POST') {
        try {
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            lastReceivedData = {
                ...body,
                connected: true,
                lastPingTimestamp: currentTime,
                lastUpdated: new Date().toLocaleTimeString('id-ID')
            };
            return res.status(200).json({ status: "OK", connected: true });
        } catch (err) {
            return res.status(400).json({ error: "Invalid Payload" });
        }
    }

    if (req.method === 'GET') {
        // Jika tidak ada ping dalam 5 detik terakhir, anggap Disconnected
        const isStillConnected = (currentTime - lastReceivedData.lastPingTimestamp) < 5000;
        return res.status(200).json({
            ...lastReceivedData,
            connected: isStillConnected
        });
    }

    return res.status(405).end();
}
