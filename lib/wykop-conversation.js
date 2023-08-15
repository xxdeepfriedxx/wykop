const API = require('./wykop-api.js');
const assert = require('assert');

module.exports = class Conversation extends API {
    #core; #errors; #instance
    constructor(core, data) {
        super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
        Object.assign(this, data);

        if (this.user) { this.user = this.wrapContent('profile', this.user) }
    }

    get = async function({ username = this.user?.username, nextMessage = null, prevMessage } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.wrapContent('conversation', this.#instance.get('/pm/conversations/' + username), {
            params: {
                next_message: nextMessage,
                prev_message: prevMessage
            }
        });
    }

    message = async function(content = null, { username = this.user?.username, photo = null, embed = null } = {}) {
        assert(content, this.#errors.assert.notSpecified('content'));
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.wrapContent('none', this.#instance.post('/pm/conversations/' + username, {
            data: {
                content: content,
                photo: photo,
                embed: embed
            }
        })).then(_ => this);
    }
    
    clearHistory = async function({ username = this.user?.username } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.wrapContent('none', this.#instance.delete('/pm/conversations/' + username));
    }

    isNewerMessageAvailable = async function({ username = this.user?.username } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.wrapContent('none', this.#instance.get('/pm/conversations/' + username + '/newer'));
    }
}
