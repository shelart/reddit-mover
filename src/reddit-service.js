import axios from 'axios';

export default {
    login: {
        async init(userNum) {
            let grantUri = await axios.post('/api/login/init/' + userNum);
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

        async getUserName(token) {
            return await axios.get(`/api/username/${token}`);
        },

        async refreshAccessTokenByRefreshToken(userNum, refreshToken) {
            const response = await axios.get(`/api/login/refresh/${userNum}/${refreshToken}`);
            return response.data;
        },
    },

    subreddits: {
        async invokeGet(token) {
            return await axios.get(`/api/subreddits/${token}`);
        },
    },

    listings: {
        async getState(id) {
            return await axios.get(`/api/listing/${id}`);
        },
    },
};
