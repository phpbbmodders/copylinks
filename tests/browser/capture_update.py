#!/usr/bin/env python3
"""Capture Copy Links update states with phpbb-test-board's screenshot tool.

Inputs: a local seeded topic URL with a code block, and an output directory.
Outputs: three full-resolution PNGs; existing board data is left unchanged.
Clipboard success and failure are controlled for reproducible feedback states.
"""
import argparse
from pathlib import Path
import sys
from types import SimpleNamespace
from urllib.parse import urlsplit


def main() -> int:
    """Validate the topic and capture normal, success and fallback states."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        '-u', '--url', required=True,
        help='Local topic URL with a code block')
    parser.add_argument(
        '-o', '--out', required=True, type=Path,
        help='Dated gallery directory')
    parser.add_argument('-t', '--tool-dir', type=Path,
                        default=(Path(__file__).resolve().parents[3]
                                 / 'phpbb-release-tools/phpbb-test-board'),
                        help='Shared phpbb-test-board tool directory')
    if len(sys.argv) == 1:
        parser.print_help()
        return 0
    args = parser.parse_args()
    target = urlsplit(args.url)
    if (target.scheme != 'http'
            or target.hostname not in ('localhost', '127.0.0.1')):
        parser.error('--url must identify a local disposable HTTP board')
    if not (args.tool_dir / 'screenshots.py').is_file():
        parser.error('--tool-dir must contain screenshots.py')
    sys.path.insert(0, str(args.tool_dir.resolve()))
    import screenshots  # pylint: disable=import-outside-toplevel

    args.out.mkdir(parents=True, exist_ok=True)
    board = SimpleNamespace(base=f'{target.scheme}://{target.netloc}')
    topic = target.path.lstrip('/')
    if target.query:
        topic += '?' + target.query

    def prepare(state):
        """Return a screenshot-tool prepare hook for one controlled outcome."""
        def run(page):
            button = page.locator('.copylinks-code').first
            button.wait_for()
            if state == 'success':
                page.evaluate("Object.defineProperty(navigator, 'clipboard', "
                              "{configurable:true,value:{writeText:() =>"
                              "Promise.resolve()}})")
                button.press('Enter')
                page.wait_for_function(
                    "document.querySelector('.copylinks-code').textContent"
                    " === 'Copied!'")
            elif state == 'failure':
                page.evaluate("Object.defineProperty(navigator, 'clipboard', "
                              "{configurable:true,value:undefined})")
                button.press('Space')
                page.wait_for_function(
                    "document.querySelector('.copylinks-code').textContent"
                    " === 'Copy manually'")
            else:
                button.focus()
                button.press('Tab')
                page.keyboard.press('Shift+Tab')
            page.mouse.move(0, 0)
        return run

    with screenshots.sync_playwright() as playwright:
        browser = screenshots.ensure_chromium(playwright)
        try:
            shooter = screenshots.Shooter(board, browser, args.out.resolve())
            states = [('01-copy-code', 'normal'),
                      ('02-code-copied', 'success'),
                      ('03-copy-manually', 'failure')]
            for name, state in states:
                shooter.shot(name, topic, selector='.codebox',
                             prepare=prepare(state))
            print(f'{len(shooter.saved)} screenshots saved; '
                  f'{len(shooter.failed)} failed')
            return 1 if shooter.failed else 0
        finally:
            browser.close()


if __name__ == '__main__':
    raise SystemExit(main())
