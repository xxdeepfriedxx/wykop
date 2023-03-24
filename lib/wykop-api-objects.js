const Entry = require('./wykop-entry.js');
const EntryComment = require('./wykop-entry-comment.js');
const Link = require('./wykop-link.js');
const LinkComment = require('./wykop-link-comment.js');
const LinkRelated = require('./wykop-link-related.js');
const Draft = require('./wykop-link-draft.js');
const Article = require('./wykop-article.js');
const Profile = require('./wykop-profile.js');
const Conversation = require('./wykop-conversation.js');
const Tag = require('./wykop-tag.js');
const Badge = require('./wykop-badge.js');
const Bucket = require('./wykop-bucket.js');
const PersonalNotification = require('./wykop-notification-personal.js');
const PmNotification = require('./wykop-notification-pm.js');
const TagNotification = require('./wykop-notification-tags.js');
const {AccountSettings, ProfileSettings} = require('./wykop-settings.js');

module.exports = function getClass(classString) {
    switch (classString) {
    case 'none': return null
    case 'entry': return Entry
    case 'entries': return Entry
    case 'entry_comment': return EntryComment
    case 'link': return Link
    case 'links': return Link
    case 'link_comment': return LinkComment
    case 'link_related': return LinkRelated
    case 'draft': return Draft
    case 'article': return Article
    case 'profile': return Profile
    case 'users': return Profile
    case 'conversation': return Conversation
    case 'tag': return Tag
    case 'badge': return Badge
    case 'bucket': return Bucket
    case 'notification_personal': return PersonalNotification
    case 'notification_pm': return PmNotification
    case 'notification_tag': return TagNotification
    case 'account_settings': return AccountSettings
    case 'profile_settings': return ProfileSettings
    default: throw new Error('No class for: ' + classString)
    }
}
