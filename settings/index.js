module.exports = {
    db: {
        host: '127.0.0.1',
        port: 27017,
        name: 'michaelmclaughlinblog'
    },
    http: {
        port: 5432
    },
    env: {
        type: 'dev',
        debug: false
    },
    sessionSecret: 'mySuperSecretSauce',
    google: {
        returnURL: 'http://localhost:3000/auth/google/callback',
        realm: 'http://localhost:3000/'
    }
};