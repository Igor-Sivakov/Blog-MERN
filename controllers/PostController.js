import PostModel from '../models/Post.js'

export const getLastTegs = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec()
    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5)

    res.json(tags)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'failed to retrieve tags',
    })
  }
}

export const getComments = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate('comments.user')
      .limit(8)
      .exec()
    const comments = posts
      .map((obj) => {
        if (obj.comments.length) {
          return obj.comments
        }
        return
      })
      .flat()
    const actulalComments = comments.filter((comment) =>
      comment !== null ? comment : ''
    )

    res.json(actulalComments)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'failed to retrieve comments',
    })
  }
}

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate('user')
      .populate('comments.user')
      .exec()

    res.json(posts)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'failed to retrieve articles',
    })
  }
}

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
      (err, doc) => {
        if (err) {
          console.log(err)
          return res.status(500).json({
            message: 'failed to retrieve article',
          })
        }
        if (!doc) {
          return res.status(404).json({
            message: 'article not found',
          })
        }
        res.json(doc)
      }
    )
      .populate('user')
      .populate('comments.user')
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'failed to retrieve article',
    })
  }
}

export const remove = async (req, res) => {
  try {
    const postId = req.params.id

    PostModel.findByIdAndRemove(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(error)
          return res.status(500).json({
            message: 'failed to remove article',
          })
        }
        if (!doc) {
          return res.status(404).json({
            message: 'article not found',
          })
        }
        res.json({
          success: true,
        })
      }
    )
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'failed to remove article',
    })
  }
}

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags?.split(','),
      user: req.userId,
    })

    const post = await doc.save()
    res.json(post)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'failed to create article',
    })
  }
}

export const update = async (req, res) => {
  try {
    const postId = req.params.id

    const doc = await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags?.split(','),
      }
    )

    res.json({
      success: true,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'failed to update article',
    })
  }
}

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id

    const doc = await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        $push: {
          comments: {
            user: req.userId,
            text: req.body.comments.text,
            createdAt: Date.now(),
          },
        },
      }
    )

    res.json({
      success: true,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'failed to add comment',
    })
  }
}

export const findByDate = async (req, res) => {
  try {
    const postsByDate = await PostModel.find()
      .populate('user')
      .populate('comments.user')
      .sort({ createdAt: -1 })
      .clone()

    res.json(postsByDate)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'failed to find articles',
    })
  }
}

export const findByViews = async (req, res) => {
  try {
    const postsByViews = await PostModel.find()
      .populate('user')
      .populate('comments.user')
      .sort({ viewsCount: -1 })
      .clone()

    res.json(postsByViews)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'failed to find articles',
    })
  }
}
