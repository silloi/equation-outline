import Head from 'next/head'
import React, { useState, useEffect } from 'react'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

interface Formula {
  ref1: number
  ref2: number
  eq: string
}

type Props = {
  formulae: Formula[];
}

const Line = (props: Props) => {
  const { formulae } = props

  const refEq = (formula: Formula) => {
    let str = ''
    str += '('
    str += formula.ref1
    if (formula.ref2) str += '. ' + formula.ref2
    str += ')'
    return str
  }

  return (
    <ul>
      {formulae.map(formula => <List key={formula.eq}>
        <ListItem>
          <BlockMath math={`${refEq(formula)} ${formula.eq}`} />
        </ListItem>
      </List>)}
    </ul>
  );
}

export const Home = () => {
  const [formulae, setFormulae] = useState([])

  useEffect(() => {
    setFormulae([])
  }, [])

  const [input, setInput] = useState({ ref1: null, ref2: null, eq: '' })

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
      default:
        console.log('key not found');
    }
  }

  const addEquation = (eq: { ref1: number, ref2: number, eq: string }) => {
    setFormulae([...formulae, eq])

    setInput({...input, ref2: input.ref2 + 1})
  }

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
  
      <main> 
        <div style={{ marginTop: 10 }}>
          <TextField id="outlined-basic" name="ref1" label="Input ref1" type="number" variant="outlined" value={input.ref1} onChange={handleInput} />
          <TextField id="outlined-basic" name="ref2" label="Input ref2" type="number"variant="outlined" value={input.ref2} onChange={handleInput} />
          <TextField id="outlined-basic" name="eq" label="Input equation" variant="outlined" value={input.eq} onChange={handleInput} />
          <Button variant="contained" onClick={() => addEquation(input)}>Insert</Button>
        </div>
        <Line formulae={formulae}/>
      </main>
    </div>
  )
}

export default Home
