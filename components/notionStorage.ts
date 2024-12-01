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

export async function getNotionApiKey() {
  return await notionApiKeyItem.getValue();
}

export async function getNotionDatabaseId() {
  return await notionDatabaseIdItem.getValue();
}

export async function setNotionApiKey(apiKey: string) {
  await notionApiKeyItem.setValue(apiKey);
}

export async function setNotionDatabaseId(databaseId: string) {
  await notionDatabaseIdItem.setValue(databaseId);
}
