import Head from 'next/head'
import React, { useState, useEffect } from 'react'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

import { connectToDatabase } from '../util/mongodb'

interface Item {
  ref1: number
  ref2: number
  eq: string
}

type Props = {
  itemList: Item[];
}

const Line = (props: Props) => {
  const { itemList } = props

  const refEq = (item: Item) => {
    let str = ''
    str += '('
    str += item.ref1
    if (item.ref2) str += '. ' + item.ref2
    str += ')'
    return str
  }

  return (
    <ul>
      {itemList.map(item => <List key={`${item.ref1}-${item.ref2}`}>
        <ListItem>
          <BlockMath math={`${refEq(item)} ${item.eq}`} />
        </ListItem>
      </List>)}
    </ul>
  );
}

export const Home = ({ isConnected }) => {
  const [itemList, setitemList] = useState([])

  useEffect(() => {
    setitemList([])
  }, [])

  const [input, setInput] = useState({ ref1: 1, ref2: 1, eq: '' })

  const [fileBase64, setFileBase64] = useState<any>(null)

  const handleInput = (e: { target: { name: any; value: any; }; }) => {
    switch (e.target.name) {
      case 'eq':
        setInput({
          ref1: input.ref1,
          ref2: input.ref2,
          eq: e.target.value
        });
        break;
      case 'ref1':
        setInput({
          ref1: e.target.value,
          ref2: input.ref2,
          eq: input.eq
        });
        break;
      case 'ref2':
        setInput({
          ref1: input.ref1,
          ref2: e.target.value,
          eq: input.eq
        });
        break;
    }
  }

  const addEquation = (eq: { ref1: number, ref2: number, eq: string }, response?: string) => {
    const eqThis = eq

    if (response) {
      eq.eq = response
    }

    setitemList([...itemList, eqThis])

    setInput({...input, ref2: input.ref2 + 1})
  }

  const convertToBase64 = (file: File) => {
    const fileReader = new FileReader()
    fileReader.onload = (e) => {
      setFileBase64(e.target.result)
    }
    fileReader.readAsDataURL(file);
  }

  const inputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) {
      return
    }

    console.log('ID', process.env.MATHPIX_APP_ID)

    convertToBase64(e.target.files[0])
  }

  const fetchMathpix = async () => {
    const url = 'https://api.mathpix.com/v3/text'

    const payload = {
      src: fileBase64,
      formats: ['text', 'data', 'html'],
        'data_options': {
          'include_asciimath': true,
          'include_latex': true,
      }
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': "application/json",
        'app_id': process.env.MATHPIX_APP_ID,
        'app_key': process.env.MATHPIX_APP_KEY,
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    addEquation(input, data.data[1].value)
  }

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
  
      <main> 
        {isConnected ? (
          <h2 className="subtitle">You are connected to MongoDB</h2>
          ) : (
            <h2 className="subtitle">
              You are NOT connected to MongoDB. Check the <code>README.md</code>{' '}
              for instructions.
            </h2>
          )}
        <div style={{ marginTop: 10 }}>
          <TextField id="outlined-basic" name="rfef1" label="Input ref1" type="number" variant="outlined" value={input.ref1} onChange={handleInput} />
          <TextField id="outlined-basic" name="ref2" label="Input ref2" type="number"variant="outlined" value={input.ref2} onChange={handleInput} />
          <TextField id="outlined-basic" name="eq" label="Input equation" variant="outlined" value={input.eq} onChange={handleInput} />
          <Button variant="contained" onClick={() => addEquation(input)}>Insert</Button>
          <Button component="label">
            Input File
            <input type="file" onChange={inputFile} style={{opacity: 0, appearance: 'none', position: 'absolute' }} />
          </Button>
          <Button variant="contained" onClick={() => fetchMathpix()}>Ajax</Button>
        </div>
        <Line itemList={itemList}/>
      </main>
    </div>
  )
}

export async function getStaticProps() {
  const { client } = await connectToDatabase()

  const isConnected = await client.isConnected()

  return {
    props: { isConnected },
  }
}

export default Home
