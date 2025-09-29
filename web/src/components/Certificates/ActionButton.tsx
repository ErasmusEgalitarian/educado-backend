import { Icon } from "@mdi/react";

type propTypes = {
	children: React.ReactNode;
	className?: string;
	onClick?: () => void;
	icon?: string;
	id?: string;
}

export default function ActionButton(props: propTypes) {

	return (
		<button id={props.id} className="std-button rounded-lg px-7 cursor-pointer" onClick={props.onClick}>
			{props.children}
			{props.icon ? <Icon path={props.icon} className='w-6 h-6 text-white float-right' /> : null}
		</button>
	)
}