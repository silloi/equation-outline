import dbConnect from '../../../utils/dbConnect'
import Post from '../../../models/post'

export default async function handler(req, res) {
  const { method } = req

  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        const params = {};

        if (req.query.projectId) {
          params['project'] = req.query.projectId
        }

        const posts = await Post.find(params) /* find all the data in our database */
        res.status(200).json({ success: true, data: posts })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    case 'POST':
      try {
        const post = await Post.create(
          req.body
        ) /* create a new model in the database */
        res.status(201).json({ success: true, data: post })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}
