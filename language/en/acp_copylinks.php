<?php
/**
 *
 * Copy Links extension for the phpBB Forum Software package
 *
 * @copyright (c) 2026, phpBB Modders, https://www.phpbbmodders.com/
 * @license GNU General Public License, version 2 (GPL-2.0)
 *
 */

if (!defined('IN_PHPBB'))
{
	exit;
}

if (empty($lang) || !is_array($lang))
{
	$lang = [];
}

$lang = array_merge($lang, [
	'ACP_COPYLINKS_SETTINGS_EXPLAIN'	=> 'Forum, topic, post and FAQ headings copy a link to themselves as BBCode when clicked. These settings change how those headings look.',
	'COPYLINKS_ICON_ENABLE'				=> 'Show an icon next to copyable headings',
	'COPYLINKS_ICON_ENABLE_EXPLAIN'		=> 'The icon shows that a heading can be copied, and turns into a tick for a moment after copying. When it is off, only the tick shows after copying.',
	'COPYLINKS_ICON'					=> 'Icon',
	'COPYLINKS_ICON_EXPLAIN'			=> 'Font Awesome icon class, for example fa-clone or fa-link. phpBB 3.3 uses Font Awesome 4.7 and phpBB 4.0 uses Font Awesome 6, so choose a name both have. The default, fa-clone, works on both.',
	'COPYLINKS_ICON_PREVIEW'			=> 'Current icon',
	'COPYLINKS_ICON_INVALID'			=> 'Enter a Font Awesome icon class in the format fa-clone.',
]);
