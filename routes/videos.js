const express = require("express");
const fs = require("fs");
const router = express.Router();
const videoList = require("../data/videos.json");
const { v4: uuidv4 } = require("uuid");

router
  .route("/videos")

  .get((req, res) => {
    const stringVideos = fs.readFileSync("./data/videos.json", "utf-8");
    const jsonVideos = JSON.parse(stringVideos);

    const result = jsonVideos.reduce((vidarr, video) => {
      vidarr.push({
        id: video.id,
        title: video.title,
        channel: video.channel,
        image: video.image,
      });
      return vidarr;
    }, []);

    res.send(result);
  })

  .post((req, res) => {
    const stringVideos = fs.readFileSync("./data/videos.json", "utf-8");
    const jsonVideos = JSON.parse(stringVideos);

    const newVideoComingFromBackend = {
      id: uuidv4(),
      title: req.body.title,
      channel: "Desperate Mountaineers",
      image: "image9.jpg",
      description: req.body.description,
      views: 0,
      likes: 0,
      duration: 0,
      video: "https://project-2-api.herokuapp.com/stream",
      timestamp: new Date().getTime(),
      comments: [],
    };

    jsonVideos.push(newVideoComingFromBackend);
    fs.writeFileSync("./data/videos.json", JSON.stringify(jsonVideos));
    console.log(newVideoComingFromBackend);
    res.json(jsonVideos);
  });

router.get("/videos/:videoId", (req, res) => {
  const stringVideos = fs.readFileSync("./data/videos.json", "utf-8");
  const jsonVideos = JSON.parse(stringVideos);

  const foundVideo = jsonVideos.find(
    (video) => video.id === req.params.videoId
  );

  foundVideo ? res.send(foundVideo) : res.status(404).send("No video found");
});

router.post("/newComments", (req, res) => {
  const stringVideos = fs.readFileSync("./data/videos.json", "utf-8");
  const jsonVideos = JSON.parse(stringVideos);

  const newCommentFromFrontend = req.body.comment;
  const videIdfromFrontend = req.body.selectedVideoId;

  const foundVideo = jsonVideos.find(
    (video) => video.id === req.body.selectedVideoId
  );
  const newCommentObj = {
    id: uuidv4(),
    name: "Micheal Anderson",
    comment: req.body.comment,
    likes: 0,
    timestamp: new Date().getTime(),
  };

  foundVideo.comments.push(newCommentObj);
  console.log(foundVideo);
  fs.writeFileSync("./data/videos.json", JSON.stringify(jsonVideos));
  res.json(foundVideo);
});

router.delete("/deleteComment/:commentId/:selectedVideoId", (req, res) => {
  const stringVideos = fs.readFileSync("./data/videos.json", "utf-8");
  const jsonVideos = JSON.parse(stringVideos);

  const foundVideo = jsonVideos.find(
    (video) => video.id === req.params.selectedVideoId
  );

  const updatedComments = foundVideo.comments.filter(
    (comment) => comment.id !== req.params.commentId
  );
  foundVideo.comments = updatedComments;
  fs.writeFileSync("./data/videos.json", JSON.stringify(jsonVideos));
  res.json(foundVideo.comments);
});

module.exports = router;
