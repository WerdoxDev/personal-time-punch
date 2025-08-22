import Button from "@components/Button";
import { Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useModals } from "@stores/modalsStore";

export default function InfoModal() {
	const { info, updateModals } = useModals();

	function close() {
		updateModals({ info: { isOpen: false } });
	}

	return (
		<Dialog open={info.isOpen} onClose={close} transition className="relative z-50">
			<div className="fixed inset-0 top-8 flex w-screen items-center justify-center bg-black/40">
				<DialogPanel className="flex w-full max-w-xs flex-col items-center rounded-lg bg-background-700 p-5 shadow-xl">
					{info.status === "info" ? (
						<IconMingcuteInformationLine className="size-16 text-green-500" />
					) : info.status === "error" ? (
						<IconMingcuteAlertLine className="size-16 text-red-500" />
					) : (
						<IconMingcuteWarningFill className="size-16 text-amber-500" />
					)}
					<DialogTitle className="font-bold text-white text-xl">{info.title}</DialogTitle>
					<Description className="mt-2.5 text-center text-white/80">{info.text}</Description>
					<div className="mt-5 flex w-full items-center justify-center gap-x-2">
						<Button onClick={close} className="w-full" color="background-900">
							Close
						</Button>
						{info.onConfirm && (
							<Button
								onClick={async () => {
									await info.onConfirm?.();
									close();
								}}
								className="w-full"
								color="primary"
							>
								Confirm
							</Button>
						)}
					</div>
				</DialogPanel>
			</div>
		</Dialog>
	);
}
