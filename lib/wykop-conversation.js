const API = require('./wykop-api.js');
const assert = require('assert');
const proxymise = require('./proxymise.js');

module.exports = class Conversation extends API {
	#core; #errors; #instance;
	constructor(core, data, overrideProxy = false) {
		super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
		Object.assign(this, data);

		if (this.user) { this.user = this.wrapContent('profile', this.user, null, true); }
		if (this.messages) { this.messages.reverse(); }

		if (!overrideProxy && core.useProxies) { return proxymise(this); }
		return this;
	}

	get = async function({ username = this.user?.username, nextMessage = null, prevMessage = null } = {}) {
		assert(username, this.#errors.assert.notSpecified('username'));
		return this.wrapContent('conversation', this.#instance.get('/pm/conversations/' + username, {
			params: {
				next_message: nextMessage,
				prev_message: prevMessage
			}
		}));
	};

	message = async function(content = null, { username = this.user?.username, photo = null, embed = null } = {}) {
		assert(content, this.#errors.assert.notSpecified('content'));
		assert(username, this.#errors.assert.notSpecified('username'));
		return this.wrapContent('none', this.#instance.post('/pm/conversations/' + username, {
			data: {
				content: content,
				photo: photo,
				embed: embed
			}
		})).then(() => this);
	};
	
	clearHistory = async function({ username = this.user?.username } = {}) {
		assert(username, this.#errors.assert.notSpecified('username'));
		return this.wrapContent('none', this.#instance.delete('/pm/conversations/' + username)).then(() => this);
	};

	isNewerMessageAvailable = async function({ username = this.user?.username } = {}) {
		assert(username, this.#errors.assert.notSpecified('username'));
		return this.wrapContent('none', this.#instance.get('/pm/conversations/' + username + '/newer'));
	};
};
