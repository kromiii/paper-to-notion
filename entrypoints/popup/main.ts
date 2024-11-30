import "./style.css";
import { storage } from "wxt/storage";

const notionApiKeyItem = storage.defineItem<string>("local:NOTION_API_KEY", {
  fallback: "notion_api_token",
});
const notionDatabaseIdItem = storage.defineItem<string>(
  "local:NOTION_DATABASE_ID",
  {
    fallback: "notion_database_id",
  }
);

async function getNotionApiKey() {
  return await notionApiKeyItem.getValue();
}

async function getNotionDatabaseId() {
  return await notionDatabaseIdItem.getValue();
}

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1 class="title">paper2notion</h1>
    <input type="text" id="doi-input" placeholder="Enter DOI" />
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

const saveButton = document.querySelector<HTMLButtonElement>("#save-button");
const settingsButton =
  document.querySelector<HTMLButtonElement>("#settings-button");
const saveSettingsButton = document.querySelector<HTMLButtonElement>(
  "#save-settings-button"
);

settingsButton!.addEventListener("click", async () => {
  const settingsDiv = document.querySelector<HTMLDivElement>("#settings");
  if (settingsDiv!.style.display === "none") {
    settingsDiv!.style.display = "block";
    document.querySelector<HTMLInputElement>("#notion-api-key")!.value =
      await getNotionApiKey();
    document.querySelector<HTMLInputElement>("#notion-database-id")!.value =
      await getNotionDatabaseId();
  } else {
    settingsDiv!.style.display = "none";
  }
});

function setMessage(message: string, isError: boolean = false) {
  const messageDiv = document.querySelector<HTMLDivElement>("#message");
  messageDiv!.style.color = isError ? "red" : "green";
  messageDiv!.innerText = message;
}

saveSettingsButton!.addEventListener("click", async () => {
  const notionApiKey = (
    document.querySelector<HTMLInputElement>("#notion-api-key")!.value || ""
  ).trim();
  const notionDatabaseId = (
    document.querySelector<HTMLInputElement>("#notion-database-id")!.value || ""
  ).trim();
  setMessage("Saving settings...", false);
  await notionApiKeyItem.setValue(notionApiKey);
  await notionDatabaseIdItem.setValue(notionDatabaseId);
  setMessage("Settings saved successfully", false);
});

saveButton!.addEventListener("click", async () => {
  const doi = (
    document.querySelector<HTMLInputElement>("#doi-input")!.value || ""
  ).trim();
  if (doi) {
    try {
      setMessage("Fetching paper data...", false);
      const response = await fetch(`https://api.crossref.org/works/${doi}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      const notionApiKey = await getNotionApiKey();
      const notionDatabaseId = await getNotionDatabaseId();

      setMessage("Saving data to Notion...", false);
      // Notion APIにデータを保存する
      const notionResponse = await fetch("https://api.notion.com/v1/pages", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${notionApiKey}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
        body: JSON.stringify({
          parent: { database_id: notionDatabaseId },
          properties: {
            Title: {
              title: [
                {
                  text: {
                    content: data.message.title[0],
                  },
                },
              ],
            },
            Authors: {
              multi_select: data.message.author.map((author: any) => ({
                name: `${author.given} ${author.family}`,
              })),
            },
            Year: {
              number: data.message["published-print"]["date-parts"][0][0],
            },
            Journal: {
              select: {
                name: data.message["short-container-title"][0],
              },
            },
            Volume: {
              number: parseInt(data.message.volume),
            },
            DOI: {
              url: `https://doi.org/${data.message.DOI}`,
            },
            PDF: {
              files: [],
            },
          },
        }),
      });

      if (!notionResponse.ok) {
        throw new Error("Failed to save data to Notion");
      }

      console.log("Data saved to Notion successfully");
      setMessage("Data saved to Notion successfully", false);
    } catch (error) {
      console.error("Error fetching paper data:", error);
      const errorMessage = (error as Error).message;
      setMessage("Error fetching paper data: " + errorMessage, true);
    }
  } else {
    console.warn("DOI is empty");
    setMessage("DOI is empty", true);
  }
});
