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
          playlistVideosCount && enableSyncBtn();
        }
      );
    });
  }

  function enableSyncBtn() {
    syncPlaylistBtn.removeAttribute("disabled");
    syncPlaylistBtn.setAttribute("title", "Sync with watch2gether");
    return;
  }

  function disableSyncBtn() {
    syncPlaylistBtn.setAttribute("disabled");
    syncPlaylistBtn.setAttribute("title", "Add videos in the queue to enable");
  }

  function openWatch2Gether() {
    chrome.tabs.create({
      url: "https://w2g.tv/?initiator=extension",
      active: true,
    });

    return disableSyncBtn();
  }

  // Event Listeners
  selectVideosBtn.addEventListener("click", sendMessage);
  syncPlaylistBtn.addEventListener("click", openWatch2Gether);
})();
