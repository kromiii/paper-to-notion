# p2n: Paper to Notion

This is a simple chrome extension that allows you to save papers to Notion.

## Usage

1. Open a paper page.
2. Click the extension icon.
3. Copy & Paste DOI to the input field.
4. Click the "Save" button.

## Preparation

Create Notion Database which has the following properties:

| Title    | Authors      | Year  | Journal | Volume | DOI  | PDF  |
|----------|--------------|-------|---------|--------|------|------|
| Title    | Multi-select | Number| Select  | Number | URL  | File |

Create a new integration in Notion and get the token_v2 value.

Input the token_v2 value and the database ID to the extension options.

## Technical Details

This extension uses the Notion API to save papers to Notion. 

To get the meatadata of the paper, it uses the [Crossref API](https://www.crossref.org/).
