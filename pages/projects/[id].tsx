import Head from 'next/head'
import React, { useState, useEffect } from 'react'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import Line from '../../components/Line'
import dbConnect from '../../utils/dbConnect'
import Project from '../../models/project'
import User from '../../models/user'
import Post from '../../models/post'

export const ProjectPage = ({ usersData, projectData, postsData }) => {
  const [itemList, setitemList] = useState([])

  useEffect(() => {
    setitemList(postsData)
  }, [])

  const [input, setInput] = useState({ section: 1, line: 1, equation: '' })

  const [fileBase64, setFileBase64] = useState<any>(null)

  const handleInput = (e: { target: { name: any; value: any } }) => {
    switch (e.target.name) {
      case 'equation':
        setInput({
          section: input.section,
          line: input.line,
          equation: e.target.value,
        })
        break
      case 'section':
        setInput({
          section: e.target.value,
          line: input.line,
          equation: input.equation,
        })
        break
      case 'line':
        setInput({
          section: input.section,
          line: e.target.value,
          equation: input.equation,
        })
        break
    }
  }

  /* The POST method adds a new entry in the mongodb database. */
  const postData = async (payload: any) => {
    const contentType = 'application/json'

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          Accept: contentType,
          'Content-Type': contentType,
        },
        body: JSON.stringify(payload),
      })

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status.toString())
      }

      // router.push('/')
    } catch (error) {
      // setMessage('Failed to add pet')
    }
  }

  const addEquation = async (
    equation: { section: number; line: number; equation: string },
    response?: string
  ) => {
    const eqThis = equation

    if (response) {
      equation.equation = response
    }

    // post
    await postData({
      equation: equation.equation,
      section: equation.section,
      line: equation.line,
      user: usersData[0]._id,
      project: projectData._id,
    })

    setitemList([...itemList, eqThis])

    setInput({ ...input, line: parseInt(input.line.toString()) + 1 })
  }

  const convertToBase64 = (file: File) => {
    const fileReader = new FileReader()
    fileReader.onload = (e) => {
      setFileBase64(e.target.result)
    }
    fileReader.readAsDataURL(file)
  }

  const inputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) {
      return
    }

    convertToBase64(e.target.files[0])
  }

  const fetchMathpix = async () => {
    const url = 'https://api.mathpix.com/v3/text'

    const payload = {
      src: fileBase64,
      formats: ['text', 'data', 'html'],
      data_options: {
        include_asciimath: true,
        include_latex: true,
      },
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        app_id: process.env.NEXT_PUBLIC_MATHPIX_APP_ID,
        app_key: process.env.NEXT_PUBLIC_MATHPIX_APP_KEY,
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    await addEquation(input, data.data[1].value)
  }

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <p>{usersData[0].name}</p>
        <div style={{ marginTop: 10 }}>
          <TextField
            id="outlined-basic"
            name="rfef1"
            label="Input section"
            type="number"
            variant="outlined"
            value={input.section}
            onChange={handleInput}
          />
          <TextField
            id="outlined-basic"
            name="line"
            label="Input line"
            type="number"
            variant="outlined"
            value={input.line}
            onChange={handleInput}
          />
          <TextField
            id="outlined-basic"
            name="equation"
            label="Input equation"
            variant="outlined"
            value={input.equation}
            onChange={handleInput}
          />
          <Button variant="contained" style={{marginLeft: 10}} onClick={async () => await addEquation(input)}>
            Insert
          </Button>
          {fileBase64 ? <Button variant="contained" style={{marginLeft: 10}} onClick={() => fetchMathpix()}>
            Ajax
          </Button> : null}
          <br/>
          <Button component="label" style={{marginLeft: 10}}>
            <label htmlFor="file">
              Input File
            </label>
            <input
              id="file"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={inputFile}
              style={{ opacity: 0, appearance: 'none', position: 'absolute' }}
            />
          </Button>
        </div>
        <Line itemList={itemList} />
      </main>
    </div>
  )
}

// 最初に実行される。事前ビルドするパスを配列でreturnする。
export async function getStaticPaths() {
  await dbConnect()

  /* find all the data in our database */
  const result = await Project.find({})
  // レポジトリの名前をパスとする
  const paths = result.map((doc) => {
    const project = doc.toObject()
    project._id = project._id.toString()
    return `/projects/${project._id}`
  })

  // 事前ビルドしたいパスをpathsとして渡す fallbackについては後述  
  return { paths, fallback: false }
}

// Propsのデフォルト値
ProjectPage.defaultProps = {
  usersData: [],
  projectData: null,
  postsData: [],
}

export async function getStaticProps({ params }) {
  await dbConnect()

  /* find all the data in our database */
  const resultUsers = await User.find({})
  const users = resultUsers.map((doc) => {
    const user = doc.toObject()
    user._id = user._id.toString()
    return user
  })

  const project = await Project.findById(params.id).lean()
  project._id = project._id.toString()

  const resultPosts = await Post.find({ project: params.id })
  const posts = resultPosts.map((doc) => {
    const post = doc.toObject()
    post._id = post._id.toString()
    post.user = post.user.toString()
    post.project = post.project.toString()
    return post
  })

  return {
    revalidate: 1,
    props: {
      usersData: users,
      projectData: project,
      postsData: posts,
    }
  }
}

export default ProjectPage
