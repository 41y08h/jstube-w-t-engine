const router = require("express").Router();
const db = require("../lib/db");

router.post("/:videoId", async (req, res) => {
  const videoId = parseInt(req.params.videoId);
  const userId = 1;

  if (!req.body.text) throw res.clientError("Text is a required field.");

  const {
    rows: [comment],
  } = await db.query(
    `
    with inserted as ( insert into "Comment"(text, "videoId", "userId")
    values ($1, $2, $3)
    returning *)
    select inserted.*, 
	   to_json(author) as author,
	   jsonb_build_object(
           'count', json_build_object(
               'likes', count("CommentLikes"),
               'dislikes', count("CommentDislikes")
           ),
          'userRatingStatus', (
             select status
             from "CommentRating"
             where "userId" = $3  and
                   "commentId" = inserted.id
          )
        ) as ratings
    from inserted
    left join "PublicUser" as author on
	inserted."userId" = author.id
    left join (select *, count("commentId") as count from "CommentRating" where status = 'LIKED' group by "CommentRating".id) as "CommentLikes" on
        "CommentLikes"."commentId" = inserted.id
    left join (select *, count("commentId") as count from "CommentRating" where status = 'DISLIKED' group by "CommentRating".id) as "CommentDislikes" on
        "CommentDislikes"."commentId" = inserted.id
    group by inserted.id, inserted.text, inserted."originalCommentId", inserted."replyToCommentId",
         inserted."userId", inserted."videoId", inserted."createdAt", inserted."updatedAt", author.*
    `,
    [req.body.text, videoId, userId]
  );

  res.json(comment);
});

router.get("/:videoId", async (req, res) => {
  const videoId = parseInt(req.params.videoId);
  const userId = 1;
  const page = parseInt(req.query.page) || 1;

  const { rows: comments } = await db.query(
    `
    select "Comment".id, 
           "Comment"."userId",
           text,
           "videoId",
           "createdAt",
           "updatedAt",
           to_jsonb(author) as author,
           json_build_object(
             'count', json_build_object(
                 'likes', count("CommentLikes"),
                 'dislikes', count("CommentDislikes")
             ),
             'userRatingStatus', (
                 select status
                 from "CommentRating"
                 where "CommentRating"."userId" = $2 and
                       "commentId" = "Comment".id
             )
           ) as ratings
    from "Comment"
    left join "PublicUser" as author on author.id = "userId"
    left join (select *, count(id) as count from "CommentRating" where status = 'LIKED' group by "CommentRating".id) as "CommentLikes" on
    "CommentLikes"."commentId" = "Comment".id
    left join (select *, count(id) as count from "CommentRating" where status = 'DISLIKED' group by "CommentRating".id) as "CommentDislikes" on
    "CommentDislikes"."commentId" = "Comment".id
    where "videoId" = $1 and "replyToCommentId" is null
    group by "Comment".id, "Comment".text, author.*
    order by id
    offset ($3 - 1)* 10
    limit 10
  `,
    [videoId, userId, page]
  );

  const {
    rows: [{ count: total }],
  } = await db.query(
    `
    select cast(count("Comment") as int) from "Comment" 
    where "videoId" = $1 and "replyToCommentId" is null
    `,
    [videoId]
  );

  res.json({
    total,
    count: comments.length,
    page,
    hasMore: page * 10 < total,
    items: comments,
  });
});

module.exports = router;
