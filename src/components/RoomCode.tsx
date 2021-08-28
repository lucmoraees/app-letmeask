import { ReactElement } from "react";
import '../styles/room-code.scss'
import copyImg from '../assets/images/copy.svg';

type RoomCode = {
	code: string
}

const RoomCode = ({ code }: RoomCode): ReactElement => {
	const copiarRoomCode = () => {
		navigator.clipboard.writeText(code);
	}

	return (
		<button className="room-code" onClick={copiarRoomCode}>
			<div>
				<img src={copyImg} alt="Copiar código" />
			</div>
			<span>{code}</span>
		</button>
	);
}

export default RoomCode;
