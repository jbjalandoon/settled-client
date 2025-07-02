import { Fragment } from "react/jsx-runtime";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ConnectCell from "./ConnectCell";
import { useEffect, useState } from "react";
import { useSocket } from "../../hooks/useSocket";
import {
  connectReset,
  connectWinner,
  tokenDropped,
} from "../../features/connect/connectSlice";
import { playerWon } from "../../features/room/roomSlice";
import { getSessionID } from "../../helper/cookies";

export default function ConnectBoard() {
  const { socket } = useSocket();
  const id = getSessionID();
  const [hoveredCell, setHoveredCell] = useState<number[] | null>(null);
  const currentPlayer = useAppSelector(
    (state) => state.connect!.details.currentPlayer,
  );
  const [disabled, setDisabled] = useState(currentPlayer !== id);

  const grid = useAppSelector((state) => state.connect!.details.grid);
  const [connected, setConnected] = useState<Array<Array<number>>>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    function handleConnectDrop(
      row: number,
      col: number,
      player: string,
      next: string,
    ) {
      dispatch(tokenDropped({ row, col, player, next }));
      setDisabled(next !== id);
    }

    function handleConnectWinner(
      player: string,
      coordinates: Array<Array<number>>,
    ) {
      setConnected(coordinates);
      dispatch(connectWinner(player));
      dispatch(playerWon(player));
    }

    function handleConnectDraw() {
      alert("Draw, the board will reset");
      dispatch(connectReset());
    }

    socket.on("connect-drop", handleConnectDrop);
    socket.on("connect-winner", handleConnectWinner);
    socket.on("connect-draw", handleConnectDraw);

    return () => {
      socket.off("connect-drop", handleConnectDrop);
      socket.off("connect-winner", handleConnectWinner);
      socket.off("connect-draw", handleConnectDraw);
    };
  });

  return (
    <div
      className="relative grid aspect-7/6 w-full max-w-210 grid-cols-7 items-center justify-center gap-2 rounded-2xl bg-gray-400 p-2"
      style={{
        gridTemplateRows: "repeat(6, 1fr)",
        gridTemplateColumns: "repeat(7, 1fr)",
      }}
    >
      {grid.map((arr, row) => (
        <Fragment key={`fragment-${row}`}>
          {arr.map((val, col) => (
            <ConnectCell
              col={col}
              row={row}
              key={`${row}-${col}`}
              value={
                hoveredCell != null &&
                row === hoveredCell[0] &&
                col === hoveredCell[1]
                  ? id
                  : val
              }
              setHoveredCell={setHoveredCell}
              setDisabled={setDisabled}
              disabled={disabled}
              winningTile={connected.some(
                (val) => val[0] === row && val[1] === col,
              )}
            />
          ))}
        </Fragment>
      ))}
    </div>
  );
}
