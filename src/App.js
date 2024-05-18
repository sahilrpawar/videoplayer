import React, { useEffect, useState } from "react";
import VideoJsPlayer from "./Component/VideoPlayer/VideoJsPlayer.component";
import "./styles.css";

// for Test
const playList = [
  {
    src: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"
  },
  {
    src:
      // "https://www.filimo.com/movie/watch/m3u8/mof/yes/v/1/usid/3669532/uid/163526173010445799/tot/1635146530/utp/91243012/movie_uid/0jpxa/movie_id/81446/devicetype/site/agentsdk/0/agentafcn/163473051971447/issmart/0/hash_url/0f456447eaac5c38957e14ac7ba3fe30/hash_urln/63d1635f0c7be82e0046dd3faeb03ec9/afcn/163473051971447/movie.m3u8"
      "https://www.filimo.com/movie/watch/m3u8/mof/yes/v/1/usid/125307/uid/163580492010695424/tot/1635689720/utp/91281266/movie_uid/0jpxa/movie_id/81446/devicetype/site/agentsdk/0/agentafcn/163568958169462/issmart/0/hash_url/6794a904db6aa753c6be240432ca62b0/hash_urln/0f2dc8b9a1ac04d9b46fc9138aa11877/afcn/163568958169462/movie.m3u8"
  },
  {
    src:
      "https://www.filimo.com/movie/watch/m3u8/mof/yes/v/1/usid/0/uid/163577869741896398/tot/1635663497/utp/91365749/movie_uid/x0p5y/movie_id/85779/devicetype/site/agentsdk/0/agentafcn/163470982622182/issmart/0/hash_url/5d6ddd11b8205d1ef6c97e7aa82c1d67/hash_urln/bd7280da509cc3aa1294a031d0f9cce5/afcn/163470982622182/movie.m3u8?bh=239",
    thumbnail:
      "https://static.cdn.asset.filimo.com/filimo-video/85779-thumb-t01.jpg"
  }
];

export default function App() {
  const [watcher, setWatcher] = useState(0); // for Testing
  const [source, setSource] = useState(null);
  useEffect(() => {
    setSource(playList[0].src);
  }, []);
  useEffect(() => {
    setSource(playList[watcher].src);
  }, [watcher]);
  // handle next or Previous button
  const handleAction = (actionName) => {
    if (actionName === "next") {
      if (watcher === playList.length - 1) {
        setWatcher(0);
      } else {
        setWatcher((prev) => prev + 1);
      }
    } else if (actionName === "before") {
      if (watcher === 0) {
        setWatcher(playList.length - 1);
      } else {
        setWatcher((prev) => prev - 1);
      }
    }
  };

  const videoSrc = {
    autoplay: false,
    controls: true,
    responsive: true
  };

  return (
    <div className="App">
      {source && (
        <VideoJsPlayer
          source={source}
          options={videoSrc}
          handleActionNext={() => handleAction("next")}
          handleActionBefore={() => handleAction("before")}
          teaserStartTime={1}
          teaserDuration={20}
        />
      )}
    </div>
  );
}
