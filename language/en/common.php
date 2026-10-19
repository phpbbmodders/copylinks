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
	'COPYLINKS_HINT'		=> 'Copy a link to this as BBCode',
	'COPYLINKS_COPIED'		=> 'The link has been copied.',
	'COPYLINKS_COPY_FAILED'	=> 'The link could not be copied automatically. Copy it from here:',
]);
