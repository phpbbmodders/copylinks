<?php
/**
 * Adds the copy-format setting, preserving BBCode as the default.
 *
 * @license GNU General Public License, version 2 (GPL-2.0)
 */

namespace phpbbmodders\copylinks\migrations;

class add_copy_format extends \phpbb\db\migration\migration
{
	public function effectively_installed()
	{
		return isset($this->config['copylinks_plain_url']);
	}

	public static function depends_on()
	{
		return ['\\phpbbmodders\\copylinks\\migrations\\install_icon_settings'];
	}

	public function update_data()
	{
		return [
			['config.add', ['copylinks_plain_url', 0]],
		];
	}
}
