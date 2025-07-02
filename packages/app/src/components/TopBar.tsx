import { useWindow } from "@stores/windowStore";
import Icon from "./Icon";

export default function TopBar() {
	const thisWindow = useWindow();

	async function minimize() {
		window.electronAPI.minimize();
	}

	async function maximize() {
		window.electronAPI.toggleMaximize();
	}

	async function close() {
		window.electronAPI.hideMain();
	}

	return (
		<div className="drag-region flex h-8 w-full shrink-0 select-none items-center bg-background-700">
			<Icon className="mx-2 size-5 text-accent" />
			<div className="w-max text-white">Personal Time Punch</div>
			<div className="no-drag-region ml-auto flex h-full">
				<button type="button" onClick={minimize} className="flex cursor-pointer items-center justify-center px-2.5 hover:bg-background-800">
					<IconMingcuteMinimizeFill className="size-5 text-white/80 group-hover:text-white/100" />
				</button>
				<button type="button" onClick={maximize} className="group flex cursor-pointer items-center justify-center px-2.5 hover:bg-background-800">
					{thisWindow.maximized ? (
						<IconMingcuteFullscreenExitFill className="size-5 text-white/80 group-hover:text-white/100" />
					) : (
						<IconMingcuteFullscreenFill className="size-5 text-white/80 group-hover:text-white/100" />
					)}
				</button>
				<button type="button" onClick={close} className="group flex cursor-pointer items-center justify-center px-2.5 hover:bg-background-800">
					<IconMingcuteCloseFill className="size-5 text-red-400" />
				</button>
			</div>
		</div>
	);
}
