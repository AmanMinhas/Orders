const getJson = (response) => {
    return response.json();
};

const checkStatus = (response) => {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    let error = new Error(response.statusText);
    error.response = response;

    return Promise.reject(error);
};

export { checkStatus, getJson };
