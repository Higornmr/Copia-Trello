import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Droppable } from "react-beautiful-dnd";
import { DragDropContext } from "react-beautiful-dnd";

import "./App.css";

import { v4 as uuidv4 } from "uuid";

function App() {
  
  const [inicialItems, setInicialItems] = useState([{ id: uuidv4(), content: "Nada" }, ]);
  const [content, setContent] = useState('');

  console.log(content)

  const inicialColumns = [
    {
      name: "To do",
      id: uuidv4(),
      items: inicialItems,
    },
    {
      name: "Doing",
      id: uuidv4(),
      items: [],
    },
    {
      name: "Done",
      id: uuidv4(),
      items: [],
    },  
  ];
  
  function newTask(event) {
    setContent(event.target.value);
  }

  function clickButton() {
    setInicialItems([ ...inicialItems, {id: uuidv4(), content}])
  }

  const [columns, setColumns] = useState(inicialColumns);

  const onDragEnd = (result) => {
    console.log(result);
   // var sourceColumnItems = columns[0].items;
    var sourceColumnItems = [];
    var destinationColumnItems = [];
    var draggedItem = {};

    var sourceColumnId = 0;
    var destinationColumnId = 0;

    for (var i in columns) {
      if (columns[i].id == result.source.droppableId) {
        sourceColumnItems = columns[i].items;
        sourceColumnId = i;
      } else if (columns[i].id == result.destination.droppableId) {
        destinationColumnItems = columns[i].items;
        destinationColumnId = i;
      }
    }

    for (var i in sourceColumnItems) {
      if (sourceColumnItems[i].id == result.draggableId) {
        draggedItem = sourceColumnItems[i];
      }
    }

    //Excluir o objeto arrastado.
    var filteredSourceColumnItems = sourceColumnItems.filter(
      (item) => item.id != result.draggableId
    );

    // Adicionar o mesmo na nova posição.
    if (result.source.droppableId == result.destination.droppableId) {
      filteredSourceColumnItems.splice(
        result.destination.index,
        0,
        draggedItem
      );

      // Mudar o state
      var columnsCopy = JSON.parse(JSON.stringify(columns));
      columnsCopy[sourceColumnId].items = filteredSourceColumnItems;
      setColumns(columnsCopy);
    } else {
      destinationColumnItems.splice(result.destination.index, 0, draggedItem);
      // Mudar o state
      var columnsCopy = JSON.parse(JSON.stringify(columns));
      columnsCopy[sourceColumnId].items = filteredSourceColumnItems;
      columnsCopy[destinationColumnId].items = destinationColumnItems;
      setColumns(columnsCopy);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "30px",
          border: "1px solid black",
        }}
      >
        <input onChange={newTask} placeholder="Próxima tarefa"></input>
        <button onClick={clickButton}>Check</button>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <DragDropContext onDragEnd={onDragEnd}>
          {columns.map((columns) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h1>{columns.name}</h1>
              <Droppable droppableId={columns.id} key={columns.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    style={{
                      backgroundColor: "lightblue",
                      width: 250,
                      height: 500,
                      padding: 10,
                      margin: 10,
                    }}
                  >
                    {columns.items.map((item, index) => (
                      <Draggable
                        draggableId={item.id}
                        index={index}
                        key={item.id}
                      >
                        {(provided) => (
                          <ul
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                            style={{
                              backgroundColor: "gray",
                              height: 40,
                              marginBottom: 10,
                              display: "flex",
                              justifyContent: "space-between",
                              ...provided.draggableProps.style,
                            }}
                          >
                            {inicialItems.map((items) => (
                              <li key={items.id}>{items.content}</li>
                            ))}
                            <button  style={{ cursor: "pointer" }}>X</button>
                          </ul>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </DragDropContext>
      </div>
    </>
  );
}

export default App;
