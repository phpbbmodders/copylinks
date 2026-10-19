<?php
/**
 *
 * Copy Links extension for the phpBB Forum Software package
 *
 * @copyright (c) 2026, phpBB Modders, https://www.phpbbmodders.com/
 * @license GNU General Public License, version 2 (GPL-2.0)
 *
 */

namespace phpbbmodders\copylinks\acp;

/**
 * ACP module information
 */
class main_info
{
	public function module()
	{
		return [
			'filename'	=> '\phpbbmodders\copylinks\acp\main_module',
			'title'		=> 'ACP_COPYLINKS',
			'modes'		=> [
				'settings'	=> [
					'title'	=> 'ACP_COPYLINKS_SETTINGS',
					'auth'	=> 'ext_phpbbmodders/copylinks && acl_a_board',
					'cat'	=> ['ACP_COPYLINKS'],
				],
			],
		];
	}
}
