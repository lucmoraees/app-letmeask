import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import useAuth from "./useAuth";

type Questions = {
	id: string,
	author: {
		name: string,
		avatar: string,
	}
	content: string,
	isAnswered: boolean,
	isHighLighted: boolean,
	likeCount: number,
	likeId: string | undefined,
}

type FireBaseQuestions = Record<string, {
	author: {
		name: string,
		avatar: string,
	}
	likes: Record<string, { authorId: string }>,
	content: string,
	isAnswered: boolean,
	isHighLighted: boolean,
	likeCount: number,
}>

const useRoom = (roomId: string) => {
	const { user } = useAuth();
	const [questions, setQuestions] = useState<Questions[]>([])
	const [title, setTitle] = useState<string>('');
	
	useEffect(() => {
		const roomRef = database.ref(`rooms/${roomId}`);
		
		roomRef.on('value', room => {
			const fireBaseQuestions: FireBaseQuestions = room.val().questions;

			const parsedQuestions = Object.entries(fireBaseQuestions ?? {}).map(([ key, value ]) => {
				return {
					id: key,
					content: value.content,
					author: value.author,
					isAnswered: value.isAnswered,
					isHighLighted: value.isHighLighted,
					likeCount: Object.values(value.likes ?? {}).length,
					likeId: Object.entries(value.likes ?? {}).find(([kew, like]) => like.authorId === user?.id)?.[0],
				};
			});
			setQuestions(parsedQuestions);
			setTitle(room.val().title)
		});

		return () => {
			roomRef.off('value');
		}
	}, [roomId, user?.id]);

  return { questions, title }
}

export default useRoom;