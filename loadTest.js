import http from "k6/http";
import { check, sleep } from "k6";

const assetUrl =
  "https://community-hubs-stage.adobe.io/api/v2/ff_community/assets?size=48&sort=updated_desc&include_pending_assets=false";

const limit = 100;

const loadAsset = async (url, time = 0) => {
  console.log({ url, time });
  
  const params = {
    "X-Api-Key": "alfred-community-hubs",
  };

  try {
    const response = await http.get(url, params);

    const nextUrl = response.data._links.next.href;

    if (time >= limit) {
      return;
    }

    loadAsset(nextUrl, time + 1);
  } catch (error) {
    console.error(error);
  }
};

// start
loadAsset(assetUrl);
    