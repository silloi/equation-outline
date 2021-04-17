import Head from 'next/head'
import Link from 'next/link'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import FormProject from '../../components/FormProject'
import dbConnect from '../../utils/dbConnect'
import User from '../../models/user'
import Project from '../../models/project'

interface Project {
  _id: string;
  name: string;
}

type Props = {
  itemList: Project[]
}

const LineProjects = (props: Props) => {
  const { itemList } = props

  return (
    <ul>
      {itemList.map((item) => (
        <List key={item._id}>
          <ListItem>
            <Link href={`/projects/${item._id}`}>
              <a>{item.name}</a>
            </Link>
          </ListItem>
        </List>
      ))}
    </ul>
  )
}

export const ProjectIndex = ({ projectsData }) => {
  return (
    <div className="container">
      <Head>
        <title>Projects</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Projects</h1>
        <FormProject />
        <LineProjects itemList={projectsData} />
      </main>
    </div>
  )
}

// Propsのデフォルト値
ProjectIndex.defaultProps = {
  projectsData: []
}

export async function getStaticProps() {
  await dbConnect()

  /* find all the data in our database */
  const resultUsers = await User.find({})
  const users = resultUsers.map((doc) => {
    const user = doc.toObject()
    user._id = user._id.toString()
    return user
  })

  const resultProjects = await Project.find({})
  const projects = resultProjects.map((doc) => {
    const project = doc.toObject()
    project._id = project._id.toString()
    return project
  })

  return { props: {
    usersData: users,
    projectsData: projects,
    }
  }
}

export default ProjectIndex
