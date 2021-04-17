import Head from 'next/head'
import Link from 'next/link'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'

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

export const Home = ({ projectsData }) => {
  return (
    <div className="container">
      <Head>
        <title>Projects</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Projects</h1>
        <LineProjects itemList={projectsData} />
      </main>
    </div>
  )
}

// Propsのデフォルト値
Home.defaultProps = {
  isConnected: false,
  usersData: [],
}

export async function getStaticProps() {
  const responseUsers = await fetch('http://localhost:3000/api/users')
  const users = await responseUsers.json()

  const responseProjects = await fetch('http://localhost:3000/api/projects')
  const projects = await responseProjects.json()

  return {
    props: {
      usersData: users.data,
      projectsData: projects.data,
    },
  }
}

export default Home
