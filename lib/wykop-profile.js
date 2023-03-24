const API = require('./wykop-api.js');
const assert = require('assert');

module.exports = class Profile extends API {
    #core; #errors; #instance
    constructor(core, data) {
        super(core); this.#core = core; this.#errors = core.errors; this.#instance = core.instance;
        Object.assign(this, data);
    }

    get = async function(username = this.username) {
        return this.wrapContent('profile', await this.#instance.get('/profile/users/' + username));
    }

    observe = async function({ username = this.username } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return await this.#instance.post('/observed/users/' + username).then(_ => { return this });
    }

    unobserve = async function({ username = this.username } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return await this.#instance.delete('/observed/users/' + username).then(_ => { return this });
    }

    // ACTIONS
    getActions = async function({ username = this.username, page = null } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.wrapListingMixed(await this.#instance.get('/profile/users/' + username + '/actions', { params: { page: page }}));
    }

    // LINKS
    getLinksAdded = async function({ username = this.username, page = null } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.wrapListing('link', await this.#instance.get('/profile/users/' + username + '/links/added', { params: { page: page }}));
    }

    getLinksPublished = async function({ username = this.username, page = null } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.wrapListing('link', await this.#instance.get('/profile/users/' + username + '/links/published', { params: { page: page }}));
    }

    getLinksUpvoted = async function({ username = this.username, page = null } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.wrapListing('link', await this.#instance.get('/profile/users/' + username + '/links/up', { params: { page: page }}));
    }

    getLinksDownvoted = async function({ username = this.username, page = null } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.wrapListing('link', await this.#instance.get('/profile/users/' + username + '/links/down', { params: { page: page }}));
    }

    getLinksCommented = async function({ username = this.username, page = null } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.wrapListing('link', await this.#instance.get('/profile/users/' + username + '/links/commented', { params: { page: page }}));
    }


    // ENTRIES
    getEntriesAdded = async function({ username = this.username, page = null } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.wrapListing('entry', await this.#instance.get('/profile/users/' + username + '/entries/added', { params: { page: page }}));
    }

    getEntriesUpvoted = async function({ username = this.username, page = null } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.wrapListing('entry', await this.#instance.get('/profile/users/' + username + '/entries/voted', { params: { page: page }}));
    }

    getEntriesCommented = async function({ username = this.username, page = null } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.wrapListing('entry', await this.#instance.get('/profile/users/' + username + '/entries/commented', { params: { page: page }}));
    }


    // BADGES
    getBadges = async function({ username = this.username } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.wrapListing('badge', await this.#instance.get('/profile/users/' + username + '/badges'));
    }


    // AUTHORED TAGS
    getAuthoredTags = async function({ username = this.username } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.wrapListing('tag', await this.#instance.get('/profile/users/' + username + '/tags'));
    }


    // OBSERVED
    getFollowedTags = async function({ username = this.username, page = null} = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.wrapListing('tag', await this.#instance.get('/profile/users/' + username + '/observed/tags', { params: { page: page }}));
    }

    getFollowedUsers = async function({ username = this.username, page = null } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.wrapListing('profile', await this.#instance.get('/profile/users/' + username + '/observed/users/following', { params: { page: page }}));
    }

    getFollowers = async function({ username = this.username, page = null } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return this.wrapListing('profile', await this.#instance.get('/profile/users/' + username + '/observed/users/followers', { params: { page: page }}));
    }


    // NOTES
    getNote = async function({ username = this.username } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return await this.#instance.get('/notes/' + username);
    }

    createNote = async function({ username = this.username, content = null } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return await this.#instance.put('/notes/' + username, {
            data: {
                content: content
            }
        }).then(_ => { return this });
    }

    clearNote = async function({ username = this.username } = {}) {
        return await this.createNote(username)
    }

    // PM
    getConversation = async function({ username = this.username } = {}) {
        assert(username, this.#errors.assert.notSpecified('username'));
        return await new Conversation(this.#core, { username: username }).get()
    }    
}