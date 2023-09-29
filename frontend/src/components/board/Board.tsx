import { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import styled from "styled-components"
import { updateBoard } from "../../features/userSlice"

const AddButton = styled.div`
  background: #eaeaea;
  color: #333;
  font-size: 13px;
  border-radius: 3px;
  width: 170px;
  padding: 3px 5px;
  cursor: pointer;
`
const Title2 = styled.div`
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 0.5rem;
`

const ITEM_TYPES = {
  CARD: "card",
  TASK: "task"
};
function genRandomID() { return (Math.random() + 1).toString(36).substring(7) }


/*
const [val, setVal] = useState(props.value);
  return (
    <Input
      type="text"
      autoFocus
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onKeyPress={(event) => {
        if (event.key === "Enter" || event.key === "Escape") {
          console.log('wokr?')
          props.onSave(val);
          event.preventDefault();
          event.stopPropagation();
        }
      }}
      onBlur={() => props.onSave(val)}
    />
  );
*/
const Board = () => {
  const board: any = useSelector((state: any) => state.userSlice.board)
  const dispatch = useDispatch()

  const [tasks, setTasks] = useState({})
  const [cards, setCards] = useState({})
  const [cardOrder, setCardOrder] = useState([])

  // title
  const [editing, setEditing]: any = useState(false);
  const [val, setVal]: any = useState('')

  const onAddNewCard = () => {
    const newCard: any = {
      id: "card-" + genRandomID(),
      title: "**New**",
      taskIds: []
    };
    const newCardOrder: any = Array.from(cardOrder);
    newCardOrder.unshift(newCard.id);
    let v = {
      ...cards,
      [newCard.id]: newCard
    }
    const arr = JSON.parse(JSON.stringify(board))
    arr.DATASET.cardOrder = newCardOrder
    arr.DATASET.cards = v
    dispatch(updateBoard(arr))
  }

  useEffect(() => {
    if (board.DATASET != undefined) {
      setTasks(board.DATASET.tasks)
      setCards(board.DATASET.cards)
      setCardOrder(board.DATASET.cardOrder)
    }
  })

  const onTitleDoubleClick = (title: any) => {
    setEditing(!editing)
    setVal(title)
  }
  const titleUpdate = (val) => {
    const arr = JSON.parse(JSON.stringify(board))
    arr.title = val
    dispatch(updateBoard(arr))
    setEditing(!editing)
  }
  return (
    <div>
      {editing ? (
        <div>
          <input
            type="text"
            autoFocus
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyPress={(event) => {
              if (event.key === "Enter" || event.key === "Escape") {
                titleUpdate(val);
                event.preventDefault();
                event.stopPropagation();
              }
            }}
            onBlur={() => titleUpdate(val)}
           />
        </div>
      ) : (
        <Title2 onDoubleClick={() => onTitleDoubleClick(board.title)}>{board.title}</Title2>
      )}
      <AddButton onClick={onAddNewCard}>Добавить новую колонку</AddButton>
      <DragDropCards
        cards={cards}
        tasks={tasks}
        cardOrder={cardOrder}
      />
    </div>
  )
}

const CardsContainer = styled.div`
  margin: 1em 0;
  display: flex;
  // @media (max-width: 720px) {
  //   flex-direction: column;
  // }
`;
function DragDropCards({
  cards,
  tasks,
  cardOrder,
  // setCards,
  // setTasks,
  // setCardOrder
}) {
  const board: any = useSelector((state: any) => state.userSlice.board)
  const dispatch = useDispatch()
  const [editing, setEditing] = useState(null);
  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    if (type === ITEM_TYPES.CARD) {
      reorderCards(source, destination, draggableId);
    } else {
      // type === tasks
      const start = cards[source.droppableId];
      const finish = cards[destination.droppableId];
      if (start.id === finish.id) {
        reorderTasksWithinCard(
          start,
          source.index,
          destination.index,
          draggableId
        );
      } else {
        moveTask(start, finish, source.index, destination.index, draggableId);
      }
    }
  };

  const reorderCards = (source, destination, draggableId) => {
    const newCardOrder = Array.from(cardOrder);
    newCardOrder.splice(source.index, 1);
    newCardOrder.splice(destination.index, 0, draggableId);

    const arr = JSON.parse(JSON.stringify(board))
    arr.DATASET.cardOrder = newCardOrder
    dispatch(updateBoard(arr))
    // setCardOrder(newCardOrder);
  };

  const reorderTasksWithinCard = (
    card,
    sourceIdx,
    destinationIdx,
    draggableId
  ) => {
    const newTaskIds = Array.from(card.taskIds);
    newTaskIds.splice(sourceIdx, 1);
    newTaskIds.splice(destinationIdx, 0, draggableId);
    let v = {
      ...cards,
      [card.id]: {
        ...card,
        taskIds: newTaskIds
      }
    }
    const arr = JSON.parse(JSON.stringify(board))
    arr.DATASET.cards = v
    dispatch(updateBoard(arr))
  };

  const moveTask = (start, finish, sourceIdx, destinationIdx, draggableId) => {
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(sourceIdx, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds
    };
    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destinationIdx, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds
    };
    let v = {
      ...cards,
      [newStart.id]: newStart,
      [newFinish.id]: newFinish
    }
    const arr = JSON.parse(JSON.stringify(board))
    arr.DATASET.cards = v
    dispatch(updateBoard(arr))
  };

  const onAddNewTask = (cardID, content) => {
    const newTask = {
      id: "task-" + genRandomID(),
      content
    };
    let t = {
      ...tasks,
      [newTask.id]: newTask
    }

    const newTaskIds = Array.from(cards[cardID].taskIds);
    newTaskIds.push(newTask.id);
    const arr = JSON.parse(JSON.stringify(board))

    arr.DATASET.tasks= t
    arr.DATASET.cards = { ...cards, [cardID]: { ...cards[cardID], taskIds: newTaskIds } }

    dispatch(updateBoard(arr))
  }

  const onRemoveTask = (cardID, taskID) => {
    console.log(taskID, cardID)
    // console.log(cards)
    const newTaskIds = cards[cardID].taskIds.filter((id) => id !== taskID);

    const arr = JSON.parse(JSON.stringify(board))
    arr.DATASET.cards = { ...cards, [cardID]: { ...cards[cardID], taskIds: newTaskIds } }
    // setCards({ ...cards, [cardID]: { ...cards[cardID], taskIds: newTaskIds } });
    delete arr.DATASET.tasks[taskID];
    dispatch(updateBoard(arr))
  };

  const onRemoveCard = (cardID) => {
    console.log(cardID)
    const newCardOrder = cardOrder.filter((id) => id !== cardID);
    const arr = JSON.parse(JSON.stringify(board))
    arr.DATASET.cardOrder = newCardOrder

    const cardTaskIds = arr.DATASET.cards[cardID].taskIds;
    cardTaskIds.forEach((taskID) => delete arr.DATASET.tasks[taskID]);
    delete arr.DATASET.cards[cardID];
    // setCards(cards);
    // setTasks(tasks);

    dispatch(updateBoard(arr))
  };
  const onSaveTitleEdit = (cardID, newTitle) => {
    if (newTitle !== cards[cardID].title) {
      let v = {
        ...cards,
        [cardID]: {
          ...cards[cardID],
          title: newTitle
        }
      }
      const arr = JSON.parse(JSON.stringify(board))
      arr.DATASET.cards= v
      dispatch(updateBoard(arr))
    }
    setEditing(null);
  };

  const onSaveTaskEdit = (taskID, cardID, newContent) => {
    if (newContent.trim() === "") {
      onRemoveTask(taskID, cardID);
    } else if (newContent !== tasks[taskID].content) {
      const arr = JSON.parse(JSON.stringify(board))
      let v ={
        ...tasks,
        [taskID]: { ...tasks[taskID], content: newContent }
      }
      arr.DATASET.tasks= v
      dispatch(updateBoard(arr))
    }
    setEditing(null);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="all-cards" direction="horizontal" type="card">
        {(provided) => (
          <CardsContainer {...provided.droppableProps} ref={provided.innerRef}>
            {cardOrder != undefined ? cardOrder.map((id, index) => {
              const card = cards[id];
              const cardTasks = card.taskIds.map((taskId) => tasks[taskId]);
              return (
                <Card
                  key={card.id}
                  card={card}
                  tasks={cardTasks}
                  index={index}
                  onAddNewTask={(content) => onAddNewTask(card.id, content)}
                  onRemoveTask={(taskid) => onRemoveTask(card.id, taskid)}
                  onRemoveCard={() => onRemoveCard(card.id)}
                  onSaveTitleEdit={(title) => onSaveTitleEdit(card.id, title)}

                  onSaveTaskEdit={(taskID, newContent) =>
                    onSaveTaskEdit(taskID, card.id, newContent)
                  }
                  onTitleDoubleClick={() => setEditing(card.id)}
                  onTaskDoubleClick={(task) => setEditing(task.id)}
                  isTitleEditing={editing === card.id}
                  isTaskEditing={(task) => editing === task.id}
                />
              )
            }) : 'loding...'}
            {provided.placeholder}
          </CardsContainer>
        )}
      </Droppable>
    </DragDropContext>
  )
}

const TitleBar = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Title = styled.h3`
  padding: 8px;
  font-size: 1.5em;
  text-overflow: ellipsis;
`;
const Cross = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  text-align: right;
  color: grey;
`;
const CardContainer = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 4px;
  width: 220px;
  display: flex;
  flex-direction: column;
  background-color: lightgrey;
`;
const TaskList = styled.div`
  padding: 8px;
  min-height: 100px;
  height: 100%;
`;
const NewTaskButton = styled.div`
  cursor: pointer;
  color: grey;
  background: #eaeaea;
  width: 150px;
  border-radius: 3px;
  margin: 1rem;
  font-size: 14px;
  padding: 2px 4px;
`;
function Card(props) {
  const [isAddingNewTask, setIsAddingNewTask] = useState(false);
  const onSaveTask = (content) => {
    if (content.trim() !== "") {
      props.onAddNewTask(content);
    }
    setIsAddingNewTask(false);
  };
  return (
    <Draggable draggableId={props.card.id} index={props.index}>
      {(provided) => (
        <CardContainer
          ref={provided.innerRef}
          {...provided.draggableProps}
          id={props.card.id}
        >
          {/* <div
            {...provided.dragHandleProps}
          >
            {props.card.title}
            <span onClick={props.onRemoveCard}>x</span>
          </div> */}
          <TitleBar>
            {props.isTitleEditing ? (
              <EditInput
                key={props.card.id}
                value={props.card.title}
                onSave={props.onSaveTitleEdit}
                fontSize="1.5em"
                margin="20px 0 20px 8px"
              />
            ) : (
              <Title
                onDoubleClick={props.onTitleDoubleClick}
                {...provided.dragHandleProps}
              >
                {props.card.title}
              </Title>
            )}
            <Cross onClick={props.onRemoveCard}>x</Cross>
          </TitleBar>
          <Droppable droppableId={props.card.id} type="task">
            {(provided, snapshot) => (
              <Fragment>
                 <TaskList
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {props.tasks.map((task, index) => (
                    <Task
                      key={task.id}
                      task={task}
                      index={index}
                      onRemoveTask={props.onRemoveTask}

                      onSaveTaskEdit={(content) =>
                        props.onSaveTaskEdit(task.id, content)
                      }
                      onTaskDoubleClick={() => props.onTaskDoubleClick(task)}
                      isTaskEditing={props.isTaskEditing(task)}
                    />
                  ))}
                </TaskList>
                {provided.placeholder}
              </Fragment>
            )}
          </Droppable>
          <div>{isAddingNewTask ? (
            <EditInput
              key="newtask"
              value=""
              onSave={onSaveTask}
              margin="8px"
            />
          ) : (
            <NewTaskButton onClick={() => setIsAddingNewTask(true)}>
              Добавить карточку
          </NewTaskButton>
          )}</div>
        </CardContainer>
      )}
    </Draggable>
  )
}

const Input = styled.input`
  font-family: inherit;
  padding: 8px;
  width: 100%;
`;
function EditInput(props) {
  const [val, setVal] = useState(props.value);
  return (
    <Input
      type="text"
      autoFocus
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onKeyPress={(event) => {
        if (event.key === "Enter" || event.key === "Escape") {
          console.log('wokr?')
          props.onSave(val);
          event.preventDefault();
          event.stopPropagation();
        }
      }}
      onBlur={() => props.onSave(val)}
    />
  );
}

const TaskContainer = styled.div`
  display: flex;
`;
const TaskContent = styled.div`
  display: flex;
  border: 1px solid lightgrey;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 2px;
  width: 100%;
  background: #eaeaea;
`;
const Delete1 = styled.div`
  font-size: 13px;
  margin-left: 5px;
  margin-top: 2px;
`

function Task(props: any) {
  const click = (id) => {
    props.onRemoveTask(id)
  }
  return (
    <TaskContainer>
      {props.isTaskEditing ? (
        <EditInput
          key={props.task.id}
          value={props.task.content}
          onSave={props.onSaveTaskEdit}
          margin="0 0 8px 0"
        />
      ) : (
        <Draggable draggableId={props.task.id} index={props.index}>
          {(provided, snapshot) => (
            <TaskContent
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
              onDoubleClick={props.onTaskDoubleClick}
            >
              {props.task.content}
              <Delete1 onClick={() => click(props.task.id)}>x</Delete1>
            </TaskContent>
          )}
        </Draggable>
      )}
      {/* <Draggable draggableId={props.task.id} index={props.index}>
        {(provided, snapshot) => (
          <TaskContent
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            // isDragging={snapshot.isDragging}
            // onDoubleClick={props.onTaskDoubleClick}
          >
            {props.task.content}
            <div onClick={() => click(props.task.id)}>x</div>
          </TaskContent>
        )}
      </Draggable> */}
    </TaskContainer>
  )
}

export default Board