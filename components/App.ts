export function renderApp() {
  return `
    <div>
      <h1 class="title">paper2notion</h1>
      <input type="text" id="doi-input" placeholder="Enter DOI (e.g., 10.1234/abcd.efgh)" />
      <button id="save-button" type="button">Save</button>
      <button id="settings-button" type="button">Settings</button>
      <div id="settings" style="display: none;">
        <input type="text" id="notion-api-key" placeholder="Notion API Key" />
        <input type="text" id="notion-database-id" placeholder="Notion Database ID" />
        <button id="save-settings-button" type="button">Save Settings</button>
      </div>
      <div id="message" style="color: red; margin-top: 10px;"></div>
    </div>
  `;
}
