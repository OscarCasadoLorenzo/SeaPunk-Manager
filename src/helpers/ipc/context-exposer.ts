import { exposeIpcContext } from './ipc-context';
import { exposeThemeContext } from './theme/theme-context';
import { exposeWindowContext } from './window/window-context';

export default function exposeContexts() {
  exposeWindowContext();
  exposeThemeContext();
  exposeIpcContext();
}
