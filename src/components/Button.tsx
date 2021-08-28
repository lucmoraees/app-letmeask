import { ReactElement, ButtonHTMLAttributes } from "react";

import '../styles/button.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

const Button = (props: ButtonProps): ReactElement => {
    return (
        <button className="button" {...props} />
    );
};

export default Button;
  