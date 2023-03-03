import { IconPencil } from "@tabler/icons";
import { useSetAtom } from "jotai";
import { useModalState } from "~/states/common";

export function SpeedDial() {
  const setModalState = useSetAtom(useModalState)
  return (
    <div data-dial-init className="fixed right-6 bottom-6 group">
      <button
        type="button"
        onClick={() => {
          setModalState({isOpenedPriceRepost: true});
        }}
        aria-expanded="false"
        className="flex items-center justify-center text-white bg-primary hover:bg-primary-focus rounded-lg w-14 h-14 focus:ring-4 focus:ring-blue-300 focus:outline-none"
      >
        <IconPencil />
        <span className="sr-only">Open actions menu</span>
      </button>
    </div>
  );
};
