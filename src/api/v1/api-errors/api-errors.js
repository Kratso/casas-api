
exports.default_error = { 
    code: 400, 
    response: {
        message: "Wrong parameters." 
    }
};

exports.wrong_pokedex_index = {
    code: 400,
    response: {
        message: "Bad request. The provided index does not exist in the pokedex."
    }
}

exports.wrong_query_range = {
    code: 400,
    response: {
        message: "Bad request. Query out of range."
    }
}

exports.wrong_credentials = {
    code: 401,
    response: {
        message: "Bad username or password."
    }
}

exports.expired_token = { 
    code: 400, 
    response: {
        message: "The provided token has expired." 
    }
};

exports.missing_authorization_header = { 
    code: 401, 
    response: {
        message: "Missing authorization header." 
    }
};

exports.missing_authorization_bearer = { 
    code: 401, 
    response: {
        message: "Missing authorization bearer." 
    }
};

exports.invalid_authorization_header = { 
    code: 401,
    response: {
        message: "Invalid authorization bearer."
    }
};

exports.internal_error = { 
    code: 500,
    response: {
        message: "Internal server error."
    } 
};

exports.email_already_exists = {
    code: 412,
    response :{
        message: "Email already exists."
    }
}

exports.trainername_already_exists = {
    code: 412,
    response :{
        message: "Trainername already exists."
    }
}