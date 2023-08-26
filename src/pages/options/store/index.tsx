import { useReducer } from 'react'

export enum ActionType {
  UPDATE_GROUP_LIST = 'UPDATE_GROUP_LIST'
}

const reducer = (state, action: { type: ActionType, payload: any }) => {
  if (action.type === ActionType.UPDATE_GROUP_LIST) {
    state = {
      ...state,
      ...action.payload
    }
    return state;
  }

}
const useStore = () => {
  const [state, dispatch] = useReducer(reducer, { groupList: [] })
  return [state, dispatch]
}

export {
  useStore
}