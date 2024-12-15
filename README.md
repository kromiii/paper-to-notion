# Paper to Notion

This is a simple chrome extension that allows you to save papers to Notion.

[Chrome Extension](https://chromewebstore.google.com/detail/paper-to-notion/edollpfjfbfbginhdlajipmomjmpalhb?authuser=0&hl=ja)

[Demo Movie](https://youtu.be/Pg0eNnxyVTI?si=90uDpYZuJM1nnmnt)

## Usage

1. Find the DOI of the paper you want to save.
2. Click the extension icon.
3. Copy & Paste DOI to the input field.
4. Click the "Save" button.

## Preparation

Create Notion Database which has the following properties:

| Title    | Authors      | Year  | Journal | Volume | DOI  | PDF (optional)  |
|----------|--------------|-------|---------|--------|------|------|
| Text     | Multi-select | Number| Select  | Number | URL  | File |

Create an integration for this app and get the token value.

* Generate an integration token: https://www.notion.com/help/create-integrations-with-the-notion-api
* Set the integration token to the page: https://www.notion.com/help/add-and-manage-connections-with-the-api
* Get the database ID: https://developers.notion.com/reference/retrieve-a-database

Input the token and the database ID to the extension options.

![](assets/image.png)

Pless the "Save Settings" button after you input the values.

## Development

1. Clone this repository.
2. Run `npm install`.
3. Run `npm run dev` to start the development server.
