import React, { useState } from "react";

type Cell = {
  id: number,
};

const useMousePosition = () => {
  const [
    mousePosition,
    setMousePosition
  ] = React.useState<{x: number, y: number}>({ x: 0, y: 0 });

  React.useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return mousePosition;
};

const useMouseState = (onMouseDown: Function = ()=>{}, onMouseUp: Function = ()=>{}) => {
  const [
    mouseDown,
    setMouseDown
  ] = React.useState<boolean>(false);

  React.useEffect(() => {
    const updateMouseDown = (ev: MouseEvent) => {
      setMouseDown(true);

      if (onMouseDown) {
        onMouseDown();
      }
    }

    const updateMouseUp = (ev: MouseEvent) => {
      setMouseDown(false);

      if (onMouseUp) {
        onMouseUp();
      }
    }

    window.addEventListener('mousedown', updateMouseDown);
    window.addEventListener('mouseup', updateMouseUp);

    return () => {
      window.removeEventListener('mousedown', updateMouseDown);
      window.removeEventListener('mouseup', updateMouseUp);
    };
  }, []);

  return mouseDown;
}

const App = () => {
  let numberOfRows = 5;
  let numberOfColumns = 5;
  let [mouseDownCell, setMouseDownCell] = useState<boolean>(false);
  let [selected, setSelected] = useState<number[]>([]);
  let [grid, setGrid] = useState<Cell[][]>([]);

  const onMouseUp = () => {
    setMouseDownCell(false);
  }

  const mousePosition = useMousePosition();
  const mouseDown = useMouseState(() => {}, onMouseUp);

  const handleClick = (i: number, j: number) => {
    setSelected([i, j]);
    setMouseDownCell(true);
  };

  const swap = (i1: number, j1: number, i2: number, j2: number) => {
    if (i1 < 0 || i2 < 0 || j1 < 0 || j2 < 0) {
      return;
    }

    let newGrid = [...grid];
    let temp = newGrid[i1][j1];
    newGrid[i1][j1] = newGrid[i2][j2];
    newGrid[i2][j2] = temp;
    setGrid(newGrid);
    setSelected([i2, j2])
    setMouseDownCell(false);
  }

  if (grid.length === 0) {
    const newGrid = [];
    for (let i = 0; i < numberOfRows; i++) {
      let row: Cell[] = [];

      for (let j = 0; j < numberOfColumns; j++) {
        const cell: Cell = { id: i * numberOfColumns + j };
        row.push(cell);
      }

      newGrid.push(row);
    }

    setGrid(newGrid);
  }

  let gridContent = grid.map((row, i) => {
    return (
      <div key={i} style={{ display: "flex" }}>
        {row.map((cell, j) => {
          const isSelected = selected[0] === i && selected[1] === j
          let selectedClass =  isSelected ? "selected" : "";
          return (
            <div
              key={cell.id}
              className={"cell prevent-select " + selectedClass}
              onMouseDown={() => handleClick(i, j)}
              onMouseUp={() => swap(selected[0], selected[1], i, j)}
            >{cell.id}</div>
          );
        })}
      </div>
    );
  });



  return (
  <div>
    {gridContent}
    { mouseDownCell && mouseDown ? 
     <div 
      className="cell selected dummy-cell"
      style={{position: "absolute", top: mousePosition.y - 50, left: mousePosition.x - 50}}>
        {grid[selected[0]][selected[1]].id}
    </div> : <></> }
  </div>
  );
}

export default App;