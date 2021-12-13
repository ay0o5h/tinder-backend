export default class Validate {
    constructor(parameters) { }

    static register = (must = true) => ({
        firstName: {
            presence: must,
            type: "string",
        },
        lastName: {
            presence: must,
            type: "string",
        },
        username: {
            presence: must,
            type: "string",
        },
        email: {
            presence: must,
            email: true,
            type: "string",
        },
        password: {
            presence: must,
            type: "string",
        },
        age: {
            presence: false,
            type: "string",
        },
        gender: {
            presence: must,
            type: "string",
        },
        gender_Love: {
            presence: must,
            type: "string",
        },
    });

    static login = (must = true) => ({
        email: {
            presence: false,
            type: "string",
            email: true,
        },
        username: {
            presence: false,
            type: "string",
        },
        password: {
            presence: must,
            type: "string",
        },
    });

    static forget = (must = true) => ({
        phone: {
            presence: must,
            type: "string",
        },
    });

    static verifyPassword = (must = true) => ({
        passwordOtp: {
            presence: must,
            type: "string",
        },
        newPassword: {
            presence: must,
            type: "string",
        },
    });
}