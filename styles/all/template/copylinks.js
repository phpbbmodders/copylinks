/**
 * Copy Links extension for the phpBB Forum Software package
 *
 * Turns forum, topic, post and FAQ headings into "copy link" controls. A
 * click copies a BBCode link or a plain URL to the clipboard.
 * Links are built from IDs, so they never carry a session ID, and always point
 * at the forum, topic or post itself rather than a page within it.
 *
 * @copyright (c) 2026, phpBB Modders, https://www.phpbbmodders.com/
 * @license GNU General Public License, version 2 (GPL-2.0)
 */
(function () {
	'use strict';

	var status = document.getElementById('copylinks-status');
	if (!status) {
		return;
	}

	var plainUrl = status.getAttribute('data-plain-url') === '1';
	var boardUrl = status.getAttribute('data-board-url');
	var phpExt = status.getAttribute('data-php-ext');
	var icon = status.getAttribute('data-icon');
	var hint = status.getAttribute('data-hint');
	var copiedMessage = status.getAttribute('data-copied');
	var failedMessage = status.getAttribute('data-copy-failed');

	// How long the tick and the status message stay, in milliseconds
	var SHOW_COPIED_FOR = 2000;

	// Pause before the status message is set, so screen readers notice the
	// change even when the same message is announced twice in a row
	var ANNOUNCE_DELAY = 50;

	// Font Awesome icon shown for a moment after copying, in place of the icon
	var COPIED_ICON = 'fa-check';

	/**
	 * Collapse whitespace in an element's text.
	 *
	 * @param {Element} element
	 * @returns {string}
	 */
	function headingText(element) {
		return element.textContent.replace(/\s+/g, ' ').trim();
	}

	/**
	 * Read one query parameter from a link's href.
	 *
	 * @param {HTMLAnchorElement} anchor
	 * @param {string} name
	 * @returns {string|null} The value if it is a positive whole number
	 */
	function idParam(anchor, name) {
		var match = new RegExp('[?&](?:amp;)?' + name + '=(\\d+)').exec(anchor.getAttribute('href') || '');
		return match ? match[1] : null;
	}

	/**
	 * Work out the link to copy for a marked heading.
	 *
	 * @param {Element} target
	 * @returns {string|null}
	 */
	function linkFor(target) {
		var kind = target.getAttribute('data-copylinks');
		var postId;

		if (kind === 'post') {
			postId = /^p(\d+)$/.exec(target.closest('.post').id);
		} else if (kind === 'review') {
			postId = /^pr(\d+)$/.exec(target.closest('.postbody').id);
		} else if (kind === 'faq') {
			// The FAQ and BBCode help pages are routes, so use the address
			// the reader is on, without any query string
			return window.location.origin + window.location.pathname + '#' + target.parentNode.id;
		} else if (kind === 'heading') {
			var topicId = idParam(target, 't');
			var forumId = idParam(target, 'f');

			if (topicId) {
				return boardUrl + 'viewtopic.' + phpExt + '?t=' + topicId;
			}
			if (forumId) {
				return boardUrl + 'viewforum.' + phpExt + '?f=' + forumId;
			}
			return null;
		}

		return postId ? boardUrl + 'viewtopic.' + phpExt + '?p=' + postId[1] + '#p' + postId[1] : null;
	}

	/**
	 * Build the BBCode for a link, keeping the heading text from closing or
	 * opening a [url] tag of its own.
	 *
	 * @param {string} url
	 * @param {string} text
	 * @returns {string}
	 */
	function bbcodeFor(url, text) {
		if (!text) {
			return '[url]' + url + '[/url]';
		}
		return '[url=' + url + ']' + text.replace(/\[(\/?url)/gi, '($1') + '[/url]';
	}

	/**
	 * Show the tick and announce the copy to screen readers.
	 *
	 * @param {Element} target
	 */
	function showCopied(target) {
		var targetIcon = target.querySelector('.copylinks-icon');

		target.classList.add('copylinks-copied');
		if (targetIcon) {
			targetIcon.classList.remove(icon);
			targetIcon.classList.add(COPIED_ICON);
		}

		// Clear first so the same message is read out again on a repeat copy
		status.textContent = '';
		window.setTimeout(function () {
			status.textContent = copiedMessage;
		}, ANNOUNCE_DELAY);

		// A repeat copy restarts the timer instead of being cut short by the
		// previous one
		window.clearTimeout(target.copylinksTimer);
		target.copylinksTimer = window.setTimeout(function () {
			target.classList.remove('copylinks-copied');
			if (targetIcon) {
				targetIcon.classList.remove(COPIED_ICON);
				targetIcon.classList.add(icon);
			}
			status.textContent = '';
		}, SHOW_COPIED_FOR);
	}

	/**
	 * Copy text to the clipboard, or let the reader copy it by hand when the
	 * browser does not allow it (plain http, private windows, old browsers).
	 *
	 * @param {Element} target
	 * @param {string} text
	 */
	function copy(target, text) {
		var copyByHand = function () {
			window.prompt(failedMessage, text);
		};

		if (!navigator.clipboard || !window.isSecureContext) {
			copyByHand();
			return;
		}

		navigator.clipboard.writeText(text).then(function () {
			showCopied(target);
		}, copyByHand);
	}

	/**
	 * Mark one element as a copy control.
	 *
	 * @param {Element} element
	 * @param {string} kind heading, post, review or faq
	 */
	function mark(element, kind) {
		element.classList.add('copylinks-target');
		element.setAttribute('data-copylinks', kind);
		element.setAttribute('title', hint);
		element.setAttribute('aria-describedby', 'copylinks-hint');

		// Optional icon showing the heading can be copied. It is decorative:
		// the hint above already tells screen reader users.
		if (icon) {
			var iconElement = document.createElement('i');
			iconElement.className = 'icon fas fa-fw copylinks-icon ' + icon;
			iconElement.setAttribute('aria-hidden', 'true');
			element.appendChild(iconElement);
			element.classList.add('copylinks-has-icon');
		}
	}

	// Forum and topic titles, and the posting page title
	document.querySelectorAll('h2.forum-title > a, h2.topic-title > a, h2.posting-title > a').forEach(function (anchor) {
		mark(anchor, 'heading');
	});

	// Post subjects in topics, and in the topic review below the editor
	document.querySelectorAll('.post[id^="p"] [id^="post_content"] > h3 > a').forEach(function (anchor) {
		mark(anchor, 'post');
	});
	document.querySelectorAll('.postbody[id^="pr"] > h3 > a').forEach(function (anchor) {
		mark(anchor, 'review');
	});

	// FAQ and BBCode help questions have no link of their own; give each one
	// a link to its own anchor, which is also what gets copied
	document.querySelectorAll('dl.faq > dt[id]').forEach(function (dt) {
		var anchor = document.createElement('a');
		anchor.href = '#' + dt.id;
		while (dt.firstChild) {
			anchor.appendChild(dt.firstChild);
		}
		dt.appendChild(anchor);
		mark(anchor, 'faq');
	});

	// One listener for every control. Clicks with a modifier key or a
	// middle button keep their normal behaviour, such as opening a new tab.
	document.addEventListener('click', function (event) {
		if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
			return;
		}

		var target = event.target.closest('.copylinks-target');
		var url = target ? linkFor(target) : null;
		if (!url) {
			return;
		}

		event.preventDefault();
		// Keep the activated link focused and restore same-page anchor targeting.
		var fragment = target.getAttribute('href').split('#')[1];
		if (fragment && document.getElementById(fragment)) {
			window.location.hash = fragment;
		}
		target.focus({preventScroll: true});
		copy(target, plainUrl ? url : bbcodeFor(url, headingText(target)));
	});
})();
