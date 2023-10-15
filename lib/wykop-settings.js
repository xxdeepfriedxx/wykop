const API = require('./wykop-api.js');
const assert = require('assert');
const proxymise = require('./proxymise.js');

class AccountSettings extends API {
	#core; #errors; #instance;
	constructor(core, data, overrideProxy = false) {
		super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
		Object.assign(this, data);

		if (!overrideProxy && core.useProxies) { return proxymise(this); }
		return this;
	}

	get = async function() {
		return this.wrapContent('account_settings', this.#instance.get('/settings/general'));
	};

	update = async function(update) {
		assert(update, this.#errors.assert.notSpecified('update'));
		return this.#instance.put('/settings/general', {
			data: update
		}).then(() => { return Object.assign(this, update); });
	};
}

class ProfileSettings extends API {
	#core; #errors; #instance;
	constructor(core, data) {
		super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
		if (!data) { return this; }
		this.username = data.username;
		this.name = data.name;
		this.avatar = data.avatar;
		this.background = data.background;
		this.gender = data.gender;
		this.city = data.city;
		this.website = data.website;
		this.public_email = data.public_email;
		this.facebook = data.social_media?.facebook;
		this.twitter = data.social_media?.twitter;
		this.instagram = data.social_media?.instagram;
		this.about = data.about;
	}

	get = async function() {
		return this.wrapContent('profile_settings', this.#instance.get('/profile'));
	};

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
		};
		return this.wrapContent('none', this.#instance.put('/settings/profile', data)).then(() => {
			return this.wrapContent('profile_settings', data);
		});
	};

	submitAvatar = async function(key) {
		assert(key, this.#errors.assert.notSpecified('key'));
		return this.wrapContent('none', this.#instance.post('/settings/profile/avatar', {
			data: {
				avatar: key
			}
		})).then(() => this);
	};

	removeAvatar = async function() {
		return this.wrapContent('none', this.#instance.delete('/settings/profile/background')).then(() => this);
	};

	submitBackground = async function(key) {
		return this.wrapContent('none', this.#instance.post('/settings/profile/background', {
			data: {
				avatar: key
			}
		})).then(() => this);
	};

	removeBackground = async function() {
		return this.wrapContent('none', this.#instance.delete('/settings/profile/avatar')).then(() => this);
	};
}

module.exports = {AccountSettings, ProfileSettings};