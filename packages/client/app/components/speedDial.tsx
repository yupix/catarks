import { IconPencil } from "@tabler/icons";
import { useModalState } from "~/states/common";

export const SpeedDial = () => {
  return (
    <div data-dial-init className="fixed right-6 bottom-6 group">
      <button
        type="button"
        onClick={() => {
          useModalState.isOpenedPriceRepost = true;
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
