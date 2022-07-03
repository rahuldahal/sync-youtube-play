(() => {
  const currentURL = new URL(window.location.href);

  if (currentURL.hostname === "sync-tube.de") {
    console.log("this is sync tube");
    return chrome.storage.sync.get("videoIds", ({ videoIds }) => {
      addVideos(videoIds);
    });
  }

  function addVideos(videoIds) {
    console.log(videoIds);
  }

  console.log("this is youtube");

  chrome.runtime.onMessage.addListener((req, sender, res) => {
    const { getVideoIds } = req;
    if (getVideoIds) {
      videoIds = getPlaylistVideoIds();
      console.log(videoIds);
      chrome.storage.sync.set({ videoIds }, () => {
        res({ playlistVideosCount: videoIds.length });
      });
      return true;
    }
  });
})();

function getPlaylistVideoIds() {
  const playlistEndpointElements = Array.from(
    document.querySelectorAll(".playlist-items #wc-endpoint")
  );
  const playlistVideoIds = playlistEndpointElements.map((element) => {
    const urlSearchParams = new URLSearchParams(element.href.split("?")[1]);
    return urlSearchParams.get("v");
  });

  return playlistVideoIds;
}
