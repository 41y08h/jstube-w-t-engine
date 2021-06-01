const subscribeBtn = document.querySelector("#subscribeBtn");
const subscribersCountTxt = document.querySelector("#subscribersCountTxt");

subscribeBtn.addEventListener("click", onSubscribe);
async function onSubscribe() {
  const res = await fetch(`/subscribers/${channelId}`, {
    method: isUserSubscribed ? "DELETE" : "POST",
  });
  const data = await res.json();

  if (data.isUserSubscribed) {
    subscribeBtn.textContent = "Subscribed";
    subscribeBtn.classList.add("subscribed");
    isUserSubscribed = true;
  } else {
    subscribeBtn.textContent = "Subscribe";
    subscribeBtn.classList.remove("subscribed");
    isUserSubscribed = false;
  }
  subscribersCountTxt.textContent = `${data.count} Subscribers`;
}

const likeBtn = document.querySelector("#likeBtn");
const dislikeBtn = document.querySelector("#dislikeBtn");

likeBtn.addEventListener("click", onLike);
dislikeBtn.addEventListener("click", onDislike);
async function onLike() {
  const res = await fetch(`/ratings/videos/${videoId}/like`, {
    method: "POST",
  });
  const data = await res.json();

  const {
    count: { likes, dislikes },
    userRatingStatus,
  } = data;
  likeBtn.textContent = `${likes} likes`;
  dislikeBtn.textContent = `${dislikes} dislikes`;

  if (userRatingStatus === "LIKED") {
    likeBtn.classList.add("text-gray-400");
    dislikeBtn.classList.remove("text-gray-400");
  }
  if (userRatingStatus === "DISLIKED") {
    dislikeBtn.classList.add("text-gray-400");
    likeBtn.classList.remove("text-gray-400");
  }
}

async function onDislike() {
  const res = await fetch(`/ratings/videos/${videoId}/dislike`, {
    method: "POST",
  });
  const data = await res.json();

  const {
    count: { likes, dislikes },
    userRatingStatus,
  } = data;
  likeBtn.textContent = `${likes} likes`;
  dislikeBtn.textContent = `${dislikes} dislikes`;

  if (userRatingStatus === "LIKED") {
    likeBtn.classList.add("text-gray-400");
    dislikeBtn.classList.remove("text-gray-400");
  }
  if (userRatingStatus === "DISLIKED") {
    dislikeBtn.classList.add("text-gray-400");
    likeBtn.classList.remove("text-gray-400");
  }
}
