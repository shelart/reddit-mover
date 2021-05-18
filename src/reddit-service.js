import axios from 'axios';

export default {
    async signIn(login, password) {
        let session = await axios.post('/api/login', {login, password});
        return session.data;
    },
};
