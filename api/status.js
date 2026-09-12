// Memori sementara untuk menyimpan status terbaru di Vercel Serverless
let globalState = {
    username: "Menunggu Delta...",
    userId: 0,
    moneyPerSec: "$0/s",
    speed: 16,
    totalEggs: 0,
    eggsList: [],
    lastUpdated: "Belum Ada Data"
};

export default function handler(req, res) {
    // CORS Header agar Delta Executor bisa mengirim request tanpa terblokir
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'POST') {
        try {
            const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            globalState = {
                ...data,
                lastUpdated: new Date().toLocaleTimeString('id-ID')
            };
            return res.status(200).json({ status: "success", message: "Data terupdate!" });
        } catch (err) {
            return res.status(400).json({ status: "error", message: "Invalid JSON Data" });
        }
    } 

    if (req.method === 'GET') {
        return res.status(200).json(globalState);
    }

    return res.status(45)
}
