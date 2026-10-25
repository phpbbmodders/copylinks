# Browser checks

`code-copy.js` checks Copy code against a running local phpBB board with the
extension enabled. Set `COPYLINKS_TEST_URL` to a topic containing at least two
code blocks, including multiline code with indentation, blank lines and Unicode.
The script checks exact clipboard contents, multiple blocks, repeated copying,
Enter and Space, visible feedback, the status region, manual-copy selection after denied, missing or insecure clipboard access and recovery, focus,
a 320-pixel viewport, existing heading copying and Select all, and content
availability with JavaScript disabled. Clipboard writes are stubbed.

Run with Node.js and Playwright available in the environment:

```bash
COPYLINKS_TEST_URL='http://localhost:18127/viewtopic.php?t=1' \
  node tests/browser/code-copy.js
```

Optionally set `COPYLINKS_SCREENSHOT` to save the first code block at the narrow
viewport. Repeat on phpBB 3.3 and 4.0 and with each ACP link-format setting.
These checks do not test spoken screen reader output.
