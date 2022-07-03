(() => {
  // Elements
  const selectVideosBtn = document.querySelector(".CTA--select");
  const syncPlaylistBtn = document.querySelector(".CTA--sync");
  let isPlaylistEmpty;

  // Functions
  function sendMessage() {
    console.log("clicked");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { getVideoIds: true },
        ({ playlistVideosCount }) => {
          isPlaylistEmpty = !playlistVideosCount;
        }
      );
    });
  }

  function openSyncTube() {
    if (isPlaylistEmpty) {
      return console.log("There are no videos on the playlist");
    }

    chrome.tabs.create({ url: "https://sync-tube.de/create", active: true });
  }

  // Event Listeners
  selectVideosBtn.addEventListener("click", sendMessage);
  syncPlaylistBtn.addEventListener("click", openSyncTube);
})();
