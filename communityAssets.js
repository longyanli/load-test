import http from "k6/http";
import { check, sleep } from "k6";

// Configuration to tell k6 how to run the test
export const options = {
  vus: 1000,  // how many virtual users to simulate
  duration: "180s", // duration of the test
};

// Simulated user behavior to load Adobe Firefly Community
export default async function () {
  let res = await loadCommunity();

  // Validate response status
  check(res, { "load successfully": (result) => result === true });
}

const loadCommunity = () => {
  const limit = 1;

  // load the images
  const loadImages = async (assets) => {
    const uniqueId = `${__VU}-${__ITER}`;
    // console.log("start load images with ", { size: assets.length, uniqueId });

    const images = assets.map((asset) => {
      const imageRefTemplate = asset._links.rendition.href;

      // replace the template with the actual values
      const imageRef = imageRefTemplate
        .replace("{format}", "jpg")
        .replace("{dimension}", "width")
        .replace("{size}", "350");

      // console.log({ imageRef });

      // load the image
      return new Promise((resolve) => {
        const data = http.get(imageRef);
        resolve(data);
      });
    });

    await Promise.all(images);

    // console.log("end load images");
  };

  // Load the assets from the community hub API
  // There are two steps to load all the assets
  // 1. Request the cards address for the first screen
  // 2. For each card, load the image based on the address
  const loadAsset = async (url, screen) => {
    if (screen > limit) {
      return true;
    }

    // console.log({ url, screen });

    try {
      const params = {
        headers: { "X-Api-Key": "alfred-community-hubs" },
      };

      // console.log("fetch assets", { url, params });

      const response = http.get(url, params);

      if (response.status !== 200) {
        console.error("loadAsset failed", { url, status: response.status });
        return false;
      }

      // format the response
      const data = response.json();

      // every assets response contains 48 cards
      await loadImages(data._embedded.assets);

      // request for next screen
      const nextUrl = data._links.next.href;

      // console.log("nextUrl", { nextUrl });

      return loadAsset(nextUrl, screen + 1);
    } catch (error) {
      console.error("loadAsset failed", error);
      return false;
    }
  };

  // start
  return loadAsset(
    "https://community-hubs-stage.adobe.io/api/v2/ff_community/assets?size=48&sort=updated_desc&include_pending_assets=false", // first screen
    1
  );
};
