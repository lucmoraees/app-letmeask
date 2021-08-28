import { ReactElement, ReactNode } from 'react';

import '../styles/question.scss';

type QuestionProps = {
	content: string,
	author: {
		name: string,
		avatar: string;
	}
	children?: ReactNode;
	isAnswered: boolean;
	isHighLighted: boolean;
}

const Question = ({ content, isAnswered = false, isHighLighted = false, author, children }: QuestionProps): ReactElement => {
	return (
		<div className={`question ${isAnswered ? "answered" : ""} ${isHighLighted && !isAnswered ? "highlighted" : ""}`}>
			<p>{content}</p>
			<footer>
				<div className="user-info">
					<img src={author.avatar} alt="Avatar ded perfil" />
					<span>{author.name}</span>
				</div>
				<div>
					{children}
				</div>
			</footer>
		</div>
	);
};

export default Question;
