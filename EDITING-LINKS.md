# How to change the links

**This is the only file you need to read to update the page.**

You do not need to install anything, know how to code, or use the command line. Everything happens in your browser.

---

## The short version

1. Open **`public/links.json`** on GitHub.
2. Click the **pencil icon** to edit.
3. Change the text.
4. Click **Commit changes**.
5. Wait about 30 seconds. The live page updates itself.

That is the whole process.

---

## What a link looks like

Every button on the page is one block of text that looks like this:

```json
{
  "title": "Join AIS",
  "subtitle": "Free for freshmen",
  "url": "https://example.com/ais",
  "enabled": true
}
```

| Field | What it does |
|---|---|
| `title` | The big text on the button. Keep it under about 40 characters. |
| `subtitle` | The small grey text underneath. Optional, delete the line if you don't want one. |
| `url` | Where the button sends people. Must start with `https://` |
| `enabled` | `true` shows the button, `false` hides it. No quote marks around these. |

---

## Common tasks

### Change where a button points

Find the button by its `title`, then replace what is between the quote marks after `"url":`.

```json
"url": "https://the-new-address.com"
```

### Hide a button without deleting it

Change `true` to `false`. This is the safest option for events that have passed, since you can switch it back next year.

```json
"enabled": false
```

### Add a new button

Copy an existing block, paste it, and edit it. **Make sure there is a comma after the `}` of every block except the last one.**

```json
    {
      "title": "Milk & Cookies",
      "subtitle": "Thursday, October 9",
      "url": "https://example.com/milk-cookies",
      "enabled": true
    },
    {
      "title": "The last button has no comma after its closing brace",
      "url": "https://example.com",
      "enabled": true
    }
```

### Reorder the buttons

Move whole blocks up or down. They appear on the page in the order they appear in the file. Watch the commas again.

---

## If something goes wrong

**A safety net runs on every change.** If you break the formatting, the check fails, and **the live page keeps showing the last working version.** You cannot take the site down with a bad edit.

You will see a red X next to your change on GitHub. Click it to read what went wrong. It is almost always one of these:

| Symptom | Fix |
|---|---|
| Red X, message mentions JSON | A missing comma between blocks, or an extra comma after the last one |
| Button says "coming soon" | Its `url` is still `"#"`. Put a real address in |
| Button vanished | Its `enabled` is `false`, or you typed `"false"` with quotes instead of `false` without |
| Whole page is blank | You deleted a `[` or `]` or `{` or `}`. Undo your change and try again |

To undo: open the file's **History** on GitHub, find the version before yours, and revert it.

If you are stuck, the file that checks your work is `scripts/validate-links.mjs`, and its error messages say exactly what it did not like.

---

## Rules of thumb

- **Eight buttons maximum.** More than that means scrolling on a phone, and people scanning a QR code at a booth will not scroll.
- **Put the most important link first.** Most people tap one thing and leave.
- **Always test your link** by pasting it in a browser before you save it here. A dead link is worse than no link.
- **Write titles as actions**, like "Join AIS", not "AIS Information".
