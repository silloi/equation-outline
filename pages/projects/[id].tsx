import Head from 'next/head'
import React, { useState, useEffect } from 'react'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import Line from '../../components/Line'

export const Home = ({ usersData, projectData, postsData }) => {
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

    // eslint-disable-next-line no-console
    console.log('ID', process.env.MATHPIX_APP_ID)

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
        app_id: process.env.MATHPIX_APP_ID,
        app_key: process.env.MATHPIX_APP_KEY,
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
          <Button variant="contained" onClick={async () => await addEquation(input)}>
            Insert
          </Button>
          <br/>
          <Button component="label">
            Input File
            <input
              type="file"
              onChange={inputFile}
              style={{ opacity: 0, appearance: 'none', position: 'absolute' }}
            />
          </Button>
          <br/>
          <Button variant="contained" onClick={() => fetchMathpix()}>
            Ajax
          </Button>
        </div>
        <Line itemList={itemList} />
      </main>
    </div>
  )
}

// Propsのデフォルト値
Home.defaultProps = {
  isConnected: false,
  usersData: [],
}

// 最初に実行される。事前ビルドするパスを配列でreturnする。
export async function getStaticPaths() {
  const res = await fetch('http://localhost:3000/api/projects')
  const projects = await res.json()
  // レポジトリの名前をパスとする
  const paths = projects.data.map(project => `/projects/${project._id}`)
  // 事前ビルドしたいパスをpathsとして渡す fallbackについては後述
  return { paths, fallback: false }
}

export async function getStaticProps(context) {
  const projectId = context.params.id

  const responseUsers = await fetch('http://localhost:3000/api/users')
  const users = await responseUsers.json()

  const responseProject = await fetch(`http://localhost:3000/api/projects/${projectId}`)
  const project = await responseProject.json()

  const responsePosts = await fetch(`http://localhost:3000/api/posts?projectId=${projectId}`)
  const posts = await responsePosts.json()

  return {
    props: {
      usersData: users.data,
      projectData: project.data,
      postsData: posts.data,
    },
  }
}

export default Home
