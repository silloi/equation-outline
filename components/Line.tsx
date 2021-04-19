import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'

import 'katex/dist/katex.min.css'
import { BlockMath } from 'react-katex'

interface Item {
  section: number
  line: number
  equation: string
}

type Props = {
  itemList: Item[]
}

export const Line = (props: Props) => {
  const { itemList } = props

  const refEq = (item: Item) => {
    let str = ''
    str += '('
    str += item.section
    if (item.line) str += '. ' + item.line
    str += ')'
    return str
  }

  return (
    <ul>
      {itemList.map((item) => (
        <List key={`${item.section}-${item.line}`}>
          <ListItem>
            <BlockMath math={refEq(item)}></BlockMath>
            <span>&nbsp;</span>
            <BlockMath math={item.equation} />
          </ListItem>
        </List>
      ))}
    </ul>
  )
}

export default Line
