import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { loadingBoard } from "../features/userSlice"
import Board from '../components/board/Board'
import styled from 'styled-components';

const AddButton = styled.div`
  background: #eaeaea;
  color: #333;
  font-size: 13px;
  border-radius: 3px;
  width: 170px;
  padding: 3px 5px;
  cursor: pointer;
`

const BoardVeiw = () => {
  const location = useLocation();
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const board: any = useSelector((state: any) => state.userSlice.board)
  useEffect(() => {
    const str = location.pathname.slice(3)
    dispatch(loadingBoard(str))
  }, [loadingBoard])
  const click = () => {
    navigate('/dashboard')
  }
  return (
    <div>
      {board != undefined ? <Board /> : 'loading...'}
      <AddButton onClick={click}>вернуться к выбору доски</AddButton>
    </div>
  )
}

export default BoardVeiw