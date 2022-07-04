(() => {
  const currentURL = new URL(window.location.href);
  const { hostname, pathname: fullPathname } = currentURL;
  const pathname = fullPathname.split("/")[1]; // '/rooms/xefcwx6xz0n98xre3br' => 'rooms'

  if (hostname === "w2g.tv") {
    console.log("this is sync tube");
    if (pathname === "") {
      return createRoom();
    }
    if (pathname === "rooms") {
      return addVideos();
    }
  }

  function createRoom() {
    const createRoomBtn = document.querySelector("#create_room_button");
    createRoomBtn && createRoomBtn.click();
  }

  function addVideos() {
    chrome.storage.sync.get("videoIds", ({ videoIds }) => {
      const searchInput = document.querySelector("#search-bar-input");
      let currentIndex = 0;
      const LAST_INDEX = videoIds.length - 1;

      function searchAndAdd() {
        console.log(videoIds[currentIndex]);
        searchInput.value = `https://www.youtube.com/watch?v=${videoIds[currentIndex]}`;
        searchInput.dispatchEvent(new InputEvent("input"));
        searchInput.dispatchEvent(new ClipboardEvent("paste"));
        currentIndex++;

        currentIndex > LAST_INDEX && clearInterval(searchAndAddIntervalId);
        setTimeout(() => addToPlaylist(currentIndex), 2000);
      }

      // TODO: use ES6 generators instead?
      const searchAndAddIntervalId = setInterval(searchAndAdd, 5000);
    });
  }

  function addToPlaylist(currentIndex) {
    const addToPlaylistButton = document.querySelectorAll(
      ".w2g-search-actions button"
    )[1];

    if (!addToPlaylistButton) {
      return;
    }

    addToPlaylistButton.click();

    // play the initial video
    if (currentIndex === 2) {
      setTimeout(playInitialVideo, 500);
    }
  }

  function playInitialVideo() {
    const initialVideoTitle = document.querySelector(".step.forward.icon");
    console.log(initialVideoTitle);
    initialVideoTitle.click();
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
