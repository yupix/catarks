import { Modal, useMantineTheme } from "@mantine/core"
import { useSnapshot } from "valtio"
import { useModalState } from "~/states/common"

export const ReportPriceModal = () => {
  const isOpen = useSnapshot(useModalState).isOpenedPriceRepost
  const theme = useMantineTheme();
  return (
    <Modal
      overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
      overlayOpacity={0.55}
      overlayBlur={3}
      opened={isOpen}
      onClose={() => useModalState.isOpenedPriceRepost = false}
      title="Introduce yourself!"
    >
      {/* Modal content */}
    </Modal >
  )
}