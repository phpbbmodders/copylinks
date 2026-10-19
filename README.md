# Copy Links

[![Tests](https://github.com/phpbbmodders/copylinks/actions/workflows/tests.yml/badge.svg)](https://github.com/phpbbmodders/copylinks/actions/workflows/tests.yml) [![Lint](https://github.com/phpbbmodders/copylinks/actions/workflows/lint.yml/badge.svg)](https://github.com/phpbbmodders/copylinks/actions/workflows/lint.yml)

Click a forum, topic, post or FAQ heading to copy a link to it, ready-made as BBCode.

## Features

- Click a forum or topic title, a post subject, or a question in the FAQ or BBCode guide, and a link to it is copied as BBCode, for example `[url=https://example.com/forum/viewtopic.php?t=42]Topic title[/url]`. Paste it into a post and it shows as a readable link.
- Also works on the title above the posting form and on the posts in the topic review below it.
- Links are full addresses built from the forum, topic or post ID, so they work anywhere they're pasted and never carry a session ID. They always point at the forum, topic or post itself, not a page of it.
- A tick shows for a moment after copying, and screen readers announce "The link has been copied."
- Ctrl-, Cmd-, Shift- and middle-clicks still open the link as usual.
- When the browser won't allow copying (for example a board on plain `http://`), the BBCode is shown in a box to copy by hand.
- Search engine bots get the board unchanged.
- No settings. Works with prosilver and styles based on it.

## Requirements

- phpBB 3.3.19 or later, including phpBB 4.0
- PHP 7.4 or later (phpBB 4.0 itself needs PHP 8.2 or later)

## Installation

1. Copy the extension to `/ext/phpbbmodders/copylinks`
2. In the Administration Control Panel, go to **Customise → Manage extensions**
3. Enable the **Copy Links** extension

## Contributing

Contributions are welcome!

- **Bug reports**: [Open an issue](https://github.com/phpbbmodders/copylinks/issues).
- **Everything else** (questions, feature requests, ideas, general discussion): [Use Discussions](https://github.com/orgs/phpbbmodders/discussions), or the [community forum](https://www.phpbbmodders.com/community/).
- Pull requests are welcome for bug fixes or discussed features.

## Acknowledgments

- Based on [Click/tap/Enter to copy pre-formatted links](https://www.phpbb.com/community/viewtopic.php?t=2676238), style code shared on phpBB.com by Gumboots, which itself grew out of the older Post Numbers extension.
- Code review, bug fixes, and documentation assisted by [Claude](https://www.anthropic.com/claude).

## License

This extension is licensed under the **GNU General Public License v2.0**.

See [license.txt](license.txt) for more information.
