import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

import 'katex/dist/katex.min.css'
import User from '../models/user'
import dbConnect from '../utils/dbConnect'

export const Home = ({ usersData }) => {

  return (
    <div className="container">
      <Head>
        <title>Equation Outline</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Equation Outline</h1>
        <p>You can only use one user: { usersData ? usersData[0].name : null}.</p>
        <Link href={`/projects`}>
          <a>Projects</a>
        </Link>
      </main>
    </div>
  )
}

// Propsのデフォルト値
Home.defaultProps = {
  usersData: []
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

  return {
    props: {
      usersData: users,
    }
  }
}

export default Home
