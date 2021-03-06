const { Router } = require("express");
const db = require("../lib/db");

const router = Router();

router.post("/:channelId", async (req, res) => {
  const channelId = req.params.channelId;
  const userId = 1;

  await db.query(
    `
      insert into "Subscriber"("channelId", "userId")
      values ($1, $2)
    `,
    [channelId, userId]
  );

  const {
    rows: [subscribers],
  } = await db.query(
    `
    select cast(count("Subscriber") as int),
          (select "channelId" from "Subscriber" where "channelId" = $1 and "userId" = $2) 
          is not null as "isUserSubscribed"
    from "Subscriber"
    where "channelId" = $1
    `,
    [channelId, userId]
  );

  res.json(subscribers);
});

router.delete("/:channelId", async (req, res) => {
  const channelId = parseInt(req.params.channelId);
  const userId = 1;

  const { rowCount } = await db.query(
    `
    delete from "Subscriber"
    where "channelId" = $1 and
          "userId" = $2
  `,
    [channelId, userId]
  );

  if (!rowCount) throw res.clientError("There was a problem", 422);

  const {
    rows: [subscribers],
  } = await db.query(
    `
  select cast(count("Subscriber") as int),
        (select "channelId" from "Subscriber" where "channelId" = $1 and "userId" = $2) 
        is not null as "isUserSubscribed"
  from "Subscriber"
  where "channelId" = $1
  `,
    [channelId, userId]
  );

  res.json(subscribers);
});

module.exports = router;
