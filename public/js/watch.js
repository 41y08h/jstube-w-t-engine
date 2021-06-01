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

const commentForm = document.querySelector("#commentForm");
const commentInput = document.querySelector("#commentInput");
const commentsList = document.querySelector("#comments-list");

commentForm.addEventListener("submit", onCommentSubmit);

async function onCommentSubmit(e) {
  e.preventDefault();

  const res = await fetch(`/comments/${videoId}`, {
    method: "POST",
    body: JSON.stringify({
      text: commentInput.value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  commentsList.insertBefore(Comment(data), commentsList.firstElementChild);
  commentInput.value = "";
}

let observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) fetchComments();
    });
  },
  {
    rootMargin: "0px",
    threshold: 1.0,
  }
);

observer.observe(document.querySelector("#commentsBottom"));

let page = 1;
let hasMore = true;
async function fetchComments() {
  if (!hasMore) return;
  const res = await fetch(`/comments/${videoId}?page=${page}`);
  const data = await res.json();

  hasMore = data.hasMore;
  const totalText = document.querySelector("#totalTxt");
  totalText.textContent = `${data.total} Comments`;

  data.items.map((comment) => {
    commentsList.appendChild(Comment(comment));
  });
  page++;
}

fetchComments();

function Comment(data) {
  let isEditing = false;

  const commentDiv = document.createElement("div");
  commentDiv.className = "border border-black my-2";

  // Text
  const text = document.createElement("span");
  text.textContent = data.text;
  commentDiv.appendChild(text);

  // Edit form
  const editForm = document.createElement("form");

  editForm.addEventListener("submit", onEditSubmit);

  const editInput = document.createElement("input");
  editInput.defaultValue = data.text;
  editForm.appendChild(editInput);

  async function onEditSubmit(event) {
    event.preventDefault();
    const text = editInput.value;
    const res = await fetch("http://localhost:5000/videos");
    const data = await res.json();
    console.log(data);
  }

  const editBtn = document.createElement("button");
  editBtn.textContent = "edit";
  editBtn.className = "bg-gray-200 mx-4";
  commentDiv.appendChild(editBtn);
  editBtn.addEventListener("click", onEdit);

  function onEdit(event) {
    event.preventDefault();
    if (isEditing) {
      editForm.remove();
      commentDiv.appendChild(text);
    } else {
      text.remove();
      commentDiv.appendChild(editForm);
    }
  }

  return commentDiv;
}
