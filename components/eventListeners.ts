import { getNotionApiKey, getNotionDatabaseId, setNotionApiKey, setNotionDatabaseId } from "./notionStorage";

export function setupEventListeners() {
  const saveButton = document.querySelector<HTMLButtonElement>("#save-button");
  const settingsButton = document.querySelector<HTMLButtonElement>("#settings-button");
  const saveSettingsButton = document.querySelector<HTMLButtonElement>("#save-settings-button");

  settingsButton!.addEventListener("click", toggleSettingsVisibility);
  saveSettingsButton!.addEventListener("click", saveSettings);
  saveButton!.addEventListener("click", savePaperData);

  function toggleSettingsVisibility() {
    const settingsDiv = document.querySelector<HTMLDivElement>("#settings");
    if (settingsDiv!.style.display === "none") {
      settingsDiv!.style.display = "block";
      loadSettings();
    } else {
      settingsDiv!.style.display = "none";
    }
  }

  async function loadSettings() {
    document.querySelector<HTMLInputElement>("#notion-api-key")!.value = await getNotionApiKey();
    document.querySelector<HTMLInputElement>("#notion-database-id")!.value = await getNotionDatabaseId();
  }

  function setMessage(message: string, isError: boolean = false) {
    const messageDiv = document.querySelector<HTMLDivElement>("#message");
    messageDiv!.style.color = isError ? "red" : "green";
    messageDiv!.innerText = message;
  }

  async function saveSettings() {
    const notionApiKey = (
      document.querySelector<HTMLInputElement>("#notion-api-key")!.value || ""
    ).trim();
    const notionDatabaseId = (
      document.querySelector<HTMLInputElement>("#notion-database-id")!.value || ""
    ).trim();
    setMessage("Saving settings...", false);
    await setNotionApiKey(notionApiKey);
    await setNotionDatabaseId(notionDatabaseId);
    setMessage("Settings saved successfully", false);
  }

  async function savePaperData() {
    const doi = (
      document.querySelector<HTMLInputElement>("#doi-input")!.value || ""
    ).trim();
    if (doi) {
      try {
        setMessage("Fetching paper data...", false);
        const data = await fetchPaperData(doi);
        await saveDataToNotion(data);
        setMessage("Data saved to Notion successfully", false);
      } catch (error) {
        const errorMessage = (error as Error).message;
        setMessage("Error fetching paper data: " + errorMessage, true);
      }
    } else {
      setMessage("DOI is empty", true);
    }
  }

  async function fetchPaperData(doi: string) {
    const response = await fetch(`https://api.crossref.org/works/${doi}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  }

  async function saveDataToNotion(data: any) {
    const notionApiKey = await getNotionApiKey();
    const notionDatabaseId = await getNotionDatabaseId();
    setMessage("Saving data to Notion...", false);
    try {
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
                    content: data.message.title?.[0] || "Untitled",
                  },
                },
              ],
            },
            Authors: {
              multi_select: data.message.author?.map((author: any) => ({
                name: `${author.given} ${author.family}`.substring(0, 100), // Notionの制限に対応
              })) || [],
            },
            Year: {
              number: data.message["published-print"]?.["date-parts"]?.[0]?.[0] ||
                data.message["published-online"]?.["date-parts"]?.[0]?.[0] || null,
            },
            Journal: {
              select: {
                name: data.message["container-title"]?.[0] ||
                  data.message["short-container-title"]?.[0] ||
                  "Unknown Journal",
              },
            },
            Volume: {
              number: data.message.volume ? parseInt(data.message.volume) : null,
            },
            DOI: {
              url: `https://doi.org/${data.message.DOI}`,
            },
          }
        }),
      });

      if (!notionResponse.ok) {
        const errorData = await notionResponse.json();
        throw new Error(`Notion API error: ${JSON.stringify(errorData)}`);
      }
    } catch (error: unknown) {
      console.error("Error details:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to save data to Notion: ${errorMessage}`);
    }
  }
}
