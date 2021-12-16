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
        bio: {
            presence: false,
            type: "string",
        },
        phone: {
            presence: false,
            type: "string",
        },
        fb_url: {
            presence: false,
            type: "string",
        },
        insta_url: {
            presence: false,
            type: "string",
        },
    });

    static login = (must = true) => ({
        email: {
            presence: must,
            type: "string",
            email: true,
        },
        password: {
            presence: must,
            type: "string",
        },
    });

    static forget = (must = true) => ({
        email: {
            presence: must,
            type: "string",
            email: true,
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
    static passion = (must = true) => ({
        title: {
            presence: must,
            type: "string",
        },
    });
    static music = (must = true) => ({
        type: {
            presence: must,
            type: "string",
        },
    });
    static musicFav = (must = true) => ({
        link: {
            presence: must,
            type: "string",
        },
        musicCat: {
            presence: must,
            type: "number",
        },
    });
}