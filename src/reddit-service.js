import axios from 'axios';

export default {
    login: {
        async load(userNum) {
            const response = await axios.get(`/api/login/read/${userNum}`);
            return response.data;
        },

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

        async subscribe(token, ids) {
            const idsCommaSeparated = ids.join(',');
            return await axios.post(`/api/subscriptions/subscribe/${token}/${idsCommaSeparated}`);
        },

        async unsubscribe(token, ids) {
            const idsCommaSeparated = ids.join(',');
            return await axios.post(`/api/subscriptions/unsubscribe/${token}/${idsCommaSeparated}`);
        },
    },

    savedPosts: {
        async invokeGet(token) {
            return await axios.get(`/api/savedPosts/${token}`);
        },

        async save(token, id) {
            return await axios.post(`/api/saved/save/${token}/${id}`);
        },

        async unSave(token, id) {
            return await axios.post(`/api/saved/unSave/${token}/${id}`);
        },
    },

    listings: {
        async getState(id) {
            return await axios.get(`/api/listing/${id}`);
        },
    },
};
