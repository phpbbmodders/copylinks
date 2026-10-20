<?php
/**
 *
 * Copy Links extension for the phpBB Forum Software package
 *
 * @copyright (c) 2026, phpBB Modders, https://www.phpbbmodders.com/
 * @license GNU General Public License, version 2 (GPL-2.0)
 *
 */

namespace phpbbmodders\copylinks\event;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Loads the extension's language strings and gives the page script what it
 * needs to build absolute links.
 */
class listener implements EventSubscriberInterface
{
	/** @var \phpbb\config\config */
	protected $config;

	/** @var \phpbb\template\template */
	protected $template;

	/** @var string */
	protected $php_ext;

	/**
	 * @param \phpbb\config\config		$config		Config object
	 * @param \phpbb\template\template	$template	Template object
	 * @param string					$php_ext	PHP file extension
	 */
	public function __construct(\phpbb\config\config $config, \phpbb\template\template $template, $php_ext)
	{
		$this->config = $config;
		$this->template = $template;
		$this->php_ext = $php_ext;
	}

	/**
	 * @return array
	 */
	public static function getSubscribedEvents()
	{
		return [
			'core.user_setup'	=> 'load_language',
			'core.page_header'	=> 'assign_template_vars',
		];
	}

	/**
	 * Load the extension's strings on every page.
	 *
	 * @param \phpbb\event\data $event
	 */
	public function load_language($event)
	{
		$lang_set_ext = $event['lang_set_ext'];
		$lang_set_ext[] = [
			'ext_name'	=> 'phpbbmodders/copylinks',
			'lang_set'	=> 'common',
		];
		$event['lang_set_ext'] = $lang_set_ext;
	}

	/**
	 * Pass the board URL and PHP file extension to the page script, so copied
	 * links are absolute and never carry a session ID, and the icon to show
	 * next to copyable headings (empty when the icon is turned off).
	 */
	public function assign_template_vars()
	{
		$this->template->assign_vars([
			'U_COPYLINKS_BOARD'		=> generate_board_url() . '/',
			'COPYLINKS_PHP_EXT'		=> $this->php_ext,
			'COPYLINKS_ICON'		=> !empty($this->config['copylinks_icon_enable']) ? (string) $this->config['copylinks_icon'] : '',
		]);
	}
}
