import axios from 'axios';

export default {
    login: {
        async init() {
            let grantUri = await axios.post('/api/login/init');
            return grantUri.data;
        },

        async sessionForFlow(flowId) {
            try {
                let flowStatus = await axios.get(`api/login/monitor/${flowId}`);
                if (flowStatus.status === 202) {
                    return null;
                } else {
                    return flowStatus.data;
                }
            } catch (e) {
                console.log('Is Signed In exception:');
                console.log(e);
            }
        },
    },

    subreddits: {
        async get(token) {
            return await axios.get(`/api/subreddits/${token}`);
        },
    }
};
