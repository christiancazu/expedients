import { useContext } from 'react'
import { ContextNotify } from '../notify'

const useNotify = () => useContext(ContextNotify)

export default useNotify
