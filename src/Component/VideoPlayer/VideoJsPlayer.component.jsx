import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "./VideoJsPlayer.styles.css"; // styles
import "video.js/dist/video-js.css"; // videoJs Default Styles
import "videojs-contrib-quality-levels"; // videoJs Quality levels **
import "videojs-hls-quality-selector"; // videojs Quality Selector **
import "videojs-thumbnail-sprite"; // videoJs Thumbnail Plugin
import "videojs-contrib-ads"; // videoJs ads

const VideoJsPlayer = (props) => {
  const { source, handleActionNext } = props;
  const [videoSource, setVideoSource] = useState(source);
  const [isClicked, setIsClicked] = useState(false);
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const { options, onReady, teaserStartTime, teaserDuration } = props;

  useEffect(() => {
    setVideoSource(source);
  }, [source]);

  React.useEffect(() => {
    // make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      const player = (playerRef.current = videojs(videoElement, options, () => {
        onReady && onReady(player);
      }));

      // handle the quality Levels of Video
      player.qualityLevels();
      player.hlsQualitySelector({
        displayCurrentQuality: true
      });

      // handle the Thumbnail of Video
      player.thumbnailSprite({
        sprites: [
          {
            url:
              "https://static.cdn.asset.filimo.com/filimo-video/85779-thumb-t01.jpg",
            start: 0,
            duration: 1000,
            interval: 10,
            width: 106,
            height: 60
          }
        ]
      });

      // handle Ads of Video
      player.ads();

      player.on("contentchange", () => {
        player.trigger("adsready");
      });

      player.on("readyforpreroll", function () {
        player.ads.startLinearAdMode();
        // play your linear ad content
        // in this example, we use a static mp4
        player.src("https://www.w3schools.com/html/mov_bbb.mp4");

        // send event when ad is playing to remove loading spinner
        player.one("adplaying", function () {
          player.trigger("ads-ad-started");
        });

        // resume content when all your linear ads have finished
        player.on("adended", function () {
          player.ads.endLinearAdMode();
        });
      });
      player.trigger("adsready");

      //  get The Button Component of VideoJs
      var Button = videojs.getComponent("Button");

      //  implement the Rewind Button
      var rewind = videojs.extend(Button, {
        constructor: function () {
          Button.apply(this, arguments);
          this.addClass("rewindIcon");
          /* initialize your button */
        },
        handleClick: function () {
          player.currentTime(player.currentTime() - 10);
        }
      });
      videojs.registerComponent("rewind", rewind);
      player.getChild("ControlBar").addChild("rewind", {}, 2);
      // rewind.addClass("vjs-icon-reply");

      //  implement the Fastforward Button
      var fastForward = videojs.extend(Button, {
        constructor: function () {
          Button.apply(this, arguments);
          this.addClass("fast-forward-icon");
          /* initialize your button */
        },
        handleClick: function () {
          player.currentTime(player.currentTime() + 10);
        }
      });
      videojs.registerComponent("fastForward", fastForward);
      player.getChild("ControlBar").addChild("fastForward", {}, 3);

      // implement The Chapter Button
      var chaptersButton = videojs.extend(Button, {
        constructor: function () {
          Button.apply(this, arguments);
          this.addClass("chapters-button");
          /* initialize your button */
        },
        handleClick: function () {
          setIsClicked((prev) => !prev);
        }
      });
      videojs.registerComponent("chaptersButton", chaptersButton);
      player.getChild("ControlBar").addChild("chaptersButton", {});

      //  implement The SkipTeaserButton
      var skipTeaserButton = videojs.extend(Button, {
        constructor: function () {
          Button.apply(this, arguments);
          this.addClass("skip-teaser-button");
          /* initialize your button */
        },
        handleClick: function () {
          player.currentTime(teaserStartTime + teaserDuration);
        }
      });
      videojs.registerComponent("skipTeaserButton", skipTeaserButton);
      player.on("timeupdate", () => {
        const time = player.currentTime().toFixed();
        const teaserEndTime = teaserStartTime + teaserDuration;

        if (time >= teaserStartTime && time <= teaserEndTime) {
          if (!!player.getChild("skipTeaserButton") === false) {
            player.addChild("skipTeaserButton", {});
          }
        } else {
          player.removeChild("skipTeaserButton", {});
        }
      });

      // implement the To Next Video Button on the Control Bar
      var NextButtonOnControl = videojs.extend(Button, {
        constructor: function () {
          Button.apply(this, arguments);
          this.addClass("next-button-on-Control");
          /* initialize your button */
        },
        handleClick: function () {
          handleActionNext();
        }
      });
      videojs.registerComponent("NextVideoOnControl", NextButtonOnControl);
      player.getChild("ControlBar").addChild("NextVideoOnControl");

      // implement The Next Button Video on The Side And in the End of video
      var nextButtonOnSide = videojs.extend(Button, {
        constructor: function () {
          Button.apply(this, arguments);
          this.addClass("next-button-side");
          /* initialize your button */
        },
        handleClick: function () {
          handleActionNext();
        }
      });
      videojs.registerComponent("nextButtonOnSide", nextButtonOnSide);
      player.on("timeupdate", () => {
        const time = player.currentTime().toFixed();
        const videoDuration = player.duration();
        const timeToShowButton = videoDuration - 80;
        if (videoDuration !== 0) {
          if (time >= timeToShowButton) {
            if (!!player.getChild("nextButtonOnSide") === false) {
              player.addChild("nextButtonOnSide", {});
            }
          } else {
            player.removeChild("nextButtonOnSide", {});
          }
        }
      });

      // handle The keyboard Keys
      player.on("keydown", (e) => {
        const playerVolume = player.volume();
        const playerCurrentTime = player.currentTime();
        switch (e.code) {
          case "Space":
            if (player.paused()) {
              player.play();
            } else {
              player.pause();
            }
            break;
          case "ArrowRight":
            player.currentTime(playerCurrentTime + 10);
            break;
          case "ArrowLeft":
            player.currentTime(playerCurrentTime - 10);
            break;
          case "ArrowUp":
            player.volume(playerVolume + 0.1);
            break;
          case "ArrowDown":
            player.volume(playerVolume - 0.1);
            break;
          case "KeyM":
            player.volume(0);
            break;
          default:
            return;
        }
      });
    }
  }, [options]);

  // useEffect(() => {
  //   if (playerRef.current) {
  //     playerRef.current.pause();
  //     playerRef.current.src(playList[URLsWatcher]?.src);
  //     playerRef.current.load();
  //     playerRef.current.play();
  //     playerRef.current.on("onloadedmetadata", () => {
  //       console.log(playerRef.current.duration());
  //     });
  //     // window.open(URLs[URLsWatcher]);
  //   }
  // }, [URLsWatcher]);

  React.useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="player">
      <div
        className={`chapters ${isClicked ? "come-from-left" : "go-to-left"}`}
      ></div>
      <div data-vjs-player>
        <video
          ref={videoRef}
          className="video-js vjs-matrix vjs-big-play-centered"
        >
          <source src={videoSource} type="application/x-mpegURL" />
        </video>
      </div>
    </div>
  );
};

// playList[URLsWatcher]?.src
export default VideoJsPlayer;
