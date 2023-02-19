export type ActionType =
  | { type: 'UPDATE_TYPE'; payload: string }
  | { type: 'UPDATE_SORT'; payload: string }
  | { type: 'UPDATE_SHIP'; payload: string }

export interface QueryState {
  type?: string,
  sort?: string,
  ship?: string
}


export function queryReducer(state: QueryState, action: ActionType): QueryState {
  switch (action.type) {
    case 'UPDATE_TYPE':
      return { ...state, type: action.payload }
    case 'UPDATE_SORT':
      return { ...state, sort: action.payload }
    case 'UPDATE_SHIP':
      return { ...state, ship: action.payload }
  }
}
