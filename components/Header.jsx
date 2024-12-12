import 'preact/compat';
import { DarkModeToggle } from './DarkModeToggle.jsx';

export function Header({ title }) {
	return (
		<div className="d-flex flex-row justify-content-between px-1 py-3">
			<h1 className="me-auto">{title}</h1>
			<DarkModeToggle />
		</div>
	);
}
