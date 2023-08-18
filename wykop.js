const assert = require('assert');
const proxymise = require('./lib/proxymise.js');
const FormData = require('form-data');
 
const API = require('./lib/wykop-api.js');
const Core = require('./lib/wykop-core.js');
const Errors = require('./lib/wykop-errors.js');

module.exports = class Wykop extends API {
	#core; #database; #instance; #errors;
	constructor({ appkey, secret, token, rtoken, environment, proxies = true, debug = false } = {}) {
		if ((!token || typeof token !== 'string') &&
			(!rtoken || typeof rtoken !== 'string') &&
			(appkey === undefined || secret === undefined)
		) {
			assert(false, (new Errors).assert.noCredentials());
		}

		const core = new Core({ appkey: appkey, secret: secret, token: token, rtoken: rtoken, environment: environment, debug: debug });
		super(core); this.#core = core; this.#instance = core.instance; this.#errors = core.errors; this.#database = core.database;

		if (typeof Proxy === 'undefined') { proxies = false; }
		core.useProxies = proxies;

		if (proxies) { return proxymise(this); }
		return this;
	}

	// === Objects
	entry = async function(id) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('entry', { id: id });
	};

	entryComment = async function({ id, entryId } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(entryId, this.#errors.assert.notSpecified('entryId'));
		return this.wrapContent('entry_comment', { id: id, parent: { id: entryId }});
	};

	link = async function(id) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('link', { id: id });
	};

	linkComment = async function({ id, linkId } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(linkId, this.#errors.assert.notSpecified('linkId'));
		return this.wrapContent('link_comment', { id: id, parent: { id: linkId }});
	};

	linkRelated = async function({ id, linkId } = {}) {
		assert(id, this.#errors.assert.notSpecified('id'));
		assert(linkId, this.#errors.assert.notSpecified('linkId'));
		return this.wrapContent('link_related', { id: id }, linkId);
	};

	article = async function(id) {
		assert(id, this.#errors.assert.notSpecified('id'));
		return this.wrapContent('article', { id: id });
	};

	draft = async function(key) {
		assert(key, this.#errors.assert.notSpecified('key'));
		return this.wrapContent('draft', { key: key });
	};

	profile = async function(username) {
		assert(username, this.#errors.assert.notSpecified('username'));
		return this.wrapContent('profile', { username: username });
	};

	tag = async function(tag) {
		assert(tag, this.#errors.assert.notSpecified('tag'));
		return this.wrapContent('tag', { name: tag });
	};

	conversation = async function(username) {
		assert(username, this.#errors.assert.notSpecified('username'));
		return this.wrapContent('conversation', { user: { username: username }});
	};

	badge = async function(slug) {
		assert(slug, this.#errors.assert.notSpecified('slug'));
		return this.wrapContent('badge', { slug: slug });
	};

	userCategory = async function(hash) {
		assert(hash, this.#errors.assert.notSpecified('hash'));
		return this.wrapContent('bucket', { hash: hash });
	};

	// === Content ===
	getEntry = async function(id) {
		return this.entry(id).then(res => res.get());
	};

	getEntryComment = async function({ id, entryId } = {}) {
		return this.entryComment({ id: id, entryId: entryId }).then(res => res.get());
	};

	submitEntry = async function({ content = null, photo = null, embed = null, survey = null, adult = false } = {}) {
		return this.wrapContent('entry', this.#instance.post('/entries', {
			data: {
				content: content,
				photo: photo,
				embed: embed,
				survey: survey,
				adult: adult
			}
		}));
	};

	submitEntryComment = async function({ entryId = null, content = null, photo = null, embed = null, adult = false } = {}) {
		assert(entryId, this.#errors.assert.notSpecified('entryId'));
		return this.entry(entryId).then(res => { 
			return res.submitComment({ 
				content: content, 
				photo: photo, 
				embed: embed, 
				adult: adult 
			});
		});
	};

	createSurvey = async function({ question = null, answers = null, entryId = null } = {}) {
		assert(question, this.#errors.assert.notSpecified('question'));
		assert(answers, this.#errors.assert.notSpecified('answers'));
		return this.wrapContent('none', this.#instance.post('/entries/survey', {
			data: {
				question: question,
				answers: answers
			}
		},{
			params: {
				entryId: entryId,
			}
		})).then(res => res.survey_id);
	};

	createEmbed = async function(url) {
		assert(url, this.#errors.assert.notSpecified('url'));
		return this.wrapContent('none', this.#instance.post('/media/embed', {
			data: {
				url: url
			}
		}));
	};

	createPhoto = async function({ type = null, url = null } = {}) {
		assert(['settings', 'comments', 'links'].includes(type), this.#errors.assert.invalidValue('type', '"settings", "comments" (also used for entries), "links"'));
		assert(url, this.#errors.assert.notSpecified('url'));
		return this.wrapContent('none', this.#instance.post('/media/photos', {
			data: {
				url: url
			}
		},{
			params: {
				type: type,
			}
		}));
	};

	uploadPhoto = async function({ type = null, file = null, fileName = null } = {}) {
		assert(['settings', 'comments', 'links'].includes(type), this.#errors.assert.invalidValue('type', '"settings", "comments" (also used for entries), "links"'));
		assert(file, this.#errors.assert.notSpecified('file'));

		const form = new FormData();
		form.append('file', file, fileName ?? 'image');
		return this.wrapContent('none', this.#instance.post('/media/photos/upload', form, {
			params: {
				type: type,
			}
		}));
	};

	getLink = async function(id) {
		return this.link(id).then(res => res.get());
	};

	getLinkComment = async function({ id, linkId } = {}) {
		return this.linkComment({ id: id, linkId: linkId }).then(res => res.get());
	};

	getLinkRelated = async function({ id, linkId } = {}) {
		return this.linkRelated({ id: id, linkId: linkId }).then(res => res.get());
	};

	createURLDraft = async function(url) {
		assert(url, this.#errors.assert.notSpecified('url'));
		return this.wrapContent('draft', this.#instance.post('/links/draft', {
			data: {
				url: url
			}
		}));
	};

	getArticle = async function(id) {
		return this.article(id).then(res => res.get());
	};

	createArticleDraft = async function({ title = null, content = null, html = null } = {}) {
		assert(title, this.#errors.assert.notSpecified('title'));
		assert(content, this.#errors.assert.notSpecified('content'));
		return this.wrapContent('draft', this.#instance.post('/articles', {
			data: {
				title: title,
				content: content,
				content_html: html
			}
		}));
	};

	getDraft = async function(key) {
		return this.draft(key).then(res => res.get());
	};

	getConversation = async function(username) {
		return this.conversation(username).then(res => res.get());
	};

	getTag = async function(tag) {
		return this.tag(tag).then(res => res.get());
	};

	getTagContent = async function(tag, config) {
		return this.tag(tag).then(res => res.getContent(config));
	};

	getProfile = async function(username) {
		return this.profile(username).then(res => res.get());
	};

	getMe = async function() {
		return new Promise((resolve, reject) => {
			this.getLoggedUsername().then(username => {
				resolve(this.getProfile(username));
			}).catch(() => {
				reject(null);
			});
		});
	};

	getMeShort = async function() {
		return this.wrapContent('profile', this.#instance.get('/profile/short'));
	};

	getBadge = async function(slug) {
		return this.badge(slug).then(res => res.get());
	};

	// Get links that are on the homepage or in upcomming
	#getLinks = async function({ type = null, sort = null, category = null, bucket = null, sidebar = null, page = null } = {}) {
		assert(['homepage', 'upcomming', null].includes(type), this.#errors.assert.invalidValue('type', 'homepage, upcomming'));
		return this.wrapListingMixed(this.#instance.get('/links', {
			params: {
				type: type,
				sort: sort,
				category: category,
				bucket: bucket,
				sidebar: sidebar,
				page: page
			}
		}));
	};

	// Helper async function for getting homepage data from `getLinks()`
	getHomepage = async function({ sort = null, category = null, bucket = null, sidebar = null, page = null } = {}) {
		assert(['newest', 'active', 'popular', null].includes(sort), this.#errors.assert.invalidValue('sort', 'newest, active'));
		return this.#getLinks({
			type: 'homepage',
			sort: sort,
			category: category,
			bucket: bucket,
			sidebar: sidebar,
			page: page
		});
	};

	// Helper async function for getting upcoming data from `getLinks()`
	getUpcomming = async function({ sort = null, category = null, bucket = null, sidebar = null, page = null } = {}) {
		assert(['newest', 'active', 'commented', 'digged', 'popular', null].includes(sort), this.#errors.assert.invalidValue('sort', 'newest, active, commented, digged'));
		return this.#getLinks({
			type: 'upcomming',
			sort: sort,
			category: category,
			bucket: bucket,
			sidebar: sidebar,
			page: page
		});
	};

	// Get the number of links currently in the 'upcoming' section
	getUpcommingCount = async function({ category = null, bucket = null } = {}) {
		return this.wrapContent('none', this.#instance.get('/links/stats/upcoming', { 
			params: {
				category: category,
				bucket: bucket
			}
		})).then(res => res.count);
	};

	// Get a link based on an URL
	getLinkByURL = async function(url) {
		assert(url, this.#errors.assert.notSpecified('url'));
		return this.wrapContent('link', this.#instance.get('/links/url', {
			params: {
				url: url
			}
		}));
	};

	getHits = async function({ year = null, month = null, sort = null } = {}) {
		assert(['all', 'day', 'week', 'month', 'year', null].includes(sort), this.#errors.assert.invalidValue('sort', 'all, day, week, month, year'));
		return this.wrapListingMixed(this.#instance.get('/hits/links', {
			params: {
				year: year,
				month: month,
				sort: sort
			}
		}));
	};

	getEntryHits = async function({ year = null, month = null, sort = null } = {}) {
		assert(['all', 'day', 'week', 'month', 'year', null].includes(sort), this.#errors.assert.invalidValue('sort', 'all, day, week, month, year'));
		return this.wrapListingMixed(this.#instance.get('/hits/entries', {
			params: {
				year: year,
				month: month,
				sort: sort
			}
		}));
	};

	#getEntries = async function({ sort = 'hot', lastUpdate = '12', category = null, bucket = null, sidebar = null, page = null } = {}) {
		assert(['newest', 'active', 'hot', 'popular', null].includes(sort), this.#errors.assert.invalidValue('sort', 'newest, active, hot'));
		assert(['1', 1, '2', 2, '3', 3, '6', 6, '12', 12, '24', 24, null].includes(lastUpdate), this.#errors.assert.invalidValue('lastUpdate', '1, 2, 3, 6, 12, 24'));
		
		return this.wrapListing('entry', this.#instance.get('/entries', {
			params: {
				sort: sort,
				last_update: lastUpdate,
				category: category,
				bucket: bucket,
				sidebar: sidebar,
				page: page
			}
		}));
	};

	getMicroblog = async function(config = {}) {
		return this.#getEntries(config);
	};

	getFavoriteContent = async function({ sort = null, type = null, page = null } = {}) {
		assert(['newest', 'oldest', null].includes(sort), this.#errors.assert.invalidValue('sort', 'newest, oldest'));
		assert(['link', 'entry', 'link_comment', 'entry_comment', null].includes(type), this.#errors.assert.invalidValue('type', 'link, entry, link_comment, entry_comment'));
		return this.wrapListingMixed(this.#instance.get('/favourites', {
			data: {
				sort: sort,
				resource: type,
				page: page
			}
		}));
	};

	getObservedContent = async function({ page = null } = {}) {
		return this.wrapListingMixed(this.#instance.get('/observed/all', {
			params: {
				page: page
			}
		}));
	};

	getObservedUsersContent = async function({ page = null } = {}) {
		return this.wrapListingMixed(this.#instance.get('/observed/users', {
			params: {
				page: page
			}
		}));
	};

	// date should be formatted “yyyy-MM-dd HH:mm:ss”
	getNewerObservedUsersContentCount = async function({ date = null, lastId = null } = {}) {
		assert(date || lastId, this.#errors.assert.notSpecified('date or lastId'));
		return this.wrapListingMixed(this.#instance.get('/observed/users/newer', {
			data: {
				date: date,
				lastId: lastId
			}
		}));
	};

	getObservedTagsContent = async function({ page = null } = {}) {
		return this.wrapListingMixed(this.#instance.get('/observed/tags/stream', {
			params: {
				page: page
			}
		}));
	};

	getAutocompleteSuggestionsForTag = async function(query) {
		assert(query, this.#errors.assert.notSpecified('query'));
		return this.wrapListing('tag', this.#instance.get('/tags/autocomplete', {
			params: {
				query: query
			}
		}));
	};

	getAutocompleteSuggestionsForUser = async function(query) {
		return this.wrapListing('profile', this.#instance.get('/users/autocomplete', {
			params: {
				query: query
			}
		}));
	};

	getPopularTags = async function() {
		return this.wrapListing('tag', this.#instance.get('/tags/popular'));
	};

	getPopularAuthoredTags = async function() {
		return this.wrapListing('tag', this.#instance.get('/tags/popular-user-tags'));
	};

	// === Search ===
	getSearchContent = async function(query, { type = 'all', sort = null, votes = null, dateFrom = null, dateTo = null, tags = null, users = null, category = null, bucket = null, domains = null, page = null } = {}) {
		assert(['all', 'links', 'entries', 'users'].includes(type), this.#errors.assert.invalidValue('type', ['all', 'links', 'entries', 'users']));
		assert([null, 'score', 'popular', 'comments', 'newest'].includes(sort), this.#errors.assert.invalidValue('sort', ['score', 'popular', 'comments', 'newest']));
		assert([null, '50', '100', '500', '1000', 50, 100, 500, 1000].includes(votes), this.#errors.assert.invalidValue('votes', '50, 100, 500, 1000'));
		assert(tags === null || Array.isArray(tags) && tags.every(tag => typeof tag === 'string'), this.#errors.assert.invalidType('tags', 'null | string[]'));
		assert(users === null || Array.isArray(users) && users.every(user => typeof user === 'string'), this.#errors.assert.invalidType('users', 'null | string[]'));
		assert(domains === null || Array.isArray(domains) && domains.every(domain => typeof domain === 'string'), this.#errors.assert.invalidType('domains', 'null | string[]'));

		let params = {};
		if (query) { params.query = query; }
		if (sort) { params.sort = sort; }
		if (votes) { params.votes = votes; }
		if (tags) { params.tags = tags; }
		if (users) { params.users = users; }
		if (category) { params.category = category; }
		if (bucket) { params.bucket = bucket; }
		if (domains) { params.domains = domains; }
		if (page) { params.page = page; }

		let stringParams = '';
		if (dateFrom) { 
			dateFrom.setHours(2,0,0);
			stringParams += `date_from=${this.formatDate(dateFrom)}`;
		}
		
		if (dateTo) { 
			dateTo.setHours(25,59,59);
			if (stringParams.length) { stringParams += '&'; }
			stringParams += `date_to=${this.formatDate(dateTo)}`;
		}

		if (type === 'all') {
			return this.wrapContent('none', this.#instance.get('/search/' + type + (stringParams.length ? `?${stringParams}` : ''), { 
				params: params
			})).then(async res => {
				if (res.links.items) { res.links.items = await this.wrapListing('link', res.links.items); }
				if (res.entries.items) { res.entries.items = await this.wrapListing('entry', res.entries.items); }
				if (res.users.items) { res.users.items = await this.wrapListing('profile', res.users.items); }
				return res;
			});
		}

		return this.wrapListing(type, this.#instance.get('/search/' + type + (stringParams.length ? `?${stringParams}` : ''), { 
			params: params
		}));
	};

	// === Notifications ===
	getNotificationStatus = async function() {
		return this.wrapContent('none', this.#instance.get('/notifications/status'));
	};

	getPersonalNotifications = async function({ page } = {}) {
		return this.wrapListing('notification_personal', this.#instance.get('/notifications/entries', {
			params: {
				page: page
			}
		}));
	};

	markPersonalNotificationsAsRead = async function() {
		return this.wrapContent('none', this.#instance.put('/notifications/entries/all'));
	};

	removePersonalNotifications = async function() {
		return this.wrapContent('none', this.#instance.delete('/notifications/entries/all'));
	};

	getTagNotifications = async function({ page } = {}) {
		return this.wrapListing('notification_tag', this.#instance.get('/notifications/tags', {
			params: {
				page: page
			}
		}));
	};

	markTagNotificationsAsRead = async function() {
		return this.wrapContent('none', this.#instance.put('/notifications/tags/all'));
	};

	removeTagNotifications = async function() {
		return this.wrapContent('none', this.#instance.delete('/notifications/tags/all'));
	};

	getPMNotifications = async function({ page } = {}) {
		return this.wrapListing('notification_pm', this.#instance.get('/notifications/pm', {
			params: {
				page: page
			}
		}));
	};

	markPmNotificationsAsRead = async function() {
		return this.wrapContent('none', this.#instance.put('/notifications/pm/all'));
	};

	removePmNotifications = async function() {
		return this.wrapContent('none', this.#instance.delete('/notifications/pm/all'));
	};

	getOpenConversation = async function() {
		return this.wrapContent('conversation', { user: { username: this.wrapContent('none', await this.#instance.get('/pm/open')) }}).get();
	};

	markAllConversationsAsRead = async function() {
		return this.wrapContent('none', this.#instance.put('/pm/read-all'));
	};

	getConversations = async function({ query = null } = {}) {
		return this.wrapListing('conversation', this.#instance.get('/pm/conversations', {
			params: {
				query: query
			}
		}));
	};

	// === Categories ===
	getCategories = async function() {
		return this.wrapListing('none', this.#instance.get('/categories'));
	};

	getUserCategory = async function(hash) {
		return this.userCategory(hash).then(res => res.get());
	};

	getUserCategories = async function() {
		return this.wrapListing('bucket', this.#instance.get('/buckets'));
	};

	getUserCategoryStatus = async function() {
		return this.wrapListing('bucket', this.#instance.get('/buckets/status'));
	};

	addUserCategory = async function({ title = null, query = null, defaultPage = 'home' } = {}) {
		assert(title, this.#errors.assert.notSpecified('title'));
		assert(query, this.#errors.assert.notSpecified('query'));
		assert(['home', 'upcoming', 'entries'].includes(defaultPage), this.#errors.assert.invalidValue('defaultPage', 'home, upcoming, entries'));
		return this.wrapContent('bucket', this.#instance.post('/buckets', {
			data: {
				title: title,
				query: query,
				default_page: defaultPage,
			}
		}));
	};

	getUserCategoryContentPreview = async function(query) {
		assert(query, this.#errors.assert.notSpecified('query'));
		return this.wrapListingMixed(this.#instance.get('/buckets/search', {
			data: {
				query: query
			}
		}));
	};

	getBadges = async function() {
		return this.wrapListing('badge', this.#instance.get('/badges').then(res => res.data.flat())); 
	};

	getRanking = async function({ page = null } = {}) {
		return this.wrapListing('profile', this.#instance.get('/rank', {
			params: {
				page: page
			}
		}));
	};

	getMyRank = async function() {
		return this.getMeShort().then(res => res.rank);
	};

	// === Security ===
	login = async function(username, password, { captcha = null } = {}) {
		assert(username, this.#errors.assert.notSpecified('username'));
		assert(password, this.#errors.assert.notSpecified('password'));

		this.#core.clearRefreshToken();

		let request = {
			data: {
				username: username,
				password: password
			}
		};

		if (captcha) {
			request.data.captcha = captcha;
		}

		return this.wrapContent('none', this.#instance.post('/login', request)).then(res => {
			if (!res.refresh_token) { 
				return this.#requires2FACode({
					type: 'login', 
					token: res.token
				});
			}
			return this.#core.saveTokens(res.token, res.refresh_token);
		});
	};

	logout = async function() {
		this.#core.clearRefreshToken();
		return this.wrapContent('none', this.#instance.get('/logout').finally(() => {
			this.#core.clearTokens();
		}));
	};

	submit2FACode = async function({ token, code } = {}) {
		assert(token, this.#errors.assert.notSpecified('token'));
		assert(code, this.#errors.assert.notSpecified('code'));
		return this.wrapContent('none', this.#instance.post('/2fa/' + token, {
			data: {
				code: code
			}
		})).then(res => {
			if (res && (res.token || res.refresh_token) ) { 
				return this.#core.saveTokens(res.token, res.refresh_token); 
			}
			return '';
		});
	};

	submit2FARecoveryCode = async function({ token, code } = {}) {		
		assert(token, this.#errors.assert.notSpecified('token'));
		assert(code, this.#errors.assert.notSpecified('code'));
		return this.wrapContent('none', this.#instance.post('/2fa/' + token + '/recover', {
			data: {
				code: code
			}
		})).then(res => {
			if (res && (res.token || res.refresh_token) ) { 
				return this.#core.saveTokens(res.token, res.refresh_token); 
			}
			return '';
		});
	};

	requestPasswordReset = async function(email) {
		return this.wrapContent('none', this.#instance.post('/password', {
			data: {
				email: email
			}
		}));
	};

	submitPasswordReset = async function({ token, password } = {}) {
		return this.wrapContent('none', this.#instance.post('/password/' + token, {
			data: {
				password: password,
				password_confirmation: password
			}
		}));
	};

	// === Registration ===
	registerNewAccount = async function({ username = null, email = null, password = null, phone = null } = {}) {
		assert(username, this.#errors.assert.notSpecified('username'));
		assert(email, this.#errors.assert.notSpecified('email'));
		assert(password, this.#errors.assert.notSpecified('password'));
		assert(phone, this.#errors.assert.notSpecified('phone'));
		return this.wrapContent('none', this.#instance.post('/users', {
			data: {
				username: username,
				email: email,
				password: password,
				phone: phone,
				rules: true
			}
		})).then(res => res.hash);
	};

	rerequestRegistrationSMS = async function({ hash = null } = {}) {
		assert(hash, this.#errors.assert.notSpecified('hash'));
		return this.wrapContent('none', this.#instance.get('/users/resend/' + hash));
	};

	submitRegistrationSMS = async function({ hash = null, code = null } = {}) {
		assert(hash, this.#errors.assert.notSpecified('hash'));
		assert(code, this.#errors.assert.notSpecified('code'));
		return this.wrapContent('none', this.#instance.post('/users/sms/' + hash, {
			data: {
				code: code
			}
		}));
	};

	submitRegistrationEmailToken = async function({ token = null } = {}) {
		assert(token, this.#errors.assert.notSpecified('token'));
		return this.wrapContent('none', this.#instance.post('/users/confirmation/' + token).then(res => {
			return this.#core.saveTokens(res.data.token, res.data.refresh_token);
		}));
	};

	// === Wykop Connect ===
	getWykopConnectURL = async function() {
		return this.wrapContent('none', this.#instance.get('/connect')).then(res => {
			return {
				connect_url: res.connect_url,
				token: res.connect_url.split('/').pop()
			};
		});
	};

	acceptWykopConnectPermissions = async function(token, { send_message = false, read_profile = false, add_comment = false, add_link = false, add_entry = false, add_vote = false } = {}) {
		assert(token, this.#errors.assert.notSpecified('token'));
		return this.wrapContent('none', this.#instance.put('/connect/' + token, {
			data: {
				send_message: send_message,
				read_profile: read_profile,
				add_comment: add_comment,
				add_link: add_link,
				add_entry: add_entry,
				add_vote: add_vote
			}
		})).then(res => {
			return {
				redirect_url: res.redirect_url,
				domain: res.redirect_url.match(/(.+)\?/)[1],
				token: res.redirect_url.match(/(?:token=)([\w.-]+)/)[1],
				rtoken: res.redirect_url.match(/(?:rtoken=)([\w.-]+)/)[1]
			};
		});
	};

	// === Authorize ===
	getAccountBlockades = async function() {
		return this.wrapListing('none', this.#instance.get('/security/authorize'));
	};

	requestAccountBlockadeSMS = async function() {
		return this.wrapContent('none', this.#instance.post('/security/authorize/sms/send'));
	};

	rerequestAccountBlockadeSMS = async function() {
		return this.wrapContent('none', this.#instance.get('/security/authorize/sms/resend'));
	};

	submitAccountBlockadeSMS = async function(code) {
		assert(code, this.#errors.assert.notSpecified('code'));
		return this.wrapContent('none', this.#instance.post('/security/authorize/sms', {
			data: {
				code: code
			}
		}));
	};

	submitAccountBlockadeCaptcha = async function(code) {
		assert(code, this.#errors.assert.notSpecified('code'));
		return this.wrapContent('none', this.#instance.post('/security/authorize/recaptcha', {
			data: {
				code: code
			}
		}));
	};

	acceptTermsAndConditions = async function() {
		return this.wrapContent('none', this.#instance.post('/security/authorize/statute'));
	};

	// === Settings === 
	getAccountSettings = async function() {
		return this.wrapContent('account_settings', {}).get();
	};

	getProfileSettings = async function() {
		return this.wrapContent('profile_settings', {}).get();
	};

	getPhone = async function() {
		return this.wrapContent('none', this.#instance.get('/settings/phone')).then(res => res.phone);
	};

	requestChangePhoneNumberSMS = async function(phone) {
		assert(phone, this.#errors.assert.notSpecified('phone'));
		return this.wrapContent('none', this.#instance.put('/settings/changephone', {
			data: {
				phone: phone
			}
		})).then(res => {
			if (res && res.token) {
				return this.#requires2FACode({
					type: 'requestChangePhoneNumberSMS', 
					token: res.token
				}); 
			}
			return res;
		});
	};

	submitChangePhoneNumberSMS = async function(code) {
		assert(code, this.#errors.assert.notSpecified('code'));
		return this.wrapContent('none', this.#instance.post('/settings/changephone', {
			data: {
				code: code
			}
		}));
	};

	getEmail = async function() {
		return this.wrapContent('none', this.#instance.get('/settings/email')).then(res => res.email);
	};

	requestChangeEmail = async function({ email = null, password = null } = {}) {
		assert(email, this.#errors.assert.notSpecified('email'));
		assert(password, this.#errors.assert.notSpecified('password'));
		return this.wrapContent('none', this.#instance.post('/settings/changeemail', {
			data: {
				email: email,
				email_confirmation: email,
				password: password
			}
		})).then(res => {
			if (res && res.token) {
				return this.#requires2FACode({
					type: 'requestChangeEmail', 
					token: res.token
				}); 
			}
			return res;
		});
	};

	submitChangeEmail = async function(hash) {
		return this.wrapContent('none', this.#instance.get('/settings/changeemailconfirm/' + hash));
	};

	requestAccountDeletion = async function(password) {
		return this.wrapContent('none', this.#instance.post('/users/account/delete/mail/send', {
			data: {
				password: password
			}
		})).then(res => {
			if (res && res.token) { 
				return this.#requires2FACode({
					type: 'requestAccountDeletion', 
					token: res.token
				});
			}
			return res;
		});
	};

	confirmAccountDeletion = async function(hash) {
		return this.wrapContent('none', this.#instance.post('/users/account/delete/confirm', {
			data: {
				hash: hash
			}
		}));
	};

	requestAccountDataCopy = async function(password) {
		return this.wrapContent('none', this.#instance.post('/users/account/gdpr/txt', {
			data: {
				password: password
			}
		})).then(res => {
			if (res && res.token) { 
				return this.#requires2FACode({
					type: 'requestAccountDataCopy', 
					token: res.token
				});
			}
			return res;
		});
	};

	requestAccountDataTransfer = async function(password) {
		return this.wrapContent('none', this.#instance.post('/users/account/gdpr/json', {
			data: {
				password: password
			}
		})).then(res => {
			if (res && res.token) { 
				return this.#requires2FACode({
					type: 'requestAccountDataTransfer', 
					token: res.token
				});
			}
			return res;
		});
	};

	// === 2FA ===
	get2FAStatus = async function() {
		return this.wrapContent('none', this.#instance.get('/settings/2fa/status')).then(res => res.active);
	};

	get2FASecret = async function({ type = 1 } = {}) {
		return this.wrapContent('none', this.#instance.post('/settings/2fa/' + type)).then(res => res.secret);
	};

	activate2FA = async function({ type = 1, code = null } = {}) {
		assert(code, this.#errors.assert.notSpecified('code'));
		return this.wrapContent('none', this.#instance.post('/settings/2fa/' + type + '/activation', {
			data: {
				code: code
			}
		})).then(res => res.recovery_token);
	};

	deactivate2FA = async function({ password = null, code = null } = {}) {
		assert(password, this.#errors.assert.notSpecified('password'));
		assert(code, this.#errors.assert.notSpecified('code'));
		return this.wrapContent('none', this.#instance.post('/settings/2fa/deactivation', {
			data: {
				password: password
			}
		})).then(res => {
			return this.submit2FACode({
				token: res.token,
				code: code
			});
		});
	};

	// === 2FA / Callback ===
	#requires2FACodeCallback = null;
	#requires2FACode = async function({ type, token } = {}) {
		const data = {
			type: type,
			token: token,
			info: 'This user has 2FA turned on. To continue you need to call w.submit2FACode() with the token in this object as well as the user\'s 2FA code. You can also listen for 2FA requirements by implementing w.handle2FACodeRequired()'
		};

		if (type && token && typeof this.#requires2FACodeCallback === 'function') { 
			return Promise.resolve(this.#requires2FACodeCallback(data)).finally(() => data);
		}

		return data;
	};

	handle2FACodeRequired = async function(callback) {
		assert(typeof callback === 'function', this.#errors.assert.invalidType('callback', 'function'));
		this.#requires2FACodeCallback = callback;
	};

	// === Active Sessions ===
	getUserSessions = async function() {
		return this.wrapListing('none', this.#instance.get('/settings/session'));
	};

	removeUserSession = async function(id) {
		return this.wrapContent('none', this.#instance.delete('/settings/session/' + id));
	};

	// === Wykop Connect Apps ===
	getConnectApplications = async function() {
		return this.wrapListing('none', this.#instance.get('/settings/applications'));
	};

	removeConnectApplication = async function(id) {
		return this.wrapContent('none', this.#instance.delete('/settings/applications/' + id));
	};

	// === Blacklist / Users ===
	getBlacklistUsers = async function() {
		return this.wrapListing('profile', this.#instance.get('/settings/blacklists/users'));
	};

	addUserToBlacklist = async function(username = null) {
		assert(username, this.#errors.assert.notSpecified('username'));
		return this.wrapContent('none', this.#instance.post('/settings/blacklists/users', {
			data: {
				username: username
			}
		})).then(() => this);
	};

	removeUserFromBlacklist = async function(username = null) {
		assert(username, this.#errors.assert.notSpecified('username'));
		return this.wrapContent('none', this.#instance.delete('/settings/blacklists/users/' + username)).then(() => this);
	};

	// === Blacklist / Tags ===
	getBlacklistTags = async function() {
		return this.wrapListing('tag', this.#instance.get('/settings/blacklists/tags'));
	};

	addTagToBlacklist = async function(tag = null) {
		assert(tag, this.#errors.assert.notSpecified('tag'));
		return this.wrapContent('none', this.#instance.post('/settings/blacklists/tags', {
			data: {
				tag: tag
			}
		})).then(() => this);
	};

	removeTagFromBlacklist = async function(tag = null) {
		assert(tag, this.#errors.assert.notSpecified('tag'));
		return this.wrapContent('none', this.#instance.delete('/settings/blacklists/tags/' + tag)).then(() => this);
	};

	// === Blacklist / Domains ===
	getBlacklistDomains = async function() {
		return this.wrapListing('none', this.#instance.get('/settings/blacklists/domains'));
	};

	addDomainToBlacklist = async function(domain = null) {
		assert(domain, this.#errors.assert.notSpecified('domain'));
		return this.wrapContent('none', this.#instance.post('/settings/blacklists/domains', {
			data: {
				domain: domain
			}
		})).then(() => this);
	};

	removeDomainFromBlacklist = async function(domain = null) {
		assert(domain, this.#errors.assert.notSpecified('domain'));
		return this.wrapContent('none', this.#instance.delete('/settings/blacklists/domains/' + domain)).then(() => this);
	};

	// === Config ===
	getAccountColorHexes = async function() {
		return this.wrapListing('none', this.#instance.get('/config/colors'));
	};

	getAccountColorHex = async function(name) {
		assert(name, this.#errors.assert.notSpecified('name'));
		return this.wrapContent('none', this.#instance.get('/config/colors/' + name));
	};

	// === Contact ===
	get supportReasons() {
		return {
			technicalProblems: 1,
			moderationRelated: 2,
			breachOfTermsAndConditions: 3,
			featureSuggestions: 4,
			problemWithEmail: 5,
			cooperationRequest: 6,
			accessToAPI: 7,
			companyVerification: 8,
			deleteAccount: 9,
			other: 10,
			iodo: 11
		};
	}

	submitSupportMessage = async function({ reason = null, email = null, message = null, file = null, info = null, url = null } = {}) {
		assert(reason, this.#errors.assert.invalidValue('reason', '1: Problemy techniczne, 2: Sprawy moderacyjne, 3: Zgłoszenia naruszeń regulaminu, 4: Sugestie nt. funkcjonalności serwisu, 5: Problemy z adresem e-mail, 6: Propozycja współpracy, 7: Dostęp do API, 8: Weryfikacja profilu firmowego, 9: Usunięcie konta, 10: Inne, 11: IOD'));
		assert(email, this.#errors.assert.notSpecified('email'));
		assert(message, this.#errors.assert.notSpecified('message'));

		const requestData = {
			data: {
				reason: reason,
				email: email,
				message: message,
				info: info,
				url: url
			}
		};

		if (file) {
			let form = new FormData();
			form.append('file', file, 'image');
			return this.wrapContent('none', this.#instance.post('/contact/support', form, requestData));
		}

		return this.wrapContent('none', this.#instance.post('/contact/support', requestData));
	};

	submitGDPRMessage = async function({ email = null, message = null } = {}) {
		assert(email, this.#errors.assert.notSpecified('email'));
		assert(message, this.#errors.assert.notSpecified('message'));
		return this.wrapContent('none', this.#instance.post('/contact/gdpr', {
			data: {
				email: email,
				message: message
			}
		}));
	};

	// === Moderation ===
	getReportedContent = async function({ page = null } = {}) {
		return this.wrapListing('none', this.#instance.get('/reports/reports', {
			params: {
				page: page
			}
		}));
	};

	generateReportURL = async function({ linkId = null, entryId = null, linkCommentId = null, entryCommentId = null, profile = null, relatedId = null } = {}) {
		let data = null;

		if (profile)  		  { data = { type: 'profile', 	  	id: profile }; }
		if (entryId)  		  { data = { type: 'entry', 		id: entryId }; }
		if (linkId)  		  { data = { type: 'link', 		  	id: linkId 	}; }
		if (entryCommentId)   { data = { type: 'entry_comment', id: entryCommentId,  parent_id: entryId }; }
		if (linkCommentId)    { data = { type: 'link_comment',  id: linkCommentId,   parent_id: linkId 	}; }
		if (relatedId)  	  { data = { type: 'link_related',  id: relatedId, 	   	 parent_id: linkId 	}; }

		return this.wrapContent('none', this.#instance.post('reports/reports', {
			data: data
		})).then(res => res.url);
	};

	getModeratedContent = async function({ page = null } = {}) {
		return this.wrapListing('none', this.#instance.get('/reports/moderated', {
			params: {
				page: page
			}
		}));
	};

	submitAppeal = async function({ reportId = null, content = null } = {}) {
		assert(reportId, this.#errors.assert.notSpecified('reportId'));
		assert(content, this.#errors.assert.notSpecified('content'));
		return this.wrapContent('none', this.#instance.post('/reports/moderated/' + reportId + '/appeal', {
			data: {
				content: content
			}
		}));
	};

	getAppeals = async function({ page = null } = {}) {
		return this.wrapListing('none', this.#instance.get('/reports/appeals', {
			params: {
				page: page
			}
		}));
	};

	// === Helpful ===
	customRequest = async function(config) {
		return this.#instance.request(config);
	};

	getToken = async function() {
		return this.#core.getTokens();
	};

	formatDate = async function(date) {
		assert(date, this.#errors.assert.notSpecified('date'));
		return date.toISOString().replace(/T/, '+').replace(/\..+/, '');
	};

	// === Token info ===
	saveConnectTokens = async function(data) {
		return this.#core.saveTokens(data.token, data.rtoken);
	};

	databaseExtract = async function() {
		return this.#database.extract;
	};

	get #tokenData() {
		if (!this.#database.token) { return null; }
		return JSON.parse(atob(this.#database.token.split('.')[1]));
	}

	tokenExpireDate = async function() {
		return new Date((this.#tokenData?.exp ?? 0) * 1000);
	};

	hasTokenExpired = async function() {
		return this.tokenExpiry < Date.now();
	};

	getLoggedUsername = async function() {
		return (this.#tokenData?.username ?? null);
	};

	isLogged = async function() {
		return (this.#tokenData?.roles ?? []).includes('ROLE_USER');
	};
};