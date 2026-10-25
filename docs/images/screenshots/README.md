# Copy Links screenshots

Taken on phpBB 3.3 with prosilver, using `phpbb-test-board/screenshots.py` from [phpbb-release-tools](https://github.com/phpbbmodders/phpbb-release-tools), on a board filled with seed-forum's standard fixtures, with the default settings. Copyable headings show an icon (`fa-clone`), which turns into a tick for a moment after a copy; each board screenshot is taken just after a click, while the tick shows. Click an image for the full size.

## Topic title

Clicking the title above a topic copies a link to the topic. The post subjects below still show the icon.

<a href="copylinks-topic.png"><img src="copylinks-topic.png" width="700" alt="Tick after copying a topic title"></a>

## Post subject

Clicking a post's subject copies a link to that post.

<a href="copylinks-post.png"><img src="copylinks-post.png" width="700" alt="Tick after copying a post subject"></a>

## FAQ question

Clicking a question in the FAQ copies a link to that question.

<a href="copylinks-faq.png"><img src="copylinks-faq.png" width="700" alt="Tick after copying an FAQ question"></a>

## Code block

The separate **Copy code** button copies plain code without BBCode. **Select all**
remains available. This Playwright screenshot shows the success label on phpBB
3.3 after an actual clipboard write and read.

<a href="copylinks-code.png"><img src="copylinks-code.png" width="700" height="85" alt="Copied feedback beside Select all in a code block"></a>

## ACP settings

**Extensions → Copy Links → Settings**: choose plain URLs or BBCode (the default), turn the icon on or off, and choose which Font Awesome icon it is. With the icon off, only the tick shows after a copy.

<a href="copylinks-acp-settings.png"><img src="copylinks-acp-settings.png" width="700" height="492" alt="ACP settings"></a>
