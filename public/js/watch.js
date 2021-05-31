const subscribeBtn = document.querySelector("#subscribeBtn");

subscribeBtn.addEventListener("click", onSubscribe);
async function onSubscribe() {
  const data = await fetch(`/subscribers/${channelId}`, { method: "POST" });
  console.log(data);
}
