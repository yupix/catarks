import { IconPencil } from "@tabler/icons";
import { useOptionalUser } from "~/utils/utils";
import {
  Dialog,
  DialogTrigger,

} from "@/components/ui/dialog"
import { ReportPriceModal } from "./modals/reportPrice";
import { Button } from "./ui/button";
export function SpeedDial() {
  // const setModalState = useSetAtom(useModalState)
  const session = useOptionalUser();
  return (
    <>{session?.user ?
      <div className="fixed right-6 bottom-6 group">
        <Dialog modal={false}>
          <DialogTrigger>


            <Button variant="outline" size="icon" asChild>
              <IconPencil />
            </Button>
          </DialogTrigger>
          <ReportPriceModal />

        </Dialog> </div> : null}
    </>
  );
};
