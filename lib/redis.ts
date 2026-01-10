import Redis from 'ioredis';

const redis = new Redis({
    host: 'redis-10138.c305.ap-south-1-1.ec2.cloud.redislabs.com',
    port: 10138,
    username: 'default',
    password: 'wQ40sYQG3OUxhvkKBzno2Zs0YZoIzhQT',
    // Usually cloud redis requires TLS, though the user snippet didn't explicitly show it, 'redislabs.com' often implies it. The user's snippet 'socket' block in generic node-redis often defaults to no-tls unless 'tls' is set.
    // However, the user provided generic options. 'redis-10138...' port 10138 might be non-TLS or TLS.
    // Standard Redis Labs often uses TLS. But let's look at the user snippet:
    // socket: { host: ... } usually implies non-TLS unless 'tls: {}' is present at root.
    // I will assume NO TLS for now as the user didn't specify it in their snippet.
});

redis.on('error', (err) => {
    console.error('Redis Client Error', err);
});

export default redis;
