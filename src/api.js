import useInterceptors from './interceptors';

const useApi = () => {
    const axios = useInterceptors();
   
    const api = {
        adminLogin: (data, params={}) => axios.post(`user/dashboard/api/login/`, data, {params : params}),
        adminLogout: (data, params={}) => axios.post(`user/dashboard/api/logout/`, data, {params : params}),
        getCategories: (params = {}) => axios.get(`/product/dashboard/api/categories/`, {params: params}),
        pluginInstall: (data, params={}) => axios.post(`plugins/dashboard/api/plugin-install-via-zip-url/`, data, {params : params}),
    };

    return api;
}

export default  useApi;