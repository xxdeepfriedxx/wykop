const API = require('./wykop-api.js');
const assert = require('assert');
const proxymise = require('./proxymise.js');

module.exports = class Profile extends API {
	#core; #errors; #instance;
	constructor(core, data, overrideProxy = false) {
		super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
		if (typeof data.blacklist === 'boolean') {
			data.blacklisted = data.blacklist;
			delete data.blacklist;
		}
		Object.assign(this, data);

		if (!overrideProxy && core.useProxies) { return proxymise(this); }
		return this;
	}

	get = async function(username = this.username) {
		return this.wrapContent('profile', this.#instance.get('/profile/users/' + username));
	};

	// ACTIVITY
	getActions = async function({ username = this.username, page = null } = {}) {
		assert(username, this.#errors.assert.notSpecified('username'));
		return this.wrapListingMixed(this.#instance.get('/profile/users/' + username + '/actions', { params: { page: page }}));
	};

	// LINKS
	getLinksAdded = async function({ username = this.username, page = null } = {}) {
		assert(username, this.#errors.assert.notSpecified('username'));
		return this.wrapListing('link', this.#instance.get('/profile/users/' + username + '/links/added', { params: { page: page }}));
	};

	getLinksPublished = async function({ username = this.username, page = null } = {}) {
		assert(username, this.#errors.assert.notSpecified('username'));
		return this.wrapListing('link', this.#instance.get('/profile/users/' + username + '/links/published', { params: { page: page }}));
	};

	getLinksUpvoted = async function({ username = this.username, page = null } = {}) {
		assert(username, this.#errors.assert.notSpecified('username'));
		return this.wrapListing('link', this.#instance.get('/profile/users/' + username + '/links/up', { params: { page: page }}));
	};

	getLinksDownvoted = async function({ username = this.username, page = null } = {}) {
		assert(username, this.#errors.assert.notSpecified('username'));
		return this.wrapListing('link', this.#instance.get('/profile/users/' + username + '/links/down', { params: { page: page }}));
	};

	getLinksCommented = async function({ username = this.username, page = null } = {}) {
		assert(username, this.#errors.assert.notSpecified('username'));
		return this.wrapListing('link', this.#instance.get('/profile/users/' + username + '/links/commented', { params: { page: page }}));
	};

	// ENTRIES
	getEntriesAdded = async function({ username = this.username, page = null } = {}) {
		assert(username, this.#errors.assert.notSpecified('username'));
		return this.wrapListing('entry', this.#instance.get('/profile/users/' + username + '/entries/added', { params: { page: page }}));
	};

	getEntriesUpvoted = async function({ username = this.username, page = null } = {}) {
		assert(username, this.#errors.assert.notSpecified('username'));
		return this.wrapListing('entry', this.#instance.get('/profile/users/' + username + '/entries/voted', { params: { page: page }}));
	};

	getEntriesCommented = async function({ username = this.username, page = null } = {}) {
		assert(username, this.#errors.assert.notSpecified('username'));
		return this.wrapListing('entry', this.#instance.get('/profile/users/' + username + '/entries/commented', { params: { page: page }}));
	};

	// BADGES
	getBadges = async function({ username = this.username } = {}) {
		assert(username, this.#errors.assert.notSpecified('username'));
		return this.wrapListing('badge', this.#instance.get('/profile/users/' + username + '/badges'));
	};

	// AUTHORED TAGS
	getAuthoredTags = async function({ username = this.username } = {}) {
		assert(username, this.#errors.assert.notSpecified('username'));
		return this.wrapListing('tag', this.#instance.get('/profile/users/' + username + '/tags'));
	};

	// OBSERVED
	getFollowedTags = async function({ username = this.username, page = null} = {}) {
		assert(username, this.#errors.assert.notSpecified('username'));
		return this.wrapListing('tag', this.#instance.get('/profile/users/' + username + '/observed/tags', { params: { page: page }}));
	};

	getFollowedUsers = async function({ username = this.username, page = null } = {}) {
		assert(username, this.#errors.assert.notSpecified('username'));
		return this.wrapListing('profile', this.#instance.get('/profile/users/' + username + '/observed/users/following', { params: { page: page }}));
	};

	getFollowers = async function({ username = this.username, page = null } = {}) {
		assert(username, this.#errors.assert.notSpecified('username'));
		return this.wrapListing('profile', this.#instance.get('/profile/users/' + username + '/observed/users/followers', { params: { page: page }}));
	};

	// NOTES
	getNote = async function({ username = this.username } = {}) {
		assert(username, this.#errors.assert.notSpecified('username'));
		return this.wrapContent('none', this.#instance.get('/notes/' + username));
	};

	createNote = async function({ username = this.username, content = null } = {}) {
		assert(username, this.#errors.assert.notSpecified('username'));
		return this.wrapContent('none', this.#instance.put('/notes/' + username, {
			data: {
				content: content
			}
		})).then(() => this);
	};

	clearNote = async function({ username = this.username } = {}) {
		assert(username, this.#errors.assert.notSpecified('username'));
		return this.createNote(username);
	};

	// PM
	getConversation = async function({ username = this.username } = {}) {
		assert(username, this.#errors.assert.notSpecified('username'));
		return this.wrapContent('conversation', { user: { username: username }}).get();
	};

	// ACTIONS
	observe = async function({ username = this.username } = {}) {
		assert(username, this.#errors.assert.notSpecified('username'));
		return this.wrapContent('none', this.#instance.post('/observed/users/' + username)).then(() => this);
	};

	unobserve = async function({ username = this.username } = {}) {
		assert(username, this.#errors.assert.notSpecified('username'));
		return this.wrapContent('none', this.#instance.delete('/observed/users/' + username)).then(() => this);
	};

	blacklist = async function({ username = this.username } = {}) {
		assert(username, this.#errors.assert.notSpecified('username'));
		return this.wrapContent('none', this.#instance.post('/settings/blacklists/users', {
			data: {
				username: username
			}
		})).then(() => this);
	};

	unblacklist = async function({ username = this.username } = {}) {
		assert(username, this.#errors.assert.notSpecified('username'));
		return this.wrapContent('none', this.#instance.delete('/settings/blacklists/users/' + username)).then(() => this);
	};
};