const express = require('express');
const QRCode = require('qrcode');
const os = require('os');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const interface of interfaces[name]) {
            if (interface.family === 'IPv4' && !interface.internal) {
                return interface.address;
            }
        }
    }
    return 'localhost';
}

app.use(express.static('.'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/qr', async (req, res) => {
    try {
        const localIP = getLocalIP();
        const url = `http://${localIP}:${PORT}`;
        const qrCode = await QRCode.toDataURL(url, {
            width: 300,
            margin: 2,
            color: {
                dark: '#667eea',
                light: '#ffffff'
            }
        });
        
        res.json({
            url: url,
            qrCode: qrCode,
            ip: localIP,
            port: PORT
        });
    } catch (error) {
        res.status(500).json({ error: 'QRコード生成に失敗しました' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    const localIP = getLocalIP();
    console.log('🎯 Tech Hub カードシステム起動中...\n');
    console.log('📱 参加者用URL:');
    console.log(`   http://${localIP}:${PORT}`);
    console.log(`   http://localhost:${PORT}`);
    console.log('\n🔧 管理者用URL:');
    console.log(`   http://${localIP}:${PORT}/admin`);
    console.log(`   http://localhost:${PORT}/admin`);
    console.log('\n✨ QRコードは管理者ページで確認できます');
    console.log('🚀 サーバー準備完了！\n');
});