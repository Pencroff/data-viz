import { IconMoon, IconSun, IconSunMoon } from '@tabler/icons-preact';
import { useEffect, useState } from 'preact/hooks';
import Dropdown from 'react-bootstrap/Dropdown';

const localStorageKey = 'dark-mode-toggle-value';
const lightValue = 'light';
const sysValue = 'system';
const darkValue = 'dark';

export const DarkModeToggle = () => {
	const [variantMode, setVariantMode] = useState(() =>
		window.matchMedia('(prefers-color-scheme: dark)').matches
			? darkValue
			: lightValue,
	);
	const [themeMode, setThemeMode] = useState(() => {
		const value = localStorage.getItem(localStorageKey);
		if (value === lightValue || value === sysValue || value === darkValue) {
			return value;
		}
		return sysValue;
	});

	useEffect(() => {
		const themeAttr = updateThemeAttribute(themeMode);
		setVariantMode(themeAttr);
	}, [themeMode]);

	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

		const handleMediaQueryChange = (event) => {
			setThemeMode(event.matches ? darkValue : lightValue);
		};

		mediaQuery.addEventListener('change', handleMediaQueryChange);

		return () => {
			mediaQuery.removeEventListener('change', handleMediaQueryChange);
		};
	}, []);

	const handleSelect = (eventKey) => {
		setThemeMode(eventKey);
	};

	return (
		<Dropdown onSelect={handleSelect}>
			<Dropdown.Toggle variant={variantMode} title={themeMode}>
				{themeMode === lightValue ? (
					<IconSun />
				) : themeMode === darkValue ? (
					<IconMoon />
				) : (
					<IconSunMoon />
				)}
			</Dropdown.Toggle>

			<Dropdown.Menu>
				<Dropdown.Item eventKey={sysValue} active={themeMode === sysValue}>
					<IconSunMoon />
					&nbsp;System
				</Dropdown.Item>
				<Dropdown.Item eventKey={lightValue} active={themeMode === lightValue}>
					<IconSun />
					&nbsp;Light
				</Dropdown.Item>
				<Dropdown.Item eventKey={darkValue} active={themeMode === darkValue}>
					<IconMoon />
					&nbsp;Dark
				</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	);
};

function updateThemeAttribute(v) {
	localStorage.setItem(localStorageKey, v);
	let theme = v;
	if (v === sysValue) {
		theme = window.matchMedia('(prefers-color-scheme: dark)').matches
			? darkValue
			: lightValue;
	}
	document.documentElement.setAttribute('data-bs-theme', theme);
	return theme;
}
