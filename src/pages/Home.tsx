import { ReactElement, FormEvent, useState } from 'react';
import { useHistory } from 'react-router';
import useAuth from '../hooks/useAuth';

import illustration from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIcon from '../assets/images/google-icon.svg';

import Button from '../components/Button';

import '../styles/auth.scss';
import { database } from '../services/firebase';

const Home = (): ReactElement => {
	const history = useHistory();
	const { user, signInWithGoogle} = useAuth();
	const [roomCode, setRoomCode] = useState<string>('');

	const handleCreateRoom = async () => {
		if (!user) {
			await signInWithGoogle();
		}

		history.push('/rooms/new')
	}

	const handleJoinRoom = async (event: FormEvent) => {
		event.preventDefault();

		if (roomCode.trim() === '') {
			return;
		}

		const roomRef = await database.ref(`rooms/${roomCode}`).get();
	
		if (!roomRef.exists()) {
			alert('Código da sala inválido!');
			return;
		}

		if (roomRef.val().endedAt) {
			alert('Sala já encerrada!');
			return;
		}

		history.push(`/rooms/${roomCode}`);
	}

	return (
		<div id="page-auth">
			<aside>
				<img src={illustration} alt="ilustração"/>
				<strong>Crie salas de Q&amp;A ao-vivo</strong>
				<p>Tire as dúvidas da sua udiência em tempo real.</p>
			</aside>
			<main>
				<div className="main-content">
					<img src={logoImg} alt="letmeask" />
					<button className="create-room" onClick={handleCreateRoom}>
						<img src={googleIcon} alt="Logo do google" />
						Crie sua sala com o Google
					</button>
					<div className="separator">Ou entre em uma sala</div>
					<form onSubmit={event => handleJoinRoom(event)}>
						<input 
							type="text" 
							placeholder="Digite o código da sala" 
							onChange={(e) => setRoomCode(e.target.value)}	
						/>
						<Button type="submit">Entrar na sala</Button>
					</form>
				</div>
			</main>
		</div>
	);
};

export default Home;
