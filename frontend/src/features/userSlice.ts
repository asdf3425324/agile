import { createSlice,createSelector,PayloadAction,createAsyncThunk, createEntityAdapter} from "@reduxjs/toolkit"
import axios from "axios"

const initialState: any = {
  boards: [],
  board: {}
}

export const updateBoard: any = (dataset) => async (dispatch) => {
  try {
    dispatch(setBoard(dataset))
    const {data} = await axios.post('/update_board', {
      token: localStorage.getItem('token'),
      DATASET: dataset
    })
  } catch (err: any) {
    throw new Error(err)
  }
}

export const loadingBoard: any = (id) => async (dispatch) => {
  try {
    const {data} = await axios.post('/get_board', {
      token: localStorage.getItem('token'),
      id_board: id
    })
    dispatch(setBoard(data.board))

  } catch (err: any) {
    throw new Error(err)
  }
}

export const addBoard: any = (data) => async (dispatch) => {
  try {
    const {data} = await axios.post('/add_board', {token: localStorage.getItem('token')})
    dispatch(setBoards(JSON.parse(data.boards)))
  } catch (err: any) {
    throw new Error(err)
  }
}

export const updateBoards: any = (dataset) => async (dispatch) => {
  try {
    dispatch(setBoards(dataset))
    const {data} = await axios.post('/update_boards', {
      token: localStorage.getItem('token'),
      DATASET: dataset
    })
  } catch (err: any) {
    throw new Error(err)
  }
}

export const loadingBoards: any = (data) => async (dispatch) => {
  try {
    const {data} = await axios.post('/loading_boards', {token: localStorage.getItem('token')})
    if (data.user === null) {
      localStorage.removeItem('token')
    }

    dispatch(setBoards(JSON.parse(data.boards)))
  } catch (err: any) {
    throw new Error(err)
  }
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setBoards (state, action) {
      state.boards = action.payload
    },
    setBoard (state, action) {
      state.board = action.payload
    },
  }
})

export const { setBoards, setBoard } = userSlice.actions
export default userSlice.reducer
