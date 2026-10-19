<?php
/**
 *
 * Copy Links extension for the phpBB Forum Software package
 *
 * @copyright (c) 2026, phpBB Modders, https://www.phpbbmodders.com/
 * @license GNU General Public License, version 2 (GPL-2.0)
 *
 */

namespace phpbbmodders\copylinks\migrations;

/**
 * Adds the icon settings and the ACP page for them.
 */
class install_icon_settings extends \phpbb\db\migration\migration
{
	public function effectively_installed()
	{
		return isset($this->config['copylinks_icon']);
	}

	public static function depends_on()
	{
		return ['\phpbb\db\migration\data\v330\v330'];
	}

	public function update_data()
	{
		return [
			['config.add', ['copylinks_icon_enable', 1]],
			['config.add', ['copylinks_icon', 'fa-clone']],

			['module.add', ['acp', 'ACP_CAT_DOT_MODS', 'ACP_COPYLINKS']],
			['module.add', ['acp', 'ACP_COPYLINKS', [
				'module_basename'	=> '\phpbbmodders\copylinks\acp\main_module',
				'modes'				=> ['settings'],
			]]],
		];
	}
}
