import { DarkModeToggle } from '$cmp/DarkModeToggle';
import { renderToDom } from '$lib';
import { App } from './app';
import './style.scss';

renderToDom('toggle', DarkModeToggle);
renderToDom('root', App);
