import { useDispatch, useSelector } from "react-redux"
import { loadingBoards, addBoard, updateBoards } from "../features/userSlice"
import { useEffect } from "react"
import { useNavigate } from "react-router"
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import styled from "styled-components"

const Title = styled.div`
  font-size: 20px;
  font-weight: 500;
`
const First = styled.div`
  display: flex;
  flex-flow: row wrap;
`
const ListBoard = styled.div`
  display: flex;
  padding: 1rem;
  margin: 5px;
  border: 1px solid #eaeaea;
  border-radius: 6px;
  background: #fff;
  font-weight: 300;
  font-size: 14px;
  height: 150px;
  width: 200px;
`;
const ListItem = styled.div`
  margin-left: 10px;
  font-size: 12px;
  background: #eaeaea;
  height: 20px;
  border-radius: 3px;
  padding: 0px 3px;
  padding-top: 1px;
  color: #333;
`

const Flex = styled.div`
  width: auto;
  border-radius: 3px;
  padding: 3px 5px; 
`
const AddButton = styled.div`
  background: #000;
  color: #fff;
  font-size: 13px;
  border-radius: 3px;
  width: 105px;
  padding: 3px 5px;
  cursor: pointer;
`

const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const boards = useSelector((state: any) => state.userSlice.boards)
  useEffect(() => {
    dispatch(loadingBoards())
  }, [loadingBoards])
  const addButton = async () => {
    await dispatch(addBoard())
  }
  const click = (e, index) => {
    navigate(`/b/${index}`)
  }

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
  };
  const onDragEnd= (result) => {
    if (!result.destination) {
      return;
    }

    const items: any = reorder(
      boards,
      result.source.index,
      result.destination.index
    )

    const copy = JSON.parse(JSON.stringify(boards))
    dispatch(updateBoards(items))
    // copyTodo.now = JSON.parse(JSON.stringify(items))
    // dispatch(updateTodo(copyTodo))
  }
  const del = (id) => {
    console.log('delete', id)
    const index = boards.findIndex(item => item.id === id);
    const copy = JSON.parse(JSON.stringify(boards))
    copy.splice(index, 1)
    dispatch(updateBoards(copy))
  }
  return (
    <div>
      <Title>Список досок:</Title>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" >
          {(provided, snapshot) => (
            <First
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {boards != undefined ? boards.map((item, index) => {
                return (
                  // <Draggable  key={item.id} draggableId={item.id} index={index}>
                  <div key={item.id}>
                    {/* {(provided, snapshot) => ( */}
                       <ListBoard
                        // ref={provided.innerRef}
                        // {...provided.draggableProps}
                        // {...provided.dragHandleProps}
                      >
                        <div onClick={(e) => click(e, item.id)}>
                          {item.title}
                        </div>
                        <ListItem  onClick={() => del(item.id)}>удалить </ListItem>
                      </ListBoard>
                    {/* )} */}
                    </div>
                  // </Draggable>
                )
              }) : 'loading...'}
              {/* {provided.placeholder} */}
            </First>
          )}
        </Droppable>
      </DragDropContext>
      <Flex>
        <AddButton onClick={addButton}>Добавить доску</AddButton>
      </Flex>
    </div>
  )
}
export default Dashboard