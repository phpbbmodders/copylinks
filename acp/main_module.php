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
 * ACP settings page: whether to show an icon next to copyable headings, and
 * which Font Awesome icon to use.
 */
class main_module
{
	/** Icon used when the setting has never been saved */
	const DEFAULT_ICON = 'fa-clone';

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
			if (!preg_match('/\Afa-[a-z0-9]+(?:-[a-z0-9]+)*\z/', $icon))
			{
				trigger_error($language->lang('COPYLINKS_ICON_INVALID') . adm_back_link($this->u_action), E_USER_WARNING);
			}

			$config->set('copylinks_icon_enable', $request->variable('copylinks_icon_enable', 0) ? 1 : 0);
			$config->set('copylinks_icon', $icon);

			$phpbb_log->add('admin', $user->data['user_id'], $user->ip, 'LOG_COPYLINKS_SETTINGS');
			trigger_error($language->lang('CONFIG_UPDATED') . adm_back_link($this->u_action));
		}

		$template->assign_vars([
			'U_ACTION'					=> $this->u_action,
			'COPYLINKS_ICON_ENABLE'		=> !empty($config['copylinks_icon_enable']),
			'COPYLINKS_ICON'			=> !empty($config['copylinks_icon']) ? $config['copylinks_icon'] : self::DEFAULT_ICON,
		]);
	}
}
