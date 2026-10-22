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
 * ACP settings page: copy format and the icon next to copyable headings.
 */
class main_module
{
	/** Icon used when the setting has never been saved */
	const DEFAULT_ICON = 'fa-clone';

	/** Longest icon class accepted; the form field has the same limit */
	const MAX_ICON_LENGTH = 64;

	public $u_action;
	public $tpl_name;
	public $page_title;

	/**
	 * @param string $id	Module ID
	 * @param string $mode	Module mode
	 */
	public function main($id, $mode)
	{
		global $config, $language, $request, $template, $user, $phpbb_log;

		$language->add_lang('acp_copylinks', 'phpbbmodders/copylinks');
		$this->tpl_name = 'acp_copylinks_settings';
		$this->page_title = 'ACP_COPYLINKS_SETTINGS';

		add_form_key('phpbbmodders_copylinks');

		if ($request->is_set_post('submit'))
		{
			if (!check_form_key('phpbbmodders_copylinks'))
			{
				trigger_error($language->lang('FORM_INVALID') . adm_back_link($this->u_action), E_USER_WARNING);
			}

			$icon = trim($request->variable('copylinks_icon', self::DEFAULT_ICON));
			if (strlen($icon) > self::MAX_ICON_LENGTH || !preg_match('/\Afa-[a-z0-9]+(?:-[a-z0-9]+)*\z/', $icon))
			{
				trigger_error($language->lang('COPYLINKS_ICON_INVALID') . adm_back_link($this->u_action), E_USER_WARNING);
			}

			$config->set('copylinks_icon_enable', (int) $request->variable('copylinks_icon_enable', false));
			$config->set('copylinks_icon', $icon);
			$config->set('copylinks_plain_url', (int) $request->variable('copylinks_plain_url', false));

			$phpbb_log->add('admin', $user->data['user_id'], $user->ip, 'LOG_COPYLINKS_SETTINGS');
			trigger_error($language->lang('CONFIG_UPDATED') . adm_back_link($this->u_action));
		}

		$template->assign_vars([
			'S_COPYLINKS_PLAIN_URL'	=> !empty($config['copylinks_plain_url']),
			'U_ACTION'					=> $this->u_action,
			'S_COPYLINKS_ICON_ENABLE'	=> !empty($config['copylinks_icon_enable']),
			'COPYLINKS_ICON'			=> !empty($config['copylinks_icon']) ? $config['copylinks_icon'] : self::DEFAULT_ICON,
			'COPYLINKS_ICON_MAX_LENGTH'	=> self::MAX_ICON_LENGTH,
		]);
	}
}
