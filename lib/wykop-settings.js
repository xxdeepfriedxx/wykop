const API = require('./wykop-api.js');
const assert = require('assert');

class AccountSettings extends API {
    #core; #errors; #instance
    constructor(core, data) {
        super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
        Object.assign(this, data);
    }

    get = async function() {
    	return this.wrapContent('account_settings', this.#instance.get('/settings/general'));
    }

    update = async function(update) {
    	return this.#core, this.#instance.put('/settings/general', {
    		data: update
    	}).then(_ => { return Object.assign(this, update) })
    }
}

class ProfileSettings extends API {
    #core; #errors; #instance
    constructor(core, data) {
        super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
        if (!data) { return this }
        this.username = data.username
        this.name = data.name
        this.avatar = data.avatar
        this.background = data.background
        this.gender = data.gender
        this.city = data.city
        this.website = data.website
        this.public_email = data.public_email
        this.facebook = data.social_media.facebook
        this.twitter = data.social_media.twitter
        this.instagram = data.social_media.instagram
        this.about = data.about
    }

    get = async function() {
        return this.wrapContent('profile_settings', this.#instance.get('/profile'));
    }

    update = async function({
        name = this.name,
        gender = this.gender,
        city = this.city,
        website = this.website,
        public_email = this.public_email,
        facebook = this.facebook,
        twitter = this.twitter,
        instagram = this.instagram,
        about = this.about
    }) {
        const data = {
            data: {
                name: name,
                gender: gender,
                city: city,
                website: website,
                public_email: public_email,
                facebook: facebook,
                twitter: twitter,
                instagram: instagram,
                about: about
            }
        }
        return this.#instance.put('/settings/profile', data).then(_ => {
            return this.wrapContent('profile_settings', data)
        })
    }

    submitAvatar = async function(key) {
        return this.#instance.post('/settings/profile/avatar', {
            data: {
                avatar: key
            }
        }).then(_ => { return this })
    }

    removeAvatar = async function() {
        return this.#instance.delete('/settings/profile/background').then(_ => { return this })
    }

    submitBackground = async function(key) {
        return this.#instance.post('/settings/profile/background', {
            data: {
                avatar: key
            }
        }).then(_ => { return this })
    }

    removeBackground = async function() {
        return this.#instance.delete('/settings/profile/avatar').then(_ => { return this })
    }
}

module.exports = {AccountSettings, ProfileSettings}