import Entry from './wykop-entry.js';
import EntryComment from './wykop-entry-comment.js';
import Link from './wykop-link.js';
import LinkComment from './wykop-link-comment.js';
import LinkRelated from './wykop-link-related.js';
import Draft from './wykop-link-draft.js';
import Article from './wykop-article.js';
import Profile from './wykop-profile.js';
import Conversation from './wykop-conversation.js';
import Tag from './wykop-tag.js';
import Badge from './wykop-badge.js';
import Bucket from './wykop-bucket.js';
import PersonalNotification from './wykop-notification-personal.js';
import PmNotification from './wykop-notification-pm.js';
import TagNotification from './wykop-notification-tags.js';
import {AccountSettings, ProfileSettings} from './wykop-settings.js';

export function getClass(classString) {
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
