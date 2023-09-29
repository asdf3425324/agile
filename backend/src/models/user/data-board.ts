const DATASET = {
  tasks: {
    "task-1": { id: "task-1", content: "Полить цветы" },
    "task-2": { id: "task-2", content: "Купить молоко" },
    "task-3": { id: "task-3", content: "Выполнить госплан" },
    "task-4": { id: "task-4", content: "Выиграть в лотерею" },
    "task-5": { id: "task-5", content: "Слетать на марс" },
  },
  cards: {
    "card-1": {
      id: "card-1",
      title: "Туду",
      taskIds: ["task-1", "task-2"]
    },
    "card-2": {
      id: "card-2",
      title: "В работе",
      taskIds: ["task-3"]
    },
    "card-3": { id: "card-3", title: "Фан", taskIds: ["task-4"] },
    "card-4": { id: "card-4", title: "Готово", taskIds: ["task-5"] }
  },
  cardOrder: ["card-1", "card-2", "card-3", "card-4"]
}
const boards = [
  {id: '111', title: 'Доска 1', DATASET: DATASET},
  {id: '122', title: 'Доска 2', DATASET: DATASET},
  {id: '133', title: 'Доска 3', DATASET: DATASET}
]

export default boards