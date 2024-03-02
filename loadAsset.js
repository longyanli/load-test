const axios = require("axios");

const assetUrl =
  "https://community-hubs-stage.adobe.io/api/v2/ff_community/assets?size=48&sort=updated_desc&include_pending_assets=false";

const limit = 10;

// load the images
const loadImages = async (assets) => {
  console.log("start load images", { size: assets.length });

  const assetRequst = assets.map((asset) => {
    const imageRefTemplate = asset._links.rendition.href;

    // replace the template with the actual values
    const imageRef = imageRefTemplate
      .replace("{format}", "jpg")
      .replace("{dimension}", "width")
      .replace("{size}", "350");

    // console.log({ imageRef });

    // load the image
    return axios
      .get(imageRef, { responseType: "stream" })
      .then((response) => {
        // console.log({ imageRef, status: response.status });
      })
      .catch((error) => {
        console.error("image load failed", error);
      });
  });

  await Promise.all(assetRequst);

  console.log("end load images");
};

const loadAsset = async (url, time = 0) => {
  console.log({ url, time });

  try {
    const response = await axios.get(url, {
      params: {
        size: 48,
        sort: "updated_desc",
        include_pending_assets: false,
      },
      headers: {
        "X-Api-Key": "alfred-community-hubs",
      },
    });

    // await loadImages(response.data._embedded.assets);

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
