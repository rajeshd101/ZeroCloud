
const mdns = require('multicast-dns')({
    reuseAddr: true,
    loopback: true
});
const os = require('os');

const SERVICE_NAME = 'ZeroCloud';
const HOSTNAME = os.hostname();
const PEER_ID = process.argv[2] || 'PeerA';

console.log(`[${PEER_ID}] Starting...`);

mdns.on('response', (response) => {
    response.answers.forEach(a => {
        if (a.name && a.name.toLowerCase() === SERVICE_NAME.toLowerCase() && a.type === 'TXT') {
            try {
                let rawData = a.data;
                if (Array.isArray(rawData)) {
                    rawData = Buffer.concat(rawData.map(b => Buffer.isBuffer(b) ? b : Buffer.from(b)));
                }
                const data = JSON.parse(rawData.toString());
                if (data.hostname !== PEER_ID) { // Using PEER_ID as hostname for test
                    console.log(`[${PEER_ID}] Found peer: ${data.hostname}`);
                }
            } catch (e) {
                // ignore
            }
        }
    });
});

mdns.on('query', (query) => {
    if (query.questions.some(q => q.name && q.name.toLowerCase() === SERVICE_NAME.toLowerCase())) {
        console.log(`[${PEER_ID}] Received query, responding...`);
        mdns.respond({
            answers: [{
                name: SERVICE_NAME,
                type: 'TXT',
                data: [JSON.stringify({ hostname: PEER_ID, port: 1234 })]
            }]
        });
    }
});

// Original behavior: No initial query, just respond (announce)
mdns.respond({
    answers: [{
        name: SERVICE_NAME,
        type: 'TXT',
        data: [JSON.stringify({ hostname: PEER_ID, port: 1234 })]
    }]
});

const query = () => {
    console.log(`[${PEER_ID}] Sending query...`);
    mdns.query({
        questions: [{ name: SERVICE_NAME, type: 'TXT' }]
    });
};

// IMMEDIATE DISCOVERY: Burst of queries
query();
setTimeout(query, 500);
setTimeout(query, 1000);
setTimeout(query, 2000);

// Original behavior: Query every 5 seconds
setInterval(query, 5000);

// Keep alive
setTimeout(() => {
    console.log(`[${PEER_ID}] Exiting...`);
    process.exit(0);
}, 12000);
