import { ReactElement } from "react";
import { useHistory, useParams } from "react-router-dom";
import '../styles/room.scss';

import Question from '../components/Question';
import RoomCode from '../components/RoomCode';

import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';

import Button from "../components/Button";
import useRoom from '../hooks/useRoom';

import '../styles/question.scss';
import { database } from "../services/firebase";

type ParamsRoom = {
	id: string;
}

const AdminRoom = (): ReactElement => {
	const history = useHistory();
	const { id: roomId } = useParams<ParamsRoom>();
	const { title, questions } = useRoom(roomId);

	const handleEndRoom = async () => {
		database.ref(`rooms/${roomId}`).update({
			endedAt: new Date()
		})
		
		history.push('/')
	}

	const handleDeleteQuestion = async (id: string) => {	
		if (window.confirm("Você tem certeza que deseja excluir esssa pergunta?")) {
			const questionRef = await database.ref(`rooms/${roomId}/questions/${id}`).remove();
		}
	}

	const handleQuestionIsAnswered = async (id: string) => {
		const questionRef = await database.ref(`rooms/${roomId}/questions/${id}`).update({
			isAnswered: true
		});
	}

	const handleHighLightedtQuestion = async (id: string) => {
		const questionRef = await database.ref(`rooms/${roomId}/questions/${id}`).update({
			isHighLighted: true
		});
	}

	return (
		<div id="page-room">
			<header>
				<div className="content">
					<img src={logoImg} alt="" />
					<div>
						<RoomCode code={roomId} />
						<Button onClick={() => handleEndRoom()}>
							Encerrar sala
						</Button>
					</div>
				</div>
			</header>
			<main>
				<div className="room-title">
					<h1>Sala {title}</h1>
					<span>{questions.length} {questions.length === 1 ? "Pergunta" : "Perguntas" }</span>
				</div>
				<div className="question-list">
					{questions.length ? questions.map(question => (
						<Question
							key={question.id}
							content={question.content}
							author={question.author}
							isAnswered={question.isAnswered}
							isHighLighted={question.isHighLighted}
						>
							{!question.isAnswered && (
								<>			
									<button
										type="button"
										onClick={() => handleQuestionIsAnswered(question.id)}
									>
										<img src={checkImg} alt="Marcar como respondida" />
									</button>
									<button
										type="button"
										onClick={() => handleHighLightedtQuestion(question.id)}
									>
										<img src={answerImg} alt="Dar destaque a pergunta" />
									</button>
								</>
							)}
							<button
								type="button"
								onClick={() => handleDeleteQuestion(question.id)}
							>
								<img src={deleteImg} alt="Deletar pergunta" />
							</button>
						</Question>
					)) : (
						<div />
					)}
				</div>
			</main>
		</div>
	);
};

export default AdminRoom;
